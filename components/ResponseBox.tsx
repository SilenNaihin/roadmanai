import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeUp,
  faCaretRight,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import useWindowSize from '@/hooks/useWindowSize';

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
  const { width } = useWindowSize();

  const audioIconFontSize = width && width > 768 ? '4vw' : '6vw';
  const chevronIconFontSize = width && width > 768 ? '6vw' : '9vw';

  return (
    <div className="flex justify-evenly items-center h-full w-full lg:px-16 md:px-8 px-6">
      <div className="flex items-center h-full w-full">
        <h4 className="font-medium text-md sm:text-lg md:text-xl ml-auto">
          {transcription}
        </h4>
      </div>
      {translating ? (
        <FontAwesomeIcon
          size="5x"
          className="px-6"
          beat={translating}
          icon={faCaretRight}
          style={{
            fontSize: chevronIconFontSize,
          }}
        />
      ) : loading ? (
        <FontAwesomeIcon className="px-6" size="2xl" spin icon={faGear} />
      ) : (
        translation && (
          <FontAwesomeIcon
            className="cursor-pointer px-4 md:px-6"
            beat={audioPlaying}
            // size="2xl"
            icon={faVolumeUp}
            onClick={() => playAudio(responseAudio)}
            style={{
              color: audioPlaying || audioPaused ? 'red' : 'black',
              fontSize: audioIconFontSize,
            }}
          />
        )
      )}

      <div className="flex items-center h-full w-full">
        <h4 className="font-medium text-md sm:text-lg md:text-xl">
          {translation}
        </h4>
      </div>
    </div>
  );
};

export default ResponseBox;
