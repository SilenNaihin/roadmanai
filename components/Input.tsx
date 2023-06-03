'use client';

import React, { useEffect, useState } from 'react';
import AskBox from './AskBox';
import ResponseBox from './ResponseBox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

type Options = 'translate' | 'ask';

const Input: React.FC = () => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [responseAudio, setResponseAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [translateType, setTranslateType] = useState<Options>('translate');

  const [transcription, setTranscription] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [selectFocused, setSelectFocused] = useState<boolean>(false);

  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [translating, setTranslating] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent, text: string) => {
    e.preventDefault();
    if (!text) return;

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

  const convertResponseAudio = (hex_string: string) => {
    const hexArray = hex_string.match(/.{1,2}/g);
    const byteArray = new Uint8Array(
      hexArray ? hexArray.map((byte) => parseInt(byte, 16)) : []
    );

    if (!byteArray) throw new Error('Invalid byte array');

    const blob = new Blob([byteArray], { type: 'audio/mp3' });
    const blobUrl = URL.createObjectURL(blob);
    const convertedAudioResponse = new Audio(blobUrl);
    setResponseAudio(convertedAudioResponse);
  };

  useEffect(() => {
    const generateRoadman = async () => {
      if (!transcription) return;

      try {
        setTranslating(true);

        const completionResponse = await fetch(
          'http://localhost:3001/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcript: transcription.trimEnd(),
              type: translateType,
            }),
          }
        );

        const completionData = await completionResponse.json();

        setTranslating(false);

        const roadmanTing: string = completionData.translation;
        const roadmanTalk: string = completionData.phonetic;

        setTranslation(roadmanTing);

        setAudioPlaying(true);

        console.log('translated, generating speech...', roadmanTalk);

        const generateSpeech = await fetch('http://localhost:3001/eleven', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            speech: roadmanTalk,
          }),
        });

        const speechData = await generateSpeech.json();

        setAudioPlaying(false);

        convertResponseAudio(speechData.responseAudio);
      } catch (error) {
        console.log(error);
        setAudioPlaying(false);
      }
    };

    generateRoadman();
  }, [transcription]);

  return (
    <div className="w-full h-full mt-32 flex flex-col items-center mb-16">
      {transcription ? (
        <ResponseBox
          transcription={transcription}
          translation={translation}
          audioPlaying={audioPlaying}
          translating={translating}
          responseAudio={responseAudio}
          setAudioPlaying={setAudioPlaying}
        />
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
