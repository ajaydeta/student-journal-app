"use client"

import Link from "next/link"
import AuthForm from "@/components/auth-form"
import { ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-pink via-background to-accent-yellow flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-dark mb-8 font-semibold">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="bg-card rounded-softer p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-foreground mb-6">Join us to start your learning journey!</p>

          <AuthForm isSignUp={true} />

          <p className="text-center text-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:text-primary-dark">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
