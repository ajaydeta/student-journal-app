// Client-only Firebase initialization

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import config from "./configLoader"

const firebaseConfig = config.firebase

// Initialize Firebase only on the client and when API key is present.
const isClient = typeof window !== "undefined"
const hasApiKey = Boolean(firebaseConfig.apiKey)

const app: FirebaseApp | undefined = isClient && hasApiKey ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : undefined

const auth: Auth | null = isClient && hasApiKey && app ? getAuth(app) : null
const db: Firestore | null = isClient && hasApiKey && app ? getFirestore(app) : null

export { auth, db }

// Helper getters that return non-null instances or throw a clear error.
export function getDb(): Firestore {
  if (!db) {
    throw new Error(
      "Firestore has not been initialized. Make sure you're calling this from client-side code and NEXT_PUBLIC_FIREBASE_API_KEY is set."
    )
  }
  return db
}

export function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error(
      "Firebase Auth has not been initialized. Make sure you're calling this from client-side code and NEXT_PUBLIC_FIREBASE_API_KEY is set."
    )
  }
  return auth
}
