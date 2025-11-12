"use client"

import { useRouter } from "next/navigation"
import { getAuthInstance } from "@/lib/firebaseClient"
import { signOut } from "firebase/auth"
import { BookOpen, LogOut, Home } from "lucide-react"

interface NavigationProps {
  currentView: "menu" | "list" | "create"
  onNavigate: (view: "menu" | "list" | "create") => void
  userEmail?: string
}

export default function Navigation({ currentView, onNavigate, userEmail }: NavigationProps) {
  const router = useRouter()

  const handleLogout = async () => {
    // Get typed auth instance (will throw if not initialized)
    try {
      const auth = getAuthInstance()
      await signOut(auth)
    } catch (e) {
      console.error("Sign out failed", e)
    }

    router.push("/")
  }

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-soft p-2 shadow-md">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Learning Journal</h1>
              <p className="text-sm text-white opacity-90">Reflect • Learn • Grow</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("menu")}
              className={`flex items-center gap-2 px-4 py-2 rounded-soft font-semibold transition-all ${
                currentView === "menu"
                  ? "bg-white text-primary shadow-md"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            <button
              onClick={() => onNavigate("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-soft font-semibold transition-all ${
                currentView === "list"
                  ? "bg-white text-primary shadow-md"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              My Journal
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-primary font-semibold px-4 py-2 rounded-soft hover:bg-gray-100 transition-colors shadow-md ml-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
