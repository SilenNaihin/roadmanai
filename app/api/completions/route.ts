import { NextRequest, NextResponse } from 'next/server';
import { exec as execCb } from 'child_process';
import util from 'util';

const exec = util.promisify(execCb);

export async function POST(req: NextRequest) {
  const data = await req.json();

  const sCommand = `python -m app.api.completions.completions --text "${data.transcript}" --type "${data.type}"`;

  try {
    const { stdout, stderr } = await exec(sCommand);
    const json = JSON.parse(stdout.toString());

    return NextResponse.json({
      status: 200,
      error: stderr,
      out: stdout,
      translation: json.translate,
      phonetic: json.phonetic,
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
