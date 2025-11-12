import { getDb } from "@/lib/firebaseClient"
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "firebase/firestore"

export interface QuizOption {
  option_id: string
  text: string
}

export interface QuizQuestion {
  question_id: number
  question_text: string
  options: QuizOption[]
  correct_option_id: string
  explanation?: string
}

export interface QuizAnswerResult {
  question_id: number
  selected_option_id: string | null
  is_correct: boolean
  earned_points: number
  explanation: string
}

export interface Quiz {
  id: string
  journalId: string
  userId: string
  questions: QuizQuestion[]
  createdAt: any
  completed: boolean
}

export async function generateQuizForJournal(
  journalId: string,
  userId: string,
  journalTitle: string,
  journalContent: string,
  gradeLevel: number,
): Promise<Quiz> {
  try {
    const response = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        journalContent,
        journalTitle,
        gradeLevel,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate quiz")
    }

    const quizData = await response.json()

    // Transform the quiz data to match our interface
    const quiz = {
      journalId,
      userId,
      questions: quizData.questions,
      createdAt: serverTimestamp(),
      completed: false,
    }

    // Save quiz to Firestore
    const db = getDb()
    const quizRef = await addDoc(collection(db, "quizzes"), quiz)

    return {
      ...quiz,
      id: quizRef.id,
      createdAt: new Date(),
    }
  } catch (error) {
    console.error("Error generating quiz:", error)
    throw error
  }
}

export async function getQuizForJournal(journalId: string): Promise<Quiz | null> {
  try {
    const db = getDb()
    const q = query(collection(db, "quizzes"), where("journalId", "==", journalId))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      journalId: data.journalId,
      userId: data.userId,
      questions: data.questions,
      createdAt: data.createdAt,
      completed: data.completed
    }
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return null
  }
}

export async function submitQuizAnswers(
  quizId: string,
  userAnswers: Array<{ question_id: number; selected_option_id: string }>
): Promise<Quiz> {
  try {
    // Get the current quiz
    const db = getDb()
    const quizRef = doc(db, "quizzes", quizId)
    const quizDoc = await getDoc(quizRef)
    
    if (!quizDoc.exists()) {
      throw new Error("Quiz not found")
    }

    const quizData = quizDoc.data()
    
    // Calculate results
    const answerResults: QuizAnswerResult[] = quizData.questions.map((question: QuizQuestion) => {
      const userAnswer = userAnswers.find(a => a.question_id === question.question_id)
      const isCorrect = userAnswer?.selected_option_id === question.correct_option_id
      
      return {
        question_id: question.question_id,
        selected_option_id: userAnswer?.selected_option_id || null,
        is_correct: isCorrect,
        earned_points: isCorrect ? quizData.scoring.points_per_correct : quizData.scoring.points_per_wrong,
        explanation: question.explanation || `The correct answer was ${question.correct_option_id}.`
      }
    })

    const totalScore = answerResults.reduce((sum, result) => sum + result.earned_points, 0)

    // Update the quiz in Firestore
    const updatedQuiz: Quiz = {
      id: quizId,
      journalId: quizData.journalId,
      userId: quizData.userId,
      questions: quizData.questions,
      createdAt: quizData.createdAt,
      completed: true,
    }

    await setDoc(quizRef, {
      ...quizData,
      completed: true,
      scoring: {
        user_answers: userAnswers,
        answer_results: answerResults,
        total_score: totalScore
      }
    })

    return updatedQuiz
  } catch (error) {
    console.error("Error submitting quiz answers:", error)
    throw error
  }
}

export async function getUserQuizzes(userId: string): Promise<Quiz[]> {
  try {
    const db = getDb()
    const q = query(collection(db, "quizzes"), where("userId", "==", userId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        journalId: data.journalId,
        userId: data.userId,
        questions: data.questions,
        journalSummary: data.journalSummary,
        scoring: {
          points_per_correct: data.scoring.points_per_correct,
          points_per_wrong: data.scoring.points_per_wrong,
          max_score: data.scoring.max_score,
          user_answers: data.scoring.user_answers || [],
          answer_results: data.scoring.answer_results || [],
          total_score: data.scoring.total_score || 0
        },
        createdAt: data.createdAt,
        completed: data.completed
      }
    })
  } catch (error) {
    console.error("Error fetching user quizzes:", error)
    return []
  }
}
