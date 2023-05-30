import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer, { diskStorage } from 'multer';
import { exec, ExecException } from 'child_process';
import getConfig from 'next/config';

interface Options {
  model: string;
  language: string;
  task: string;
}

const upload = multer({
  storage: diskStorage({
    destination: 'public/uploads',
    filename: (
      req,
      file,
      cb: (error: Error | null, filename: string) => void
    ) => cb(null, `tmp-${file.originalname}`),
  }),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error: Error, req: Request, res: NextApiResponse) {
    res.status(501).json({ error: `Some error '${error.message}' happen` });
  },
  onNoMatch(req: Request, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
});

const uploadMiddleware = upload.single('file');

apiRoute.use(uploadMiddleware);

const { serverRuntimeConfig } = getConfig();

apiRoute.post((req: NextApiRequest, res: NextApiResponse) => {
  const options: Options = JSON.parse(req.body?.options as string);

  const filename: string = req.file.path;
  const outputDir: string =
    serverRuntimeConfig.PROJECT_ROOT + '/public/uploads';

  let sCommand: string = `whisper './${filename}' --model ${options.model} --language ${options.language} --task ${options.task} --output_dir '${outputDir}'`;

  exec(
    sCommand,
    (
      err: ExecException | null,
      stdout: string | null,
      stderr: string | null
    ) => {
      if (err) {
        res.send({ status: 300, error: err.message, out: null, file: null });
      } else {
        res.send({ status: 200, error: stderr, out: stdout, file: req.file });
      }
    }
  );
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
