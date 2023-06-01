'use client';

import React, { useState, useEffect } from 'react';

interface AudioRecorderProps {
  setAudioFile: React.Dispatch<React.SetStateAction<Blob | null>>;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ setAudioFile }) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handleRecordingClick = () => {
    if (mediaRecorder !== null) {
      recording ? mediaRecorder.stop() : mediaRecorder.start();
      setRecording(!recording);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);

        newMediaRecorder.ondataavailable = (e: BlobEvent) => {
          // Declare the audioChunks array inside the ondataavailable handler
          let audioChunks: Blob[] = [];
          audioChunks.push(e.data);

          newMediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            setAudioFile(audioBlob);
          };
        };
      })
      .catch((err: Error) =>
        console.error('Error accessing media devices.', err)
      );
  }, [setAudioFile]);

  return (
    <div>
      <button onClick={handleRecordingClick}>
        {recording ? 'Stop recording' : 'Start recording'}
      </button>
    </div>
  );
};

export default AudioRecorder;
