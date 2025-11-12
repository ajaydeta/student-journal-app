"use client"

import { useState } from "react"
import { Sparkles, Loader } from "lucide-react"
import { generateQuizForJournal } from "@/lib/quiz-service"

interface QuizGeneratorProps {
  journalId: string
  journalTitle: string
  journalContent: string
  gradeLevel: number
  userId: string
  onQuizGenerated: (quizId: string, questions: any) => void
}

export default function QuizGenerator({
  journalId,
  journalTitle,
  journalContent,
  gradeLevel,
  userId,
  onQuizGenerated,
}: QuizGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerateQuiz = async () => {
    setLoading(true)
    setError("")

    try {
      const quiz = await generateQuizForJournal(journalId, userId, journalTitle, journalContent, gradeLevel)
      onQuizGenerated(quiz.id, quiz.questions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-accent-yellow to-accent-green rounded-softer p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Generate Quiz</h3>
          <p className="text-white opacity-90">Test your understanding of this entry with an AI-generated quiz</p>
        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={loading}
          className="flex items-center gap-2 bg-white text-accent-green font-semibold px-6 py-3 rounded-soft hover:bg-opacity-90 transition-all disabled:opacity-50 whitespace-nowrap ml-4"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Quiz
            </>
          )}
        </button>
      </div>

      {error && <div className="mt-4 bg-error text-white p-3 rounded-soft text-sm">{error}</div>}
    </div>
  )
}
