'use client';

import React, { useState, useRef, useEffect } from 'react';
import DescriptionContent from './DescriptionContent';

import { TranslationType } from './Parent';

interface DescriptionProps {
  translateType: TranslationType;
}

const Description: React.FC<DescriptionProps> = ({ translateType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  // add this useEffect hook
  useEffect(() => {
    if (divRef.current) {
      if (isOpen) {
        divRef.current.style.maxHeight = '1000px'; // You may adjust this value as needed.
        const timeoutId = window.setTimeout(() => {
          divRef.current!.style.maxHeight = 'auto';
        }, 500); // Transition duration.
        return () => clearTimeout(timeoutId);
      } else {
        // Before setting maxHeight to '0', we need to have a fixed maxHeight for the transition.
        // We can't transition from 'auto' to '0'.
        divRef.current.style.maxHeight = `${divRef.current.scrollHeight}px`;
        const timeoutId = window.setTimeout(() => {
          divRef.current!.style.maxHeight = '0';
        }, 0); // No delay.
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isOpen]);

  return (
    <div className="z-10 flex flex-col items-center p-4 mt-2 w-full">
      <div className="md:hidden flex flex-col items-center justify-center relative">
        <button
          className="font-medium text-white py-2 px-8 rounded"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'linear-gradient(to bottom right, #0088cc, #663399)',
          }}
        >
          Example {translateType == 'translate' ? 'translation' : 'ask'}
        </button>
        <div
          ref={divRef}
          style={{
            maxHeight: isOpen ? 'auto' : '0',
            width: '80vw', // 80vw represents 80% of the width of the viewport
          }}
          className="transition-all absolute top-full duration-1000 ease-in-out overflow-hidden"
        >
          <div className="p-4 bg-purple-100 mt-2 rounded-xl flex flex-col items-center">
            <DescriptionContent translateType={translateType} />
          </div>
        </div>
      </div>

      <div className="flex-col items-center hidden md:flex">
        <DescriptionContent translateType={translateType} />
      </div>
    </div>
  );
};

export default Description;
