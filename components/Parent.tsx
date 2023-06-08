'use client';

import { useState } from 'react';

import Input from './Content/Input';
import Description from './Header/Description';

export type TranslationType = 'translate' | 'ask';

export type ParentProps = {
  translateType: TranslationType;
  setTranslateType: React.Dispatch<React.SetStateAction<TranslationType>>;
};

const Parent: React.FC = () => {
  const [translateType, setTranslateType] = useState<TranslationType>('ask');

  return (
    <>
      <div className="flex flex-col items-center justify-evenly">
        <h1 className="text-3xl text-center sm:text-4xl font-bold p-2">
          Roadman AI
        </h1>
        <Description translateType={translateType} />
      </div>
      <Input
        translateType={translateType}
        setTranslateType={setTranslateType}
      />
    </>
  );
};

export default Parent;
