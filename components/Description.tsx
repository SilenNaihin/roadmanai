'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

import { ParentProps } from './Parent';

const Description: React.FC<ParentProps> = ({
  translateType,
  setTranslateType,
}) => {
  const [speaking, setSpeaking] = useState<boolean>(false);

  const handleStreamAudio = () => {
    if (speaking) return;

    setSpeaking(true);

    const audio =
      translateType === 'translate'
        ? new Audio('/translate.mp3')
        : new Audio('/ask.mp3');

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
    <div className="rounded-xl flex flex-col items-center p-4 mt-2">
      <h1 className="text-center text-md font-medium text-gray-600">
        {translateType == 'ask'
          ? 'When was the last time you brushed your teeth'
          : 'Your own personal roadman to respond to your requests and needs'}
      </h1>
      <FontAwesomeIcon
        width={20}
        height={20}
        size="lg"
        className="mt-2 mb-1"
        icon={faArrowDown}
      />
      <div className="flex items-center">
        <h1 className="text-center text-md font-medium text-gray-600 mr-2">
          {translateType == 'ask'
            ? "Allow me to drop some knowledge on you, fam. I brush my pearly whites so fresh and clean, it's like I'm shining brighter than the sun, innit. Ain't no plaque gonna mess with this roadman's smile, blud!"
            : "Yo, fam! Mans introducin' your personal roadman, ready to sort out all your request's and ting, innit"}
        </h1>
        <FontAwesomeIcon
          className="cursor-pointer"
          size="xl"
          width={22}
          height={22}
          beat={speaking}
          onClick={() => handleStreamAudio()}
          icon={faVolumeUp}
          style={{ color: speaking ? 'red' : 'black' }}
        />
      </div>
    </div>
  );
};

export default Description;
