import Test from './components/transcription';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello world!</h1>
      <Test />
    </main>
  );
}
