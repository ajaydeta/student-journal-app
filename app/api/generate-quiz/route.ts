import { generateObject } from "ai"
import { z } from "zod"

// Define the structured output schema matching the requirements
const quizSchema = z.object({
  journal_summary: z.string(),
  questions: z.array(
    z.object({
      question_id: z.number(),
      question_text: z.string(),
      options: z.array(
        z.object({
          option_id: z.string(),
          text: z.string(),
        }),
      ),
      correct_option_id: z.string(),
    }),
  ),
  scoring: z.object({
    points_per_correct: z.number(),
    points_per_wrong: z.number(),
    max_score: z.number(),
  }),
})

import { NextResponse } from 'next/server'

const AI_BASE_URL = "https://ai.sumopod.com"
const AI_API_KEY = "sk-Whe7SvJ9Pz_x_iCdyBWkxg"

export async function POST(req: Request) {
  try {
    const { journalContent, journalTitle, gradeLevel } = await req.json()

    const response = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI that generates quizzes from journal content."
          },
          {
            role: "user",
            content: `Generate a quiz from this journal entry titled "${journalTitle}". Content: ${journalContent}. Make sure each question has an explanation that will help the student understand the correct answer.`
          }
        ],
        functions: [
          {
            name: "generate_quiz_from_journal_with_explanations",
            description: "Generate exactly 5 multiple-choice questions (4 options each) from a user-provided journal, plus scoring and end-of-quiz explanations for each question.",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  description: "Array of exactly 5 generated multiple-choice questions.",
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: "object",
                    properties: {
                      question_id: { type: "integer", description: "1-based question index" },
                      question_text: { type: "string", description: "The full question text." },
                      options: {
                        type: "array",
                        minItems: 4,
                        maxItems: 4,
                        items: {
                          type: "object",
                          properties: {
                            option_id: { type: "string", description: "Option letter: A, B, C, or D" },
                            text: { type: "string", description: "Option text." }
                          },
                          required: ["option_id", "text"]
                        }
                      },
                      correct_option_id: {
                        type: "string",
                        description: "Correct option ID (A, B, C, or D)."
                      }
                    },
                    required: ["question_id", "question_text", "options", "correct_option_id"]
                  }
                }
              },
              required: ["journal_summary", "questions"]
            }
          }
        ],
        function_call: { name: "generate_quiz_from_journal_with_explanations" }
      })
    })

    if (!response.ok) {
      throw new Error('AI API request failed')
    }

    const result = await response.json()
    const functionCall = result.choices[0].message.function_call
    const quizData = JSON.parse(functionCall.arguments)

    interface QuizOption {
      option_id: string
      text: string
    }

    interface QuizQuestion {
      question_id: number
      question_text: string
      options: QuizOption[]
      correct_option_id: string
    }

    // Add explanations to each question
    quizData.questions = quizData.questions.map((question: QuizQuestion) => ({
      ...question,
      explanation: `For question "${question.question_text}", the correct answer is ${question.correct_option_id}: "${
        question.options.find((opt: QuizOption) => opt.option_id === question.correct_option_id)?.text
      }". This can be found in the journal where it discusses this topic.`
    }))

    return NextResponse.json(quizData)
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
