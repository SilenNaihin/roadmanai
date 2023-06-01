'use client';

import React, { useEffect, useState, useRef } from 'react';

import { Options } from '../app/types/options';
import AudioRecorder from './AudioRecorder';
import axios from 'axios';

const Input: React.FC = () => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [text, setText] = useState<string>('');

  const [transcription, setTranscription] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('text', text);
  };

  useEffect(() => {
    const transcribeAudio = async () => {
      if (!audioFile) return;

      const formData = new FormData();
      formData.append('audioFile', audioFile);

      try {
        const transcriptionResponse = await fetch(
          'http://localhost:3001/transcribe',
          {
            method: 'POST',
            body: formData,
          }
        );

        const transcriptionData = await transcriptionResponse.json();

        setTranscription(transcriptionData.transcript);

        console.log('transcripted', transcriptionData.transcript);
      } catch (error) {
        console.log(error);
      }
    };

    transcribeAudio();
  }, [audioFile]);

  useEffect(() => {
    const generateRoadman = async () => {
      if (!transcription) return;

      try {
        // Perform validation or error handling here based on transcriptionData

        const completionResponse = await fetch(
          'http://localhost:3001/completion',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcript: transcription,
            }),
          }
        );

        const completionData = await completionResponse.json();

        const roadmanTing = completionData.translation;

        console.log('translated, generating speech...', roadmanTing);

        const generateSpeech = await fetch('http://localhost:3001/eleven', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            speech: roadmanTing,
          }),
        });

        const speechData = await generateSpeech.json();

        console.log(speechData);
      } catch (error) {
        console.log(error);
      }
    };

    generateRoadman();
  }, [transcription]);

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
      <AudioRecorder
        setAudioFile={setAudioFile}
        transcription={transcription}
      />
    </div>
  );
};

export default Input;
