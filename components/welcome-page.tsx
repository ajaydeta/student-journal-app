"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-accent-green flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-softer p-6 shadow-lg">
            <BookOpen className="w-16 h-16 text-primary mx-auto" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-2">My Learning Journal</h1>

        {/* Subtitle */}
        <p className="text-lg text-foreground mb-8 leading-relaxed">
          Welcome! This is your special place to write about what you learned today and reflect on your school
          adventures.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href="/signup"
            className="bg-accent-pink text-white font-semibold py-3 px-6 rounded-softer hover:bg-accent-coral transition-colors shadow-md"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-primary text-white font-semibold py-3 px-6 rounded-softer hover:bg-primary-dark transition-colors shadow-md"
          >
            Log In
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-4">
          <div className="w-12 h-12 bg-accent-yellow rounded-softer opacity-70"></div>
          <div className="w-12 h-12 bg-accent-green rounded-softer opacity-70"></div>
          <div className="w-12 h-12 bg-accent-pink rounded-softer opacity-70"></div>
        </div>
      </div>
    </div>
  )
}
