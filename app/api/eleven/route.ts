import { NextRequest, NextResponse } from 'next/server';
import { exec as execCb } from 'child_process';
import util from 'util';

const exec = util.promisify(execCb);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const sCommand = `python -m app.api.eleven.eleven --text "${data.speech}"`;

  let { env } = process;
  env.PATH += ';C:\\Program Files\\ffmpeg\\bin';

  try {
    const { stdout, stderr } = await exec(sCommand);

    return NextResponse.json({
      status: 200,
      error: stderr,
      out: stdout,
      responseAudio: stdout,
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
