'use client';

import React, { useEffect, useState, useRef } from 'react';

import { Options } from '../app/types/options';
import AudioRecorder from './AudioRecorder';
import axios from 'axios';

const Input: React.FC = () => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [text, setText] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('text', text);
  };

  useEffect(() => {
    const transcribeAndComplete = async () => {
      if (!audioFile) return;

      const formData = new FormData();
      formData.append('audioFile', audioFile, 'audio.webm');

      try {
        const transcriptionResponse = await fetch(
          'http://localhost:3001/transcribe',
          {
            method: 'POST',
            body: formData,
          }
        );

        const transcriptionData = await transcriptionResponse.json();

        console.log(transcriptionData);

        // Perform validation or error handling here based on transcriptionData

        const completionResponse = await fetch(
          'http://localhost:3001/completion',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: transcriptionData.transcript }),
          }
        );

        const completionData = await completionResponse.json();

        // Perform validation or error handling here based on completionData

        console.log(completionData);
        // setData(completionData);
      } catch (error) {
        // Handle errors here
      }
    };

    transcribeAndComplete();
  }, [audioFile]);

  return (
    <div>
      <h1>Ask</h1>
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
      <h1>Talk</h1>
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
