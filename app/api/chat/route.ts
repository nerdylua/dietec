import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Rate limiting configuration
const RATE_LIMIT = {
    INPUT_MAX_CHARS: 1000,      // Max characters per user message
    INPUT_MAX_TOKENS: 300,      // Approximate max tokens for input
    OUTPUT_MAX_TOKENS: 500,     // Max tokens for AI response
    REQUESTS_PER_MINUTE: 10,    // Max requests per minute per user
    CONTEXT_MESSAGES: 6,        // Max previous messages to include
}

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(userId: string): boolean {
    const now = Date.now()
    const userLimit = rateLimitMap.get(userId)

    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 })
        return true
    }

    if (userLimit.count >= RATE_LIMIT.REQUESTS_PER_MINUTE) {
        return false
    }

    userLimit.count++
    return true
}

// Rough token estimation (1 token ≈ 4 characters)
function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check rate limit
        if (!checkRateLimit(user.id)) {
            return NextResponse.json({
                error: 'Rate limit exceeded. Please wait a minute before sending more messages.',
                rateLimited: true
            }, { status: 429 })
        }

        const { message, conversationHistory = [] } = await request.json()

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Validate input length
        if (message.length > RATE_LIMIT.INPUT_MAX_CHARS) {
            return NextResponse.json({
                error: `Message too long. Maximum ${RATE_LIMIT.INPUT_MAX_CHARS} characters allowed.`
            }, { status: 400 })
        }

        const inputTokens = estimateTokens(message)
        if (inputTokens > RATE_LIMIT.INPUT_MAX_TOKENS) {
            return NextResponse.json({
                error: 'Message too long. Please keep it shorter.'
            }, { status: 400 })
        }

        const apiKey = process.env.OPENAI_API_KEY

        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
        }

        const systemPrompt = `You are a helpful AI Health Advisor for DIETEC Healthcare, a modern healthcare platform. Your role is to:

1. Provide general health information and wellness tips
2. Explain medical terms in simple language
3. Help users understand common symptoms and when to seek medical attention
4. Suggest healthy lifestyle choices
5. Answer questions about preventive healthcare

IMPORTANT GUIDELINES:
- Always remind users that you provide general information only, not medical diagnoses
- For serious symptoms, always recommend consulting a healthcare professional
- Be empathetic, professional, and supportive
- Never prescribe medications or specific treatments
- If you're unsure about something, say so and recommend professional consultation
- Keep responses concise but informative (under 300 words)
- Use markdown formatting for better readability:
  - Use **bold** for important terms
  - Use bullet points for lists
  - Use headings sparingly

Remember: You are an AI assistant, not a doctor. Always prioritize user safety.`

        // Limit conversation history
        const limitedHistory = conversationHistory.slice(-RATE_LIMIT.CONTEXT_MESSAGES)

        const messages = [
            { role: 'system', content: systemPrompt },
            ...limitedHistory,
            { role: 'user', content: message }
        ]

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages,
                temperature: 0.7,
                max_tokens: RATE_LIMIT.OUTPUT_MAX_TOKENS,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('OpenAI API error:', error)
            return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
        }

        const data = await response.json()
        const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'
        const usage = data.usage

        return NextResponse.json({
            message: aiMessage,
            usage: {
                promptTokens: usage?.prompt_tokens,
                completionTokens: usage?.completion_tokens,
                totalTokens: usage?.total_tokens
            }
        })

    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
