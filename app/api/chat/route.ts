import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'

// Rate limiting configuration
const RATE_LIMIT = {
    INPUT_MAX_CHARS: 1000,      // Max characters per user message
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

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Check rate limit
        if (!checkRateLimit(user.id)) {
            return new Response(JSON.stringify({
                error: 'Rate limit exceeded. Please wait a minute before sending more messages.',
                rateLimited: true
            }), { 
                status: 429,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const { message, conversationHistory = [] } = await request.json()

        if (!message) {
            return new Response(JSON.stringify({ error: 'Message is required' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Validate input length
        if (message.length > RATE_LIMIT.INPUT_MAX_CHARS) {
            return new Response(JSON.stringify({
                error: `Message too long. Maximum ${RATE_LIMIT.INPUT_MAX_CHARS} characters allowed.`
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
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

        const messages: { role: 'user' | 'assistant'; content: string }[] = [
            ...limitedHistory.map((msg: { role: string; content: string }) => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            })),
            { role: 'user' as const, content: message }
        ]

        const result = streamText({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            messages,
            temperature: 0.7,
            maxOutputTokens: 500
        })

        return result.toTextStreamResponse()

    } catch (error) {
        console.error('Chat API error:', error)
        return new Response(JSON.stringify({ error: 'Internal server error' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
