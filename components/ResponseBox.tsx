import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeUp,
  faCaretRight,
  faGear,
} from '@fortawesome/free-solid-svg-icons';

interface ResponseBoxProps {
  transcription: string;
  translation: string;
  audioPlaying: boolean;
  translating: boolean;
  responseAudio: HTMLAudioElement | null;
  playAudio: (audio: HTMLAudioElement | null) => void;
  audioPaused: boolean;
  loading: boolean;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({
  transcription,
  translation,
  audioPlaying,
  translating,
  responseAudio,
  playAudio,
  audioPaused,
  loading,
}) => {
  return (
    <div className="flex justify-evenly items-center h-full w-full px-16">
      <div className="flex items-center h-full w-full">
        <h4 className="font-medium text-xl ml-auto">{transcription}</h4>
      </div>
      {translating ? (
        <FontAwesomeIcon
          size="5x"
          className="px-6"
          beat={translating}
          icon={faCaretRight}
        />
      ) : loading ? (
        <FontAwesomeIcon className="px-6" size="2xl" spin icon={faGear} />
      ) : (
        translation && (
          <FontAwesomeIcon
            className="cursor-pointer px-6"
            beat={audioPlaying}
            size="2xl"
            icon={faVolumeUp}
            onClick={() => playAudio(responseAudio)}
            style={{
              color: audioPlaying || audioPaused ? 'red' : 'black',
            }}
          />
        )
      )}

      <div className="flex items-center h-full w-full">
        <h4 className="font-medium text-xl">{translation}</h4>
      </div>
    </div>
  );
};

export default ResponseBox;
