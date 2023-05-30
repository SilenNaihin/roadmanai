'use client';

import React, { useEffect, useState, useRef } from 'react';

import { Options } from '../app/types/options';
import AudioRecorder from './AudioRecorder';

const Input: React.FC = () => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [text, setText] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append(
      'options',
      JSON.stringify({
        model: process.env.WHISPER_MODEL,
        language: 'language_value',
        task: 'task_value',
      })
    );

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [audioFile]);

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          className="border"
          type="text"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-red-100" type="submit">
          Submit Text
        </button>
      </form>
      <AudioRecorder setAudioFile={setAudioFile} />
    </div>
  );
};

export default Input;

// import { MediaStream, MediaRecorder } from 'mediastream';
// const audioRef = useRef<HTMLAudioElement | null>(null);

// // replace all this.state calls with useState hooks
// const [data, setData] = useState<string[]>([]);
// const [progress, setProgress] = useState<number>(0);
// const [started, setStarted] = useState<boolean>(false);

// const [selected, setSelected] = useState<string>('');
// const [error, setError] = useState<boolean>(false);
// const [sendStatus, setSendStatus] = useState<number>(0);

// const [recording, setRecording] = useState<boolean>(false);
// const [countDown, setCountDown] = useState<boolean>(false);
// const [count, setCount] = useState<number>(0);

// const [openDialog, setOpenDialog] = useState<boolean>(false);
// const [duration, setDuration] = useState<number>(5);
// const [model, setModel] = useState<string>('tiny');
// const [task, setTask] = useState<string>('translate');

// const [playDuration, setPlayDuration] = useState<number>(0);

// const MAX_COUNT = 10;
// const MIN_DECIBELS = -45;
// const MAX_PAUSE = 3000;

// // animFrame = null;
// // countTimer = null;
// // audioDomRef = null;
// // abortController = null;

// // replace this.chunks with a useRef hook
// const chunks = useRef<(Blob | null)[]>([]);

// const sendData = async (
//   file: File,
//   options: Options,
//   signal: AbortSignal
// ) => {
//   let formData = new FormData();
//   formData.append('file', file);
//   formData.append('options', JSON.stringify(options));

//   try {
//     const resp = await fetch('/api/transcribe', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//       },
//       body: formData,
//       signal: signal,
//     });

//     return await resp.json();
//   } catch (err) {
//     console.error(err);
//   }
// };

// const formatData = (data) => {
//   return data
//     .split('\n')
//     .filter((item) => item.length > 0)
//     .filter((item) => item.indexOf('[') === 0);
// };

// ... add other functions here

// const handleStream = (stream: MediaStream) => {
//   // The MediaRecorder type needs to be properly defined depending on your context.
//   // The MediaRecorder type used here is generic and may need to be adjusted based on your actual usage and types.
//   const mediaRec: MediaRecorder = new MediaRecorder(stream);

//   mediaRec.addEventListener('dataavailable', (e: BlobEvent) => {
//     chunks.push(e.data);
//   });
//   mediaRec.addEventListener('stop', handleStop);

//   checkAudioLevel(stream);
// };

// const handleError = (error: any) => {
//   console.log(error);
//   setState((prevState) => ({ ...prevState, error: true }));
// };

// const handleStart = () => {
//   setStarted(true);
// };

// ... add other handlers here
