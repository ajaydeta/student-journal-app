"use client"

import { useState } from "react"
import { getDb } from "@/lib/firebaseClient"
import { doc, updateDoc } from "firebase/firestore"
import { ArrowLeft, Save } from "lucide-react"

interface Journal {
  id: string
  title: string
  content: string
  date: string
  grade: number
}

interface JournalEditorProps {
  journal: Journal
  onBack: () => void
  onSave: () => void
}

export default function JournalEditor({ journal, onBack, onSave }: JournalEditorProps) {
  const [title, setTitle] = useState(journal.title)
  const [content, setContent] = useState(journal.content)
  const [grade, setGrade] = useState(journal.grade.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setError("")
    setLoading(true)

    try {
      const db = getDb()
      await updateDoc(doc(db, "journals", journal.id), {
        title,
        content,
        grade: Number.parseInt(grade),
        updatedAt: new Date(),
      })
      onSave()
    } catch (err: any) {
      setError(err.message || "Failed to save changes")
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
        Back to Entry
      </button>

      <div className="bg-card rounded-softer p-8 shadow-lg max-w-2xl">
        <h2 className="text-3xl font-bold text-foreground mb-6">Edit Entry</h2>

        {error && <div className="bg-error text-white p-3 rounded-soft mb-4">{error}</div>}

        <div className="space-y-6">
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
              className="w-full px-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-foreground font-semibold mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-background text-foreground h-48 resize-none"
              required
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-green to-accent-yellow text-white font-semibold py-3 rounded-soft hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
