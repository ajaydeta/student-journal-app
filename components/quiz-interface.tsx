"use client"

import { useState } from "react"
import { getDb } from "@/lib/firebaseClient"
import type { Firestore } from "firebase/firestore"
import { doc, updateDoc } from "firebase/firestore"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import type { QuizQuestion } from "@/lib/quiz-service"
import QuizQuestionComponent from "./quiz-question"
import QuizResults from "./quiz-results"

interface QuizInterfaceProps {
  quizId: string
  questions: QuizQuestion[]
  onBack: () => void
  scoring?: {
    points_per_correct: number
    points_per_wrong: number
    max_score: number
  }
}

export default function QuizInterface({ quizId, questions, onBack, scoring }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null))
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)

  const currentQuestion = questions[currentQuestionIndex]
  const isAnswered = answers[currentQuestionIndex] !== null
  const isCorrect = currentQuestion && answers[currentQuestionIndex] === currentQuestion.correct_option_id

  const handleAnswerSelect = (optionId: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = optionId
    setAnswers(newAnswers)
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowFeedback(false)
    } else {
      completeQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowFeedback(false)
    }
  }

  const completeQuiz = async () => {
    let totalPoints = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct_option_id) {
        totalPoints ++
      }
    })

    const maxScore = questions.length
    const finalScore = Math.round((totalPoints / maxScore) * 100)
    setScore(finalScore)
    setQuizCompleted(true)

    // Save score to Firestore
    try {
      const db: Firestore = getDb()
      await updateDoc(doc(db, "quizzes", quizId), {
        completed: true,
        scoring: {
          ...scoring,
          total_score: finalScore,
          user_answers: answers.map((answer, index) => ({
            question_id: questions[index].question_id,
            selected_option_id: answer
          })),
          answer_results: questions.map((question, index) => ({
            question_id: question.question_id,
            selected_option_id: answers[index],
            is_correct: answers[index] === question.correct_option_id,
            earned_points: answers[index] === question.correct_option_id
              ? scoring?.points_per_correct || 1
              : scoring?.points_per_wrong || 0,
            explanation: question.explanation
          }))
        },
        completedAt: new Date(),
      })
    } catch (error) {
      console.error("Error saving quiz score:", error)
    }
  }

  if (showInstructions) {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-primary hover:text-primary-dark font-semibold">
          <ArrowLeft className="w-5 h-5" />
          Back to Entry
        </button>

        <div className="bg-gradient-to-br from-accent-yellow to-accent-pink rounded-softer p-12 shadow-lg text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Take the Quiz?</h2>
          <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
            You're about to answer 5 multiple-choice questions based on your journal entry. Each question has 4 options
            to choose from. Take your time and select the best answer for each question. You can navigate between
            questions using the Previous and Next buttons.
          </p>

          <div className="bg-white bg-opacity-50 rounded-soft p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-4 text-foreground">How it works:</h3>
            <ul className="space-y-2 text-foreground">
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Read each question carefully</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Select your answer from the 4 options</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>You'll get instant feedback on your answer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Navigate using Previous/Next buttons</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">5.</span>
                <span>Click Submit when you're done with all questions</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setShowInstructions(false)}
            className="px-8 py-4 bg-gradient-to-r from-accent-pink to-accent-coral text-white font-bold text-lg rounded-soft hover:shadow-lg transition-all"
          >
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        answers={answers.map(answer => answer)}
        questions={questions.map(q => ({
          ...q,
          explanation: q.explanation || "No explanation available."
        }))}
        onBack={onBack}
        scoring={scoring}
      />
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary hover:text-primary-dark font-semibold">
        <ArrowLeft className="w-5 h-5" />
        Back to Entry
      </button>

      {/* Progress Bar */}
      <div className="bg-card rounded-softer p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Quiz Time!</h2>
          <span className="text-lg font-semibold text-primary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="w-full bg-border rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent-green to-accent-yellow h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <QuizQuestionComponent
        question={{
          ...currentQuestion,
          explanation: currentQuestion.explanation || "No explanation available."
        }}
        questionNumber={currentQuestionIndex + 1}
        selectedAnswer={answers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
      />

      {/* Feedback Section */}
      {showFeedback && isAnswered && (
        <div
          className={`rounded-softer p-6 shadow-md border-2 ${
            isCorrect
              ? "bg-accent-green bg-opacity-10 border-accent-green border-opacity-30"
              : "bg-error bg-opacity-10 border-error border-opacity-30"
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-accent-green flex-shrink-0 mt-1" />
            ) : (
              <XCircle className="w-6 h-6 text-error flex-shrink-0 mt-1" />
            )}
            <div>
              <h3 className={`font-bold mb-2 ${isCorrect ? "text-accent-green" : "text-error"}`}>
                {isCorrect ? "Correct!" : "Not quite right"}
              </h3>
              <p className="text-foreground">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-border text-foreground font-semibold rounded-soft hover:bg-border hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index)
                setShowFeedback(false)
              }}
              className={`w-10 h-10 rounded-soft font-semibold transition-all ${
                index === currentQuestionIndex
                  ? "bg-primary text-white shadow-lg scale-110"
                  : answer !== null
                    ? "bg-accent-green text-white"
                    : "bg-border text-foreground"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="px-6 py-3 bg-gradient-to-r from-accent-pink to-accent-coral text-white font-semibold rounded-soft hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === questions.length - 1 ? "Submit Quiz" : "Next"}
        </button>
      </div>
    </div>
  )
}
