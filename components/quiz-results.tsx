"use client"

import {CheckCircle, XCircle, RotateCcw} from "lucide-react"
import type {QuizQuestion} from "@/lib/quiz-service"

interface QuizResultsProps {
    score: number
    totalQuestions: number
    answers: (string | null)[]
    questions: QuizQuestion[]
    onBack: () => void
    scoring?: {
        points_per_correct: number
        points_per_wrong: number
        max_score: number
    }
}

export default function QuizResults({score, totalQuestions, answers, questions, onBack, scoring}: QuizResultsProps) {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct_option_id).length
    let totalPoints = 0
    answers.forEach((answer, index) => {
        if (answer === questions[index].correct_option_id) {
            totalPoints++
        }
    })

    const getScoreMessage = () => {
        if (score === 100) return "Perfect Score! You're a superstar!"
        if (score >= 80) return "Excellent work! You really understand this!"
        if (score >= 60) return "Good job! Keep practicing!"
        return "Nice try! Review and try again!"
    }

    const getScoreColor = () => {
        if (score >= 80) return "from-accent-green to-accent-yellow"
        if (score >= 60) return "from-accent-yellow to-accent-pink"
        return "from-accent-pink to-accent-coral"
    }

    return (
        <div className="space-y-6">
            {/* Score Card */}
            <div className={`bg-gradient-to-br ${getScoreColor()} rounded-softer p-12 shadow-lg text-center`}>
                <h2 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h2>
                <div className="text-6xl font-bold text-white mb-4">{score}%</div>
                <p className="text-xl text-white opacity-90 mb-2">
                    You got {correctAnswers} out of {totalQuestions} questions correct
                </p>
                <p className="text-lg text-white opacity-90 mb-6">
                    Points: {totalPoints} / {scoring?.max_score || totalQuestions}
                </p>
                <p className="text-2xl font-bold text-white">{getScoreMessage()}</p>
            </div>

            {/* Results Summary */}
            <div className="grid md:grid-cols-2 gap-4">
                <div
                    className="bg-accent-green bg-opacity-10 rounded-softer p-6 border-2 border-accent-green border-opacity-30">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-accent-green"/>
                        <h3 className="font-bold text-foreground">Correct Answers</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{correctAnswers}</p>
                </div>

                <div className="bg-error bg-opacity-10 rounded-softer p-6 border-2 border-error border-opacity-30">
                    <div className="flex items-center gap-3 mb-2">
                        <XCircle className="w-6 h-6 text-error"/>
                        <h3 className="font-bold text-foreground">Incorrect Answers</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalQuestions - correctAnswers}</p>
                </div>
            </div>

            {/* Review Section */}
            <div className="bg-card rounded-softer p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-foreground mb-6">Review Your Answers</h3>

                <div className="space-y-6">
                    {questions.map((question, index) => {
                        const userAnswer = answers[index]
                        const isCorrect = userAnswer === question.correct_option_id

                        return (
                            <div key={index} className="border-2 border-border rounded-softer p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    {isCorrect ? (
                                        <CheckCircle className="w-6 h-6 text-accent-green flex-shrink-0 mt-1"/>
                                    ) : (
                                        <XCircle className="w-6 h-6 text-error flex-shrink-0 mt-1"/>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-foreground mb-2">Question {index + 1}</h4>
                                        <p className="text-foreground mb-4">{question.question_text}</p>

                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm font-semibold text-foreground">Your answer:</p>
                                            <p
                                                className={`text-foreground ${isCorrect ? "text-accent-green font-semibold" : "text-error font-semibold"}`}
                                            >
                                                {userAnswer}: {question.options.find(opt => opt.option_id === userAnswer)?.text}
                                            </p>
                                        </div>

                                        {!isCorrect && (
                                            <div className="space-y-2 mb-4">
                                                <p className="text-sm font-semibold text-foreground">Correct answer:</p>
                                                <p className="text-accent-green font-semibold">
                                                    {question.correct_option_id}: {question.options.find(opt => opt.option_id === question.correct_option_id)?.text}
                                                </p>
                                            </div>
                                        )}

                                        <div className="bg-background rounded-soft p-4">
                                            <p className="text-sm text-foreground">
                                                <span
                                                    className="font-semibold">Explanation:</span> {question.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-soft hover:bg-primary-dark transition-colors"
                >
                    Back to Entry
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-6 py-3 bg-accent-yellow text-foreground font-semibold rounded-soft hover:bg-opacity-90 transition-colors"
                >
                    <RotateCcw className="w-5 h-5"/>
                    Retake Quiz
                </button>
            </div>
        </div>
    )
}
