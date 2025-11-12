"use client"

import { useState, useEffect } from "react"
import { getDb } from "@/lib/firebaseClient"
import type { Firestore } from "firebase/firestore"
import { deleteDoc, doc } from "firebase/firestore"
import { ArrowLeft, Trash2, Edit2 } from "lucide-react"
import JournalEditor from "./journal-editor"
import QuizGenerator from "./quiz-generator"
import QuizInterface from "./quiz-interface"
import { getQuizForJournal } from "@/lib/quiz-service"

interface Journal {
  id: string
  title: string
  content: string
  date: string
  grade: number
}

interface JournalEntryViewProps {
  journal: Journal
  onBack: () => void
  onDelete: () => void
}

export default function JournalEntryView({ journal, onBack, onDelete }: JournalEntryViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentJournal] = useState(journal)
  const [quiz, setQuiz] = useState<any>(null)
  const [loadingQuiz, setLoadingQuiz] = useState(true)
  const [takingQuiz, setTakingQuiz] = useState(false)

  useEffect(() => {
    const checkQuiz = async () => {
      setLoadingQuiz(true)
      const existingQuiz = await getQuizForJournal(journal.id)
      if (existingQuiz) {
        setQuiz(existingQuiz)
      }
      setLoadingQuiz(false)
    }
    checkQuiz()
  }, [journal.id])

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this entry? This cannot be undone.")) {
      try {
        const db: Firestore = getDb()
        await deleteDoc(doc(db, "journals", journal.id))
        onDelete()
      } catch (error) {
        console.error("Error deleting journal:", error)
      }
    }
  }

  if (isEditing) {
    return (
      <JournalEditor
        journal={currentJournal}
        onBack={() => setIsEditing(false)}
        onSave={() => {
          setIsEditing(false)
          onBack()
        }}
      />
    )
  }

  if (takingQuiz && quiz) {
    return <QuizInterface quizId={quiz.id} questions={quiz.questions} onBack={() => setTakingQuiz(false)} />
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to List
      </button>

      <div className="bg-card rounded-softer p-8 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground mb-2">{currentJournal.title}</h2>
            <div className="flex items-center gap-4 text-foreground">
              <span className="bg-accent-yellow bg-opacity-20 text-white px-3 py-1 rounded-soft font-semibold">
                Grade {currentJournal.grade}
              </span>
              <span className="text-foreground opacity-70">{new Date(currentJournal.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-accent-green text-white font-semibold px-4 py-2 rounded-soft hover:bg-opacity-90 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-error text-white font-semibold px-4 py-2 rounded-soft hover:bg-opacity-90 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>

        <div className="border-t-2 border-border pt-6">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed text-lg">{currentJournal.content}</p>
        </div>
      </div>

      {/* Quiz Section */}
      {!loadingQuiz && (
        <>
          {quiz ? (
            <button
              onClick={() => setTakingQuiz(true)}
              className="w-full bg-gradient-to-r from-accent-yellow to-accent-green text-white font-bold py-4 rounded-softer hover:shadow-lg transition-all text-lg"
            >
              Take Quiz
            </button>
          ) : (
            <QuizGenerator
              journalId={journal.id}
              journalTitle={journal.title}
              journalContent={journal.content}
              gradeLevel={journal.grade}
              userId={journal.id}
              onQuizGenerated={(id,questions) => {
                setQuiz({ id, questions })
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
