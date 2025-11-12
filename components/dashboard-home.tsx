"use client"

import { BookOpen, PlusCircle, Sparkles } from "lucide-react"
import JournalStats from "./journal-stats"

interface DashboardHomeProps {
  user: any
  onNavigate: (view: "menu" | "list" | "create") => void
}

export default function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const userName = user.email?.split("@")[0] || "Friend"

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-foreground mb-2">Welcome back, {userName}!</h2>
        <p className="text-lg text-foreground opacity-80">What would you like to do today?</p>
      </div>

      {/* Statistics Section */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Your Progress</h3>
        <JournalStats userId={user.uid} />
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-softer p-6 shadow-md border-2 border-accent-yellow border-opacity-30">
          <div className="text-3xl font-bold text-accent-yellow mb-2">📚</div>
          <p className="text-foreground font-semibold">Your Journal</p>
          <p className="text-sm text-foreground opacity-70">View all your entries</p>
        </div>

        <div className="bg-card rounded-softer p-6 shadow-md border-2 border-accent-green border-opacity-30">
          <div className="text-3xl font-bold text-accent-green mb-2">✨</div>
          <p className="text-foreground font-semibold">New Entry</p>
          <p className="text-sm text-foreground opacity-70">Write and reflect</p>
        </div>

        <div className="bg-card rounded-softer p-6 shadow-md border-2 border-accent-pink border-opacity-30">
          <div className="text-3xl font-bold text-accent-pink mb-2">🎯</div>
          <p className="text-foreground font-semibold">Quiz Time</p>
          <p className="text-sm text-foreground opacity-70">Test your learning</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* My Journal Button */}
        <button
          onClick={() => onNavigate("list")}
          className="bg-gradient-to-br from-accent-green to-accent-yellow rounded-softer p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-soft p-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-12 h-12 text-accent-green" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">My Journal</h3>
          <p className="text-white opacity-90">Read and edit your past entries</p>
        </button>

        {/* New Journey Button */}
        <button
          onClick={() => onNavigate("create")}
          className="bg-gradient-to-br from-accent-pink to-accent-coral rounded-softer p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-soft p-4 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-12 h-12 text-accent-pink" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">New Journey</h3>
          <p className="text-white opacity-90">Write a new journal entry</p>
        </button>
      </div>

      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-primary via-accent-green to-accent-yellow rounded-softer p-8 shadow-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Keep Learning!</h3>
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <p className="text-white opacity-90">
          Every entry you write helps you reflect on your learning journey. Keep going!
        </p>
      </div>
    </div>
  )
}
