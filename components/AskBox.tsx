import React, { useState, useEffect } from 'react';
import AudioRecorder from './AudioRecorder';

interface AskBoxProps {
  setAudioFile: React.Dispatch<React.SetStateAction<Blob | null>>;
  handleFormSubmit: (e: React.FormEvent, text: string) => void;
  placeholder: string;
}

const AskBox: React.FC<AskBoxProps> = ({
  setAudioFile,
  handleFormSubmit,
  placeholder,
}) => {
  const [text, setText] = useState<string>('');

  return (
    <div className="w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 flex flex-col">
      <textarea
        className="hover:border-gray-400 border-gray-300 px-2 py-1 border w-full h-24 resize-none rounded-xl"
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder={placeholder}
        name="translate"
      />
      <div className="mt-2 w-full flex justify-between items-center">
        <AudioRecorder setAudioFile={setAudioFile} />
        <button
          onClick={(e) => handleFormSubmit(e, text)}
          className="drop-shadow hover:transition-all hover:drop-shadow-xl text-white font-medium rounded py-1 px-2 bg-black"
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AskBox;
