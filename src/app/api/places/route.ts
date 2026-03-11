import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import type { Activity } from '@/app/types'

// Simple in-memory rate limiter (resets on server restart / cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60_000
  const limit = 10
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

function parseActivities(raw: string): Activity[] {
  // Strip markdown code fences if the model wraps its output
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const parsed: unknown = JSON.parse(cleaned)
  if (!Array.isArray(parsed)) throw new Error('Expected JSON array')
  return parsed.map((item, i) => {
    if (typeof item !== 'object' || item === null) throw new Error(`Item ${i} is not an object`)
    const { name, description, emoji } = item as Record<string, unknown>
    if (typeof name !== 'string' || typeof description !== 'string' || typeof emoji !== 'string') {
      throw new Error(`Item ${i} has invalid fields`)
    }
    return { name, description, emoji }
  })
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests — please wait a minute.' }, { status: 429 })
  }

  let destination: string
  try {
    const body = await req.json()
    destination = body?.destination
    if (!destination || typeof destination !== 'string') {
      return NextResponse.json({ error: 'Missing destination' }, { status: 400 })
    }
    destination = destination.trim().slice(0, 100)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const prompt = `List 5 fun and unique things to do in ${destination}.

Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences.
Each item must have exactly these fields:
- "name": string (concise activity name, no emoji)
- "description": string (2-3 friendly sentences with 1-2 relevant emojis)
- "emoji": string (single emoji representing the activity)

Example format:
[{"name":"Visit Senso-ji Temple","description":"Explore Tokyo's oldest Buddhist temple and soak up centuries of history. ⛩️ Grab a fortune slip and browse the Nakamise shopping street on your way out.","emoji":"⛩️"}]`

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Travel Genie',
        },
      },
    )

    const raw: string = response.data.choices[0].message.content
    const activities = parseActivities(raw)
    return NextResponse.json({ activities })
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('OpenRouter error:', error.response?.status, error.response?.data)
    } else {
      console.error('Parse/unknown error:', error)
    }
    return NextResponse.json({ error: 'Failed to fetch activities. Please try again.' }, { status: 500 })
  }
}
