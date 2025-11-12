"use client"

import { useEffect, useState } from "react"
import { getDb } from "@/lib/firebaseClient"
import type { Firestore } from "firebase/firestore"
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore"

interface Journal {
  id: string
  title: string
  content: string
  date: string
  grade: number
  createdAt: any
}

interface JournalStats {
  totalEntries: number
  averageGrade: number
  entriesByGrade: { [key: number]: number }
  lastEntryDate: string | null
  totalWords: number
}

// Real-time listener for journals
export function useJournals(userId: string) {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    let db: Firestore
    try {
      db = getDb()
    } catch (err) {
      console.error("Firestore not initialized in useJournals:", err)
      setLoading(false)
      return
    }

    const q = query(collection(db, "journals"), where("userId", "==", userId))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const journalsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Journal[]
          // use a non-mutating sort to avoid mutating the original array (fixes linter/TS suggestion)
          const sorted = journalsList.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setJournals(sorted)
          setError(null)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load journals")
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [userId])

  return { journals, loading, error }
}

// Calculate journal statistics
export function useJournalStats(userId: string) {
  const [stats, setStats] = useState<JournalStats>({
    totalEntries: 0,
    averageGrade: 0,
    entriesByGrade: {},
    lastEntryDate: null,
    totalWords: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      let db: Firestore
      try {
        db = getDb()
      } catch (err) {
        console.error("Firestore not initialized in useJournalStats:", err)
        setLoading(false)
        return
      }
      try {
        const q = query(collection(db, "journals"), where("userId", "==", userId))
        const snapshot = await getDocs(q)

        const journals = snapshot.docs.map((doc) => doc.data()) as Journal[]

        if (journals.length === 0) {
          setStats({
            totalEntries: 0,
            averageGrade: 0,
            entriesByGrade: {},
            lastEntryDate: null,
            totalWords: 0,
          })
          setLoading(false)
          return
        }

        // Calculate statistics
        const entriesByGrade: { [key: number]: number } = {}
        let totalGrade = 0
        let totalWords = 0
        // store timestamp (ms) to avoid Date instanceof issues
        let lastTimestamp: number | null = null

        for (const journal of journals) {
          // Count by grade
          entriesByGrade[journal.grade] = (entriesByGrade[journal.grade] || 0) + 1
          totalGrade += journal.grade

          // Count words
          totalWords += journal.content.split(/\s+/).length

          // Track last entry date
          const entryDate = new Date(journal.date)
          const ts = entryDate.getTime()
          if (lastTimestamp === null || ts > lastTimestamp) {
            lastTimestamp = ts
          }
        }

        setStats({
          totalEntries: journals.length,
          averageGrade: Math.round((totalGrade / journals.length) * 10) / 10,
          entriesByGrade,
          lastEntryDate: typeof lastTimestamp === "number" ? new Date(lastTimestamp).toLocaleDateString() : null,
          totalWords,
        })
      } catch (err) {
        console.error("Error calculating stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  return { stats, loading }
}
