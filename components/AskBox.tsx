import React, { useState, useEffect } from 'react';
import AudioRecorder from './AudioRecorder';

interface AskBoxProps {
  setAudioFile: React.Dispatch<React.SetStateAction<Blob | null>>;
  handleFormSubmit: (e: React.FormEvent, text: string) => void;
  placeholder: string;
  audioFile: Blob | null;
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
}

const AskBox: React.FC<AskBoxProps> = ({
  setAudioFile,
  handleFormSubmit,
  placeholder,
  audioFile,
  setTranscription,
}) => {
  const [text, setText] = useState<string>('');

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
        const transcriptionData = await transcribe(audioFile);
        setTranscription(transcriptionData.transcript.text);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    transcribeAudio();
  }, [audioFile]);

  return (
    <div className="w-1/2 flex flex-col">
      <form className="w-full" onSubmit={(e) => handleFormSubmit(e, text)}>
        <textarea
          className="hover:border-gray-400 border-gray-300 px-2 py-1 border w-full h-24 resize-none rounded-xl"
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder={placeholder}
          name="translate"
        />
        <div className="flex justify-between items-center">
          <AudioRecorder setAudioFile={setAudioFile} />
          <button
            className="bg-black text-white font-medium rounded p-1"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskBox;
