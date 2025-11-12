"use client"

import type { QuizQuestion as QuizQuestionType } from "@/lib/quiz-service"

interface QuizQuestionComponentProps {
  question: {
    question_text: string
    options: Array<{
      option_id: string
      text: string
    }>
    correct_option_id: string
    explanation: string
  }
  questionNumber: number
  selectedAnswer: string | null
  onAnswerSelect: (optionId: string) => void
  showFeedback: boolean
  isCorrect: boolean
}

export default function QuizQuestionComponent({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  showFeedback,
  isCorrect,
}: QuizQuestionComponentProps) {
  return (
    <div className="bg-card rounded-softer p-8 shadow-md">
      <h3 className="text-xl font-bold mb-6">{question.question_text}</h3>
      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.option_id}
            onClick={() => onAnswerSelect(option.option_id)}
            disabled={showFeedback}
            className={`w-full text-left p-4 rounded-soft transition-all ${
              selectedAnswer === option.option_id
                ? showFeedback
                  ? isCorrect
                    ? "bg-accent-green bg-opacity-20 border-2 border-accent-green"
                    : "bg-error bg-opacity-20 border-2 border-error"
                  : "bg-primary bg-opacity-10 border-2 border-primary"
                : "bg-background hover:bg-primary hover:bg-opacity-5 border-2 border-border"
            }`}
          >
            {option.option_id}. {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}
