'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const Description: React.FC = () => {
  const [speaking, setSpeaking] = useState<boolean>(false);

  const handleStreamAudio = () => {
    if (speaking) return;

    setSpeaking(true);

    const audio = new Audio('/sample.mp3');

    audio.onended = () => {
      setSpeaking(false);
    };

    audio.onerror = () => {
      console.error('Failed to play audio');
      setSpeaking(false);
    };

    audio.play();
  };

  return (
    <>
      <FontAwesomeIcon className="mt-1" icon={faArrowDown} />
      <div className="flex items-center">
        <h1 className="text-center text-md font-medium text-gray-600 mr-2">
          Yo, fam! Introducin&#39; your very own personal roadman, ready to sort
          out all your requests and ting, innit?
        </h1>
        <FontAwesomeIcon
          className="cursor-pointer"
          beat={speaking}
          onClick={() => handleStreamAudio()}
          icon={faVolumeUp}
          style={{ color: speaking ? 'red' : 'black' }}
        />
      </div>
    </>
  );
};

export default Description;
