'use client';

import React, { useEffect, useState } from 'react';
import AskBox from './AskBox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

type Options = 'translate' | 'ask';

const Input: React.FC = () => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [translateType, setTranslateType] = useState<Options>('translate');

  const [transcription, setTranscription] = useState<string>('');
  const [selectFocused, setSelectFocused] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent, text: string) => {
    e.preventDefault();
    if (!audioFile) return;

    setTranscription(text);
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
    <div className="w-full flex flex-col items-center mb-16">
      {transcription ? (
        <div className="mb-auto">{transcription}</div>
      ) : (
        <>
          <div className="relative inline-flex mb-2">
            <FontAwesomeIcon
              className={`absolute top-0 right-0 m-3 pointer-events-none ${
                !selectFocused ? '' : 'hidden'
              }`}
              icon={faChevronDown}
            />
            <FontAwesomeIcon
              className={`absolute top-0 right-0 m-3 pointer-events-none ${
                selectFocused ? '' : 'hidden'
              }`}
              icon={faChevronUp}
            />
            <select
              onBlur={() => setSelectFocused(false)}
              onClick={() => setSelectFocused(!selectFocused)}
              onChange={(e) =>
                setTranslateType(e.target.value as 'translate' | 'ask')
              }
              className="border border-gray-300 rounded-full h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none font-bold"
            >
              <option value="translate">Translate</option>
              <option value="ask">Ask</option>
            </select>
          </div>
          {translateType === 'translate' ? (
            <AskBox
              placeholder="Translate your text to roadman..."
              setAudioFile={setAudioFile}
              handleFormSubmit={handleFormSubmit}
            />
          ) : (
            <AskBox
              placeholder="Ask a roadman a question..."
              setAudioFile={setAudioFile}
              handleFormSubmit={handleFormSubmit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Input;
