import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { destination } = body

    if (!destination) {
      return NextResponse.json(
        { error: 'Missing destination' },
        { status: 400 },
      )
    }

    const prompt = `
      List 5 fun and unique things to do in ${destination}.
      For each activity, include:
      - A name
      - A short, friendly description (with emojis)
      - A clickable affiliate-style link (use dummy or example links like https://example.com/activity-name?ref=travelgenie)

      Format it like:

      🌇 Activity Name
      Short description here.
      [Book now](https://example.com/activity-name?ref=travelgenie)
      `

    const openaiRes = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
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

    const result = openaiRes.data.choices[0].message.content

    return NextResponse.json({ result })
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('OpenRouter Axios Error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      })
    } else {
      console.error('OpenRouter Unknown Error:', error)
    }

    return NextResponse.json(
      { error: 'OpenRouter request failed' },
      { status: 500 },
    )
  }
}
