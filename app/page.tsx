"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebaseClient"
import { onAuthStateChanged, type User } from "firebase/auth"
import WelcomePage from "@/components/welcome-page"
import MainDashboard from "@/components/main-dashboard"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Guard: `auth` may be null when Firebase isn't initialized (e.g. missing env).
    if (!auth) {
      setUser(null)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-accent-pink rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Loading your journal...</p>
        </div>
      </div>
    )
  }

  return user ? <MainDashboard user={user} /> : <WelcomePage />
}
