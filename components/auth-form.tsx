"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthInstance } from "@/lib/firebaseClient"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { Mail, Lock, Chrome } from "lucide-react"

interface AuthFormProps {
  isSignUp?: boolean
}

export default function AuthForm({ isSignUp = false }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignUp) {
        const auth = getAuthInstance()
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        const auth = getAuthInstance()
        await signInWithEmailAndPassword(auth, email, password)
      }
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      const auth = getAuthInstance()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleEmailAuth} className="space-y-4">
        {error && <div className="bg-error text-white p-3 rounded-soft text-sm">{error}</div>}

        <div>
          <label className="block text-foreground font-semibold mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-primary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-card text-foreground"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-foreground font-semibold mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-primary" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-soft focus:outline-none focus:border-primary bg-card text-foreground"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-semibold py-2 rounded-soft hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-foreground text-sm">or</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-border text-foreground font-semibold py-2 rounded-soft hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <Chrome className="w-5 h-5" />
        Sign in with Google
      </button>
    </div>
  )
}
