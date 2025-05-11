"use client";

import { Button } from "./ui/Button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Trophy, RotateCcw, Home } from "lucide-react";

interface ResultsProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
}

export function Results({
  score,
  totalQuestions,
  onPlayAgain,
  onBackToSetup,
}: ResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  let message = "";
  let color = "";

  if (percentage >= 80) {
    message = "Excellent! You're a trivia master!";
    color = "text-green-600 dark:text-green-400";
  } else if (percentage >= 60) {
    message = "Good job! You know your stuff!";
    color = "text-blue-600 dark:text-blue-400";
  } else if (percentage >= 40) {
    message = "Not bad! Keep learning!";
    color = "text-yellow-600 dark:text-yellow-400";
  } else {
    message = "Keep practicing! You'll get better!";
    color = "text-red-600 dark:text-red-400";
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        <div className="relative w-40 h-40 mb-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Trophy className="h-20 w-20 text-purple-600 dark:text-purple-400" />
            <span className="text-5xl font-bold">{percentage}%</span>
          </div>
        </div>

        <p className="text-2xl font-bold mb-2">
          Your Score: {score}/{totalQuestions}
        </p>
        <p className={`text-lg ${color} mb-6`}>{message}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onPlayAgain}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Play Again
        </Button>
        <Button variant="outline" onClick={onBackToSetup}>
          <Home className="mr-2 h-4 w-4" />
          Back to Setup
        </Button>
      </CardFooter>
    </>
  );
}
