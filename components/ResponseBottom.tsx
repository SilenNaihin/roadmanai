import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong, faDownload } from '@fortawesome/free-solid-svg-icons';

interface ResponseBottomProps {
  response: boolean;
  setResponse: React.Dispatch<React.SetStateAction<boolean>>;
  audioPlaying: boolean;
  translating: boolean;
  audioEl: HTMLAudioElement | null;
  transcription: string;
}

const ResponseBottom: React.FC<ResponseBottomProps> = ({
  response,
  setResponse,
  audioPlaying,
  translating,
  audioEl,
  transcription,
}) => {
  const saveAudioElement = (audioElement: HTMLAudioElement | null) => {
    if (!audioElement) return;
    const link = document.createElement('a');

    link.href = audioElement.src;

    link.download = `roadman-${transcription}.mp3`;

    link.click();
  };

  const handleAgainClick = () => {
    if (audioPlaying || translating) {
      console.log('audio playing or translating');
      return;
    }

    setResponse(!response);
  };
  return (
    <>
      <button
        className="mt-12 flex items-center justify-center"
        onClick={() => handleAgainClick()}
      >
        <h5 className="font-medium">
          {response ? 'New roadman response' : `Last roadman response`}
        </h5>
        <FontAwesomeIcon
          width={20}
          height={20}
          className="ml-4"
          size="lg"
          icon={faRightLong}
        />
      </button>
      {response && (
        <button
          className="mt-6 flex items-center justify-center"
          onClick={() => saveAudioElement(audioEl)}
        >
          <h5 className="font-medium">Download response</h5>
          <FontAwesomeIcon
            width={20}
            height={20}
            className="ml-4"
            size="lg"
            icon={faDownload}
          />
        </button>
      )}
    </>
  );
};

export default ResponseBottom;
