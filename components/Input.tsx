'use client';

import React, { useEffect, useState } from 'react';
import AskBox from './AskBox';
import ResponseBox from './ResponseBox';
import { TranslationType, ParentProps } from './Parent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import ResponseBottom from './ResponseBottom';

const Input: React.FC<ParentProps> = ({ translateType, setTranslateType }) => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [responseAudio, setResponseAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const [transcription, setTranscription] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [selectFocused, setSelectFocused] = useState<boolean>(false);

  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audioPaused, setAudioPaused] = useState<boolean>(false);
  const [translating, setTranslating] = useState<boolean>(false);
  const [response, setResponse] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent, text: string) => {
    e.preventDefault();
    if (!text) return;

    setTranscription(text);
  };

  const transcribe = async (audioFile: Blob) => {
    const formData = new FormData();
    formData.append('audioFile', audioFile, 'audio.webm');

    const transcriptionResponse = await fetch(`/api/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`HTTP error! status: ${transcriptionResponse.status}`);
    }

    return await transcriptionResponse.json();
  };

  useEffect(() => {
    const transcribeAudio = async () => {
      if (!audioFile) return;

      try {
        setLoading(true);
        const transcriptionData = await transcribe(audioFile);
        setLoading(false);
        setTranscription(transcriptionData.transcript.text);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
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
    return convertedAudioResponse;
  };

  const playAudio = async (audioEl: HTMLAudioElement | null) => {
    if (!audioEl) return;
    try {
      if (audioPlaying) {
        audioEl.pause();
        setAudioPaused(true);
        setAudioPlaying(false);
        return;
      }

      setAudioPaused(false);
      setAudioPlaying(true);

      audioEl.play().then(() => {
        audioEl.onended = () => {
          setAudioPlaying(false);
        };
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioPlaying(false);
    }
  };

  const generateTranslation = async (
    transcript: string,
    type: TranslationType
  ) => {
    const response = await fetch(`/api/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        type,
      }),
    }).catch((error) => {
      console.error('Fetch error:', error);
    });

    if (!response?.ok) {
      throw new Error(`HTTP error! status: ${response?.status}`);
    }

    const { translation } = await response.json();

    return translation;
  };

  const generateSpeech = async (translation: string): Promise<string> => {
    const response: Response = await fetch(`/api/phonetic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        translation,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { phonetic: speech } = await response.json();

    const generateSpeechResponse = await fetch(`api/eleven`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speech,
      }),
    });

    if (!generateSpeechResponse.ok) {
      throw new Error(`HTTP error! status: ${generateSpeechResponse.status}`);
    }

    const { responseAudio } = await generateSpeechResponse.json();

    return responseAudio;
  };

  useEffect(() => {
    const handleTranslation = async () => {
      if (!transcription) return;
      setTranslation('');
      setResponseAudio(null);
      setResponse(true);

      try {
        setTranslating(true);
        const translation = await generateTranslation(
          transcription.trimEnd(),
          translateType
        );
        setTranslation(translation);
        setTranslating(false);

        setLoading(true);

        const responseAudio = await generateSpeech(translation);
        const audioEl: HTMLAudioElement = convertResponseAudio(responseAudio);

        setLoading(false);
        playAudio(audioEl);
      } catch (err: any) {
        console.error(err.message);
        setTranslating(false);
        setAudioPlaying(false);
      }
    };

    handleTranslation();
  }, [transcription]);

  return (
    <div className="w-full h-full lg:px-12 md:px-4 flex flex-col items-center justify-center">
      {response ? (
        <>
          <ResponseBox
            transcription={transcription}
            translation={translation}
            audioPlaying={audioPlaying}
            translating={translating}
            responseAudio={responseAudio}
            playAudio={playAudio}
            audioPaused={audioPaused}
            loading={loading}
          />
        </>
      ) : loading ? (
        <FontAwesomeIcon className="px-6" size="2xl" spin icon={faGear} />
      ) : (
        <>
          <div className="relative inline-flex mb-2 pb-4">
            <FontAwesomeIcon
              width={16}
              height={16}
              className={`absolute top-0 right-0 m-3 pointer-events-none ${
                !selectFocused ? '' : 'hidden'
              }`}
              color="white"
              icon={faChevronDown}
            />
            <FontAwesomeIcon
              width={16}
              height={16}
              className={`absolute top-0 right-0 m-3 pointer-events-none ${
                selectFocused ? '' : 'hidden'
              }`}
              color="white"
              icon={faChevronUp}
            />
            <select
              onBlur={() => setSelectFocused(false)}
              onClick={() => setSelectFocused(!selectFocused)}
              onChange={(e) =>
                setTranslateType(e.target.value as 'translate' | 'ask')
              }
              className="border text-white rounded-full h-10 pl-5 pr-10 bg-white focus:outline-none appearance-none font-bold"
              style={{
                background:
                  'linear-gradient(to bottom right, #0088cc, #663399)',
              }}
            >
              <option className="text-black" value="ask">
                Ask
              </option>
              <option className="text-black" value="translate">
                Translate
              </option>
            </select>
          </div>
          <AskBox
            placeholder={
              translateType === 'translate'
                ? 'Translate your text to roadman...'
                : 'Ask a roadman a question...'
            }
            setAudioFile={setAudioFile}
            handleFormSubmit={handleFormSubmit}
          />
        </>
      )}
      {responseAudio && !loading && (
        <ResponseBottom
          response={response}
          audioPlaying={audioPlaying}
          translating={translating}
          setResponse={setResponse}
          audioEl={responseAudio}
          transcription={transcription}
        />
      )}
    </div>
  );
};

export default Input;
