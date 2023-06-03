import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';

interface ResponseBoxProps {
  transcription: string;
  translation: string;
  audioPlaying: boolean;
  setAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  translating: boolean;
  responseAudio: HTMLAudioElement | null;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({
  transcription,
  translation,
  audioPlaying,
  setAudioPlaying,
  translating,
  responseAudio,
}) => {
  const playAudio = async () => {
    if (!responseAudio) return;

    setAudioPlaying(true);

    responseAudio
      .play()
      .then(() => {
        responseAudio.onended = () => {
          setAudioPlaying(false);
        };
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        setAudioPlaying(false);
      });
  };
  return (
    <div className="flex justify-evenly items-center h-full w-full px-16">
      <div className="flex items-center pr-4 h-full w-full">
        <h4 className="font-medium text-xl ml-auto">{transcription}</h4>
      </div>
      {translating ? (
        <FontAwesomeIcon size="2xl" beat={translating} icon={faCaretRight} />
      ) : (
        <FontAwesomeIcon
          className={`cursor-pointer pl-2 ${translation ? '' : 'hidden'}`}
          beat={audioPlaying}
          size="lg"
          icon={faVolumeUp}
          onClick={() => playAudio()}
          style={{ color: audioPlaying ? 'red' : 'rgb(55 65 81)' }}
        />
      )}

      <div className="flex items-center pl-4 h-full w-full">
        <h4 className="font-medium text-gray-700 text-xl">{translation}</h4>
      </div>
    </div>
  );
};

export default ResponseBox;
