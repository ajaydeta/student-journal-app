"use client"

import { useState } from "react"
import Navigation from "./navigation"
import JournalList from "./journal-list"
import JournalCreator from "./journal-creator"
import DashboardHome from "./dashboard-home"

interface MainDashboardProps {
  user: any
}

export default function MainDashboard({ user }: MainDashboardProps) {
  const [currentView, setCurrentView] = useState<"menu" | "list" | "create">("menu")

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onNavigate={setCurrentView} userEmail={user.email} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === "menu" && <DashboardHome user={user} onNavigate={setCurrentView} />}

        {currentView === "list" && <JournalList userId={user.uid} onBack={() => setCurrentView("menu")} />}

        {currentView === "create" && <JournalCreator userId={user.uid} onBack={() => setCurrentView("menu")} />}
      </main>
    </div>
  )
}
