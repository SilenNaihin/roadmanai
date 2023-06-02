import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';

interface ResponseBoxProps {
  transcription: string;
  translation: string;
  audioPlaying: boolean;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({
  transcription,
  translation,
  audioPlaying,
}) => {
  return (
    <div className="flex justify-evenly items-center h-full w-full px-16">
      <div className="flex items-center pr-4 h-full w-full">
        <h4 className="font-medium text-xl ml-auto">{transcription}</h4>
      </div>
      <FontAwesomeIcon size="2xl" beat={audioPlaying} icon={faCaretRight} />
      <div className="flex items-center pl-4 h-full w-full">
        <h4 className="font-medium text-gray-700 text-xl">{translation}</h4>
        <FontAwesomeIcon
          className="cursor-pointer pl-2"
          beat={audioPlaying}
          size="lg"
          icon={faVolumeUp}
          //   onClick={() => handleStreamAudio()}
          style={{ color: audioPlaying ? 'red' : 'rgb(55 65 81)' }}
        />
      </div>
    </div>
  );
};

export default ResponseBox;
