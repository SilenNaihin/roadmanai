import express, { Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();

// Create upload directory if it doesn't exist
const uploadDir = path.resolve(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `tmp-${file.originalname}`);
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

    // Construct the absolute file path to whisper.py
    const scriptPath = path.join(__dirname, 'whisper.py');

    let sCommand = `python "${scriptPath}" --filePath "${filePath}"`;

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
      }
    });
  }
);

app.post('/completion', (req: Request, res: Response) => {
  const scriptPath = path.join(__dirname, 'completion.py');
  console.log(req.body);

  let sCommand = `python "${scriptPath}" --text "${req.body.transcript}"`;

  exec(sCommand, (err, stdout, stderr) => {
    if (err) {
      res.send({ status: 300, error: err.message, out: null, file: null });
    } else {
      const json = JSON.parse(stdout);
      const translation = json.text;
      res.send({
        status: 200,
        error: stderr,
        out: stdout,
        file: req.file,
        translation,
      });
    }
  });
});

app.post('/eleven', (req: Request, res: Response) => {
  const scriptPath = path.join(__dirname, 'eleven.py');
  console.log(req.body);
});

const port = 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));
