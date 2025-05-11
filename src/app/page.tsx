// import Image from "next/image";

import GameSetup from "@/components/GameSetup";

export default function Home() {

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-700 dark:text-purple-400">Trivia Challenge</h1>
        <GameSetup />
      </div>
    </main>
  );
}
