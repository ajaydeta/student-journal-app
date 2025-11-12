"use client"

import { useJournalStats } from "@/lib/firestore-hooks"
import { BookOpen, TrendingUp, Calendar, Zap } from "lucide-react"

interface JournalStatsProps {
  userId: string
}

export default function JournalStats({ userId }: JournalStatsProps) {
  const { stats, loading } = useJournalStats(userId)

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-softer p-6 shadow-md animate-pulse">
            <div className="h-8 bg-border rounded-soft mb-2"></div>
            <div className="h-4 bg-border rounded-soft w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Total Entries */}
      <div className="bg-gradient-to-br from-accent-green to-accent-yellow rounded-softer p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-semibold">Total Entries</h3>
          <BookOpen className="w-5 h-5 text-white opacity-70" />
        </div>
        <p className="text-3xl font-bold text-white">{stats.totalEntries}</p>
        <p className="text-sm text-white opacity-80 mt-1">journal entries</p>
      </div>

      {/* Average Grade */}
      <div className="bg-gradient-to-br from-accent-pink to-accent-coral rounded-softer p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-semibold">Average Grade</h3>
          <TrendingUp className="w-5 h-5 text-white opacity-70" />
        </div>
        <p className="text-3xl font-bold text-white">{stats.averageGrade}</p>
        <p className="text-sm text-white opacity-80 mt-1">out of 6</p>
      </div>

      {/* Total Words */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-softer p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-semibold">Total Words</h3>
          <Zap className="w-5 h-5 text-white opacity-70" />
        </div>
        <p className="text-3xl font-bold text-white">{stats.totalWords.toLocaleString()}</p>
        <p className="text-sm text-white opacity-80 mt-1">words written</p>
      </div>

      {/* Last Entry */}
      <div className="bg-gradient-to-br from-accent-yellow to-accent-green rounded-softer p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-semibold">Last Entry</h3>
          <Calendar className="w-5 h-5 text-white opacity-70" />
        </div>
        <p className="text-lg font-bold text-white">{stats.lastEntryDate || "No entries"}</p>
        <p className="text-sm text-white opacity-80 mt-1">most recent</p>
      </div>
    </div>
  )
}
