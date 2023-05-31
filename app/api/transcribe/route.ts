import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import multer, { diskStorage } from 'multer';
import { exec, ExecException } from 'child_process';
import getConfig from 'next/config';
import fs from 'fs';

interface MulterRequest extends NextRequest {
  file: Express.Multer.File;
}

const upload = multer({ dest: 'tmp/' });

const router = createEdgeRouter<MulterRequest, NextResponse>();

router
  .use(async (req: MulterRequest, event, next) => {
    const start = Date.now();

    await next(); // call next in chain

    const end = Date.now();
    console.log(`Request took ${end - start}ms`);
  })
  .post(async (req: MulterRequest) => {
    const file = await req.formData();

    const mp3 = file.get('file');

    upload.single(mp3);

    const filename: string = req.file.path;
    const { serverRuntimeConfig } = getConfig();

    const outputDir: string =
      serverRuntimeConfig.PROJECT_ROOT + '/public/uploads';

    let sCommand: string = `python3 ./whisper.py --input './${filename}' --output_dir '${outputDir}'`;

    exec(
      sCommand,
      (
        err: ExecException | null,
        stdout: string | null,
        stderr: string | null
      ) => {
        if (err) {
          return NextResponse.json({
            status: 300,
            error: err.message,
            out: null,
            file: null,
          });
        } else {
          const transcript = stdout;
          return NextResponse.json({
            status: 200,
            error: stderr,
            out: stdout,
            file: req.file,
            transcript,
          });
        }
      }
    );
  });

export async function POST(req: MulterRequest, res: NextResponse) {
  return router.run(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
