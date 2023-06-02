'use client';

import Input from '@/components/Input';
import Description from '@/components/Description';

export default function Home() {
  return (
    <main className="flex h-screen min-h-screen flex-col items-center py-24 px-8 justify-between">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold p-2">Roadman Translator</h1>
        <h1 className="text-center text-md font-medium text-gray-600">
          Your own personal roadman to respond to your requests and needs
        </h1>
        <Description />
      </div>
      <Input />
    </main>
  );
}
