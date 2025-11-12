"use client"

import { useState } from "react"
import { BookOpen, Search, ArrowLeft } from "lucide-react"
import { useJournals } from "@/lib/firestore-hooks"
import JournalEntryView from "./journal-entry-view"

interface Journal {
  id: string
  title: string
  content: string
  date: string
  grade: number
  createdAt: any
}

interface JournalListProps {
  userId: string
  onBack: () => void
}

export default function JournalList({ userId, onBack }: JournalListProps) {
  const { journals, loading } = useJournals(userId)
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGrade, setFilterGrade] = useState<string>("all")

  const filteredJournals = journals.filter((journal) => {
    const matchesSearch =
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = filterGrade === "all" || journal.grade.toString() === filterGrade
    return matchesSearch && matchesGrade
  })

  if (selectedJournal) {
    return (
      <JournalEntryView
        journal={selectedJournal}
        onBack={() => setSelectedJournal(null)}
        onDelete={() => {
          setSelectedJournal(null)
        }}
      />
    )
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

      <h2 className="text-3xl font-bold text-foreground mb-6">My Journal Entries</h2>

      <div className="bg-card rounded-softer p-6 shadow-md mb-6 space-y-4">
        <div className="flex items-center gap-2 bg-background rounded-soft px-4 py-2 border-2 border-border">
          <Search className="w-5 h-5 text-foreground opacity-50" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-foreground"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-foreground font-semibold">Filter by Grade:</label>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-background text-foreground"
          >
            <option value="all">All Grades</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-accent-pink rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading your entries...</p>
        </div>
      ) : filteredJournals.length === 0 ? (
        <div className="bg-card rounded-softer p-12 text-center shadow-lg">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <p className="text-foreground text-lg">
            {journals.length === 0
              ? "No journal entries yet. Start your first journey!"
              : "No entries match your search."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJournals.map((journal) => (
            <button
              key={journal.id}
              onClick={() => setSelectedJournal(journal)}
              className="bg-card rounded-softer p-6 shadow-md hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-primary group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {journal.title}
                </h3>
                <span className="bg-accent-yellow bg-opacity-20 text-white px-3 py-1 rounded-soft text-sm font-semibold">
                  Grade {journal.grade}
                </span>
              </div>
              <p className="text-foreground text-sm mb-3 line-clamp-2">{journal.content}</p>
              <span className="text-sm text-foreground opacity-70">{new Date(journal.date).toLocaleDateString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
