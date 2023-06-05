import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { exec as execCb } from 'child_process';
import path from 'path';
import util from 'util';

const exec = util.promisify(execCb);

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData();
  const file = data.get('audioFile') as File;

  if (!file || typeof file === 'string') {
    return NextResponse.json({
      status: 400,
      error: 'No file selected',
    });
  }

  const uploadDir =
    process.env.NODE_ENV == 'production'
      ? '/tmp'
      : path.resolve(__dirname, '/public/uploads');
  const filename = `${Date.now()}-tmp-audio.webm`;
  const filePath = path.join(uploadDir, filename);

  // Check if uploadDir exists
  if (!fs.existsSync(uploadDir)) {
    // If not, create the directory
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const arrBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrBuffer);
  await fs.promises
    .writeFile(filePath, buffer, {
      encoding: 'binary',
    })
    .catch((err) => {
      console.error(err);
    });

  const sCommand = `python app/api/transcribe/whisper.py --filePath "${filePath}"`;

  try {
    console.log('Executing command:', sCommand);

    const { stdout, stderr } = await exec(sCommand);
    console.log('stdout, stderr', stdout, stderr);
    const json = JSON.parse(stdout.toString());
    const transcript = json.text;

    // Delete the file
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error('Could not delete file: ', err);
    }

    console.log(stdout, json);

    return NextResponse.json({
      status: 200,
      error: stderr,
      out: stdout,
      file: buffer,
      transcript,
    });
  } catch (err: any) {
    console.error('Error occurred:', err);
    return NextResponse.json({
      error: err.message,
      out: null,
      file: null,
      status: 300,
    });
  }
}
