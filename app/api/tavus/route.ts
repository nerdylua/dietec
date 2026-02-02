import { createClient } from '@/lib/supabase/server'

const TAVUS_API_KEY = process.env.TAVUS_API_KEY
const TAVUS_API_URL = 'https://tavusapi.com/v2'

// DIETEC Medical Assistant System Prompt
const DIETEC_SYSTEM_PROMPT = `You are dietech AI, a friendly and professional AI Health Assistant for DIETEC Healthcare, a modern healthcare platform.

Your role is to:
1. Provide general health information and wellness tips
2. Help users understand common symptoms and when to seek medical attention
3. Explain medical terms in simple, easy-to-understand language
4. Assist with booking appointments, lab tests, and medicine orders on the DIETEC platform
5. Answer questions about preventive healthcare and healthy lifestyle choices
6. Guide users through the DIETEC platform features

IMPORTANT GUIDELINES:
- Always be warm, empathetic, and professional
- Remind users that you provide general information only, not medical diagnoses
- For serious symptoms, always recommend consulting a healthcare professional immediately
- Never prescribe medications or specific treatments
- If you're unsure about something, say so and recommend professional consultation
- Keep responses conversational and concise
- Address users by name when provided

Remember: You are an AI assistant representing dietech Healthcare. Prioritize user safety and always encourage professional medical consultation for health concerns.`

const DIETEC_CONTEXT = `dietech Healthcare is a modern, AI-powered healthcare platform that offers:
- Smart appointment booking with top specialists
- Lab test booking with home collection and digital results
- Medicine delivery to doorstep
- AI Health Chat for instant health guidance
- Voice consultations with AI assistant
- Health records management
- Vital tracking over time

The platform is designed to make healthcare accessible, convenient, and personalized for everyone.`

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

        if (!TAVUS_API_KEY) {
            return new Response(JSON.stringify({ error: 'Tavus API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const { action, personaId } = await request.json()

        if (action === 'create-persona') {
            // Create DIETEC Medical Persona
            const personaResponse = await fetch(`${TAVUS_API_URL}/personas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': TAVUS_API_KEY
                },
                body: JSON.stringify({
                    persona_name: 'DIETEC Health Assistant',
                    system_prompt: DIETEC_SYSTEM_PROMPT,
                    context: DIETEC_CONTEXT,
                    pipeline_mode: 'full',
                    default_replica_id: 'r95fd27b5a37', // Helen - Professional office look, suitable for healthcare
                    layers: {
                        stt: {
                            smart_turn_detection: true
                        }
                    }
                })
            })

            if (!personaResponse.ok) {
                const error = await personaResponse.json()
                console.error('Tavus persona creation error:', error)
                return new Response(JSON.stringify({ error: 'Failed to create persona' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                })
            }

            const personaData = await personaResponse.json()
            return new Response(JSON.stringify(personaData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        if (action === 'create-conversation') {
            if (!personaId) {
                return new Response(JSON.stringify({ error: 'Persona ID required' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }

            // Get user info for personalized greeting
            const { data: userData } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', user.id)
                .single()

            const userName = userData?.full_name || 'there'

            // Create conversation
            const conversationResponse = await fetch(`${TAVUS_API_URL}/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': TAVUS_API_KEY
                },
                body: JSON.stringify({
                    persona_id: personaId,
                    conversation_name: `DIETEC Session - ${user.email}`,
                    custom_greeting: `Hello ${userName}! I'm your DIETEC Health Assistant. I'm here to help you with any health questions, book appointments, or guide you through our platform. How can I assist you today?`,
                    conversational_context: `The user's name is ${userName}. They are a registered patient on the DIETEC Healthcare platform.`
                })
            })

            if (!conversationResponse.ok) {
                const error = await conversationResponse.json()
                console.error('Tavus conversation creation error:', error)
                return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                })
            }

            const conversationData = await conversationResponse.json()
            return new Response(JSON.stringify(conversationData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('Tavus API error:', error)
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
