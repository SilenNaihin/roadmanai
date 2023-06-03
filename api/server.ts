import express, { Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import next from 'next';
import { parse } from 'url';
import { NextServer, RequestHandler } from 'next/dist/server/next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp: NextServer = next({ dev });

console.log(nextApp);

const nextHandler: RequestHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();

  interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }

  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    return nextHandler(req, res, parsedUrl);
  });

  // Create upload directory if it doesn't exist
  const uploadDir = path.resolve(__dirname, '../public/uploads');

  // Multer setup
  const storage = diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `tmp-audio.webm`);
    },
  });

  const upload = multer({ storage });

  app.use(cors());
  app.use(express.json());

  app.post(
    '/transcribe',
    upload.single('audioFile'),
    (req: MulterRequest, res: Response) => {
      const filePath = req.file?.path;

      let sCommand = `python -m api.whisper --filePath "${filePath}"`;

      exec(sCommand, (err, stdout, stderr) => {
        if (err) {
          res.send({ status: 300, error: err.message, out: null, file: null });
        } else {
          const json = JSON.parse(stdout);
          const transcript = json.text;
          res.send({
            status: 200,
            error: stderr,
            out: stdout,
            file: req.file,
            transcript,
          });

          // Delete the file
          fs.unlink(`${uploadDir}/tmp-audio.webm`, (err) => {
            if (err) {
              console.error('Could not delete file: ', err);
            }
          });
        }
      });
    }
  );

  app.post('/completions', (req: Request, res: Response) => {
    console.log('server response');
    let sCommand = `python -m api.completions --text "${req.body.transcript}" --type "${req.body.type}"`;

    exec(sCommand, (err, stdout, stderr) => {
      if (err) {
        res.send({ status: 300, error: err.message, out: null, file: null });
      } else {
        const json: { translate: string; phonetic: string } =
          JSON.parse(stdout);
        res.send({
          status: 200,
          error: stderr,
          out: stdout,
          file: req.file,
          translation: json.translate,
          phonetic: json.phonetic,
        });
      }
    });
  });

  let { env } = process;
  env.PATH += ';C:\\Program Files\\ffmpeg\\bin';

  app.post('/eleven', (req: Request, res: Response) => {
    let sCommand = `python -m api.eleven --text "${req.body.speech}"`;

    exec(sCommand, { env: env }, (err, stdout, stderr) => {
      if (err) {
        res.send({ status: 300, error: err.message, out: null, file: null });
      } else {
        res.send({
          status: 200,
          error: stderr,
          out: stdout,
          file: req.file,
          responseAudio: stdout,
        });
      }
    });
  });

  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
