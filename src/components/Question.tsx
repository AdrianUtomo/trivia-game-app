"use client"

import { Button } from "./ui/Button"
import { CheckCircle, XCircle } from "lucide-react"

interface QuestionProps {
  question: string
  answers: string[]
  selectedAnswer: string | null
  correctAnswer: string | null
  onSelectAnswer: (answer: string) => void
}

export function Question({ question, answers, selectedAnswer, correctAnswer, onSelectAnswer }: QuestionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium leading-relaxed">{question}</h3>
      <div className="grid gap-3">
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer
          const isCorrect = correctAnswer === answer
          const isIncorrect = isSelected && correctAnswer && answer !== correctAnswer

          let buttonVariant: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link" = "outline"
          if (isSelected && !correctAnswer) buttonVariant = "secondary"
          if (isCorrect) buttonVariant = "default"
          if (isIncorrect) buttonVariant = "destructive"

          return (
            <Button
              key={index}
              variant={buttonVariant}
              className={`justify-start h-auto py-3 px-4 text-left ${
                isCorrect ? "bg-green-600 hover:bg-green-600 text-white border-green-600" : ""
              } ${isIncorrect ? "bg-red-600 hover:bg-red-600 text-white border-red-600" : ""}`}
              onClick={() => onSelectAnswer(answer)}
              disabled={selectedAnswer !== null}
            >
              <div className="flex items-center w-full">
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                <span className="flex-grow">{answer}</span>
                {isCorrect && <CheckCircle className="h-5 w-5 ml-2 text-white" />}
                {isIncorrect && <XCircle className="h-5 w-5 ml-2 text-white" />}
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
