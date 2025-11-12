"use client"

import Link from "next/link"
import AuthForm from "@/components/auth-form"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-accent-green flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary-dark mb-8 font-semibold">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="bg-card rounded-softer p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-foreground mb-6">Sign in to continue your learning journey.</p>

          <AuthForm isSignUp={false} />

          <p className="text-center text-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:text-primary-dark">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
