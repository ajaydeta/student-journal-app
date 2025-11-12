"use client"

import type React from "react"

import { useState } from "react"
import { getDb } from "@/lib/firebaseClient"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ArrowLeft, Send } from "lucide-react"

interface JournalCreatorProps {
  userId: string
  onBack: () => void
}

export default function JournalCreator({ userId, onBack }: JournalCreatorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [grade, setGrade] = useState("4")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const db = getDb()
      await addDoc(collection(db, "journals"), {
        userId,
        title,
        content,
        grade: Number.parseInt(grade),
        date,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Reset form
      setTitle("")
      setContent("")
      setGrade("4")
      setDate(new Date().toISOString().split("T")[0])

      // Show success message
      alert("Journal entry saved! Your quiz is being generated...")
      onBack()
    } catch (err: any) {
      setError(err.message || "Failed to save journal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Menu
      </button>

      <div className="bg-card rounded-softer p-8 shadow-lg max-w-2xl">
        <h2 className="text-3xl font-bold text-foreground mb-6">Start Your New Journey</h2>

        {error && <div className="bg-error text-white p-3 rounded-soft mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-foreground font-semibold mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-foreground font-semibold mb-2">Grade Level</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-background text-foreground"
            >
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-foreground font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your entry about?"
              className="w-full px-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-foreground font-semibold mb-2">What did you learn today?</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about what you learned at school today. What was interesting? What did you discover?"
              className="w-full px-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-background text-foreground h-48 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-pink to-accent-coral text-white font-semibold py-3 rounded-soft hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {loading ? "Saving..." : "Save & Generate Quiz"}
          </button>
        </form>
      </div>
    </div>
  )
}
