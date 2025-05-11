import { useState, useEffect } from "react";
import { useGetQuestions, Question as TriviaQuestion } from "@/lib/hooks/useGetQuestions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Progress } from "./ui/Progress";
import { Button } from "./ui/Button";
import { Loader2, AlertTriangle } from "lucide-react";
import { Question } from "./Question";
import { Results } from "./Results";
import { useQueryClient } from "@tanstack/react-query";

type GameProps = {
  questionParams: {
    amount?: number;
    category?: number;
    difficulty?: "easy" | "medium" | "hard";
    type?: "boolean" | "multiple";
  };
  onBackToSetup: () => void;
};

export default function Game({ questionParams, onBackToSetup }: GameProps) {
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const {
    data: questions,
    isLoading,
    isError,
  } = useGetQuestions(questionParams);

  useEffect(() => {
    if (questions && questions.length > 0) {
      prepareAnswers(questions[0]);
    }
  }, [questions]);

  const prepareAnswers = (question: TriviaQuestion) => {
    if (!question) return;

    // Combine correct and incorrect answers
    const allAnswers = [question.correct_answer, ...question.incorrect_answers];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5)

    setAnswers(shuffledAnswers);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerRevealed || !questions) return;

    setSelectedAnswer(answer);
    setIsAnswerRevealed(true);

    // Check if answer is correct and update score
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (questions && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        prepareAnswers(questions[currentQuestionIndex + 1]);
      } else {
        setGameCompleted(true);
      }
    }, 1500);
  };

  const handlePlayAgain = async () => {
    // Invalidate the query to fetch fresh data
    await queryClient.invalidateQueries({
      queryKey: ["get-questions", questionParams],
    });

    // Reset game state
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameCompleted(false);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
  };

  // Make sure questions exist before accessing them
  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <Card className="shadow-lg border-purple-200 dark:border-purple-900">
      {(() => {
        if (isLoading) {
          return (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400 mb-4" />
              <p className="text-lg font-medium">Loading questions...</p>
            </CardContent>
          );
        }
        if (isError) {
          return (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
              <p className="text-lg font-medium text-center mb-4">
                Error loading questions
              </p>
              <Button onClick={onBackToSetup} variant="outline">
                Back to Setup
              </Button>
            </CardContent>
          );
        }
        if (gameCompleted && questions) {
          return (
            <Results
              score={score}
              totalQuestions={questions.length}
              onPlayAgain={handlePlayAgain}
              onBackToSetup={onBackToSetup}
            />
          );
        }
        return (
          <>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {questions ? questions.length : 0}
                </div>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Score: {score}
                </div>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-gray-200 dark:bg-gray-700"
              />
              <CardTitle className="mt-4 text-xl">
                {currentQuestion?.category}
                <span className="ml-2 text-sm px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {currentQuestion?.difficulty ? currentQuestion.difficulty.charAt(0).toUpperCase() +
                    currentQuestion.difficulty.slice(1) : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentQuestion && (
                <Question
                  question={currentQuestion.question}
                  answers={answers}
                  selectedAnswer={selectedAnswer}
                  correctAnswer={
                    isAnswerRevealed ? currentQuestion.correct_answer : null
                  }
                  onSelectAnswer={handleAnswerSelect}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onBackToSetup} size="sm">
                Exit Quiz
              </Button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {isAnswerRevealed
                  ? "Moving to next question..."
                  : "Select an answer"}
              </div>
            </CardFooter>
          </>
        );
      })()}
    </Card>
  );
}
