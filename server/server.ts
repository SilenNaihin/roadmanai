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

app.post(
  '/upload',
  upload.single('audioFile'),
  (req: MulterRequest, res: Response) => {
    console.log(req.file);
    const filePath = req.file?.path;

    console.log(filePath);

    // Construct the absolute file path to whisper.py
    const scriptPath = path.join(__dirname, 'whisper.py');

    let sCommand = `python ${scriptPath} --path '${filePath}'`;

    exec(sCommand, (err, stdout, stderr) => {
      if (err) {
        res.send({ status: 300, error: err.message, out: null, file: null });
      } else {
        const transcript = stdout;
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

const port = 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));
