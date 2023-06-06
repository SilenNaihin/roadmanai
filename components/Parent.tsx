'use client';

import { useState } from 'react';

import Input from './Input';
import Description from './Description';

export type TranslationType = 'translate' | 'ask';

export type ParentProps = {
  translateType: TranslationType;
  setTranslateType: React.Dispatch<React.SetStateAction<TranslationType>>;
};

const Parent: React.FC = () => {
  const [translateType, setTranslateType] = useState<TranslationType>('ask');

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold p-2">Roadman Translator</h1>
        <Description
          translateType={translateType}
          setTranslateType={setTranslateType}
        />
      </div>
      <Input
        translateType={translateType}
        setTranslateType={setTranslateType}
      />
    </>
  );
};

export default Parent;
