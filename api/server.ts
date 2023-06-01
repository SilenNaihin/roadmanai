import express, { Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();

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

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

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

app.post('/completion', (req: Request, res: Response) => {
  console.log('transcript', req.body.transcript);

  let sCommand = `python -m api.completion --text "${req.body.transcript}"`;

  exec(sCommand, (err, stdout, stderr) => {
    if (err) {
      res.send({ status: 300, error: err.message, out: null, file: null });
    } else {
      res.send({
        status: 200,
        error: stderr,
        out: stdout,
        file: req.file,
        translation: stdout,
      });
    }
  });
});

app.post('/eleven', (req: Request, res: Response) => {
  console.log('eleven', req.body.speech);

  let sCommand = `python -m api.eleven --text "${req.body.speech}"`;

  exec(sCommand, (err, stdout, stderr) => {
    if (err) {
      res.send({ status: 300, error: err.message, out: null, file: null });
    } else {
      res.send({
        status: 200,
        error: stderr,
        out: stdout,
        file: req.file,
        translation: stdout,
      });
    }
  });
});

const port = 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));
