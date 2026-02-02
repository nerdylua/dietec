'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    Send,
    Bot,
    User,
    Sparkles,
    Loader2,
    AlertCircle,
    RefreshCw
} from 'lucide-react'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const suggestedQuestions = [
    'What are the symptoms of flu?',
    'How can I improve my sleep?',
    'What should I eat for better digestion?',
    'How to manage stress and anxiety?',
]

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI Health Advisor powered by advanced AI. I can help answer general health questions, explain medical terms, or provide wellness tips. How can I assist you today?',
            timestamp: new Date(),
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        }

        // Create a placeholder for the AI response
        const aiMessageId = (Date.now() + 1).toString()

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        setError(null)

        try {
            const conversationHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }))

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    conversationHistory
                })
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
            }

            // Handle streaming response
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (!reader) {
                throw new Error('No response body')
            }

            // Add empty AI message that we'll update as we receive chunks
            setMessages(prev => [...prev, {
                id: aiMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
            }])

            let accumulatedContent = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                accumulatedContent += chunk

                // Update the message with accumulated content
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                ))
            }
        } catch (err) {
            setError('Failed to get AI response. Please try again.')
            console.error('Chat error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRetry = () => {
        setError(null)
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
        if (lastUserMessage) {
            setInput(lastUserMessage.content)
            setMessages(prev => prev.filter(m => m.id !== lastUserMessage.id))
        }
    }

    return (
        <div className="h-screen bg-white dark:bg-[#0A0A0A] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl flex-shrink-0">
                <div className="h-full max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/patient"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">AI Health Advisor</h1>
                                <p className="text-[12px] text-emerald-500 flex items-center gap-1">
                                    <motion.span
                                        className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    Powered by GPT-4
                                </p>
                            </div>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col">
                    {/* Disclaimer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[13px] text-amber-700 dark:text-amber-300/80">
                                This AI provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
                            </p>
                        </div>
                    </motion.div>

                    {/* Chat Messages */}
                    <div className="space-y-6">
                        {messages.map((message, i) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant'
                                        ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                        }`}
                                >
                                    {message.role === 'assistant' ? (
                                        <Bot className="w-4 h-4 text-white" />
                                    ) : (
                                        <User className="w-4 h-4 text-white" />
                                    )}
                                </motion.div>
                                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                                    <div
                                        className={`inline-block p-4 rounded-2xl text-[14px] leading-relaxed ${message.role === 'assistant'
                                            ? 'bg-[#F5F5F5] dark:bg-[#222] text-[#171717] dark:text-white rounded-tl-md'
                                            : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-tr-md'
                                            }`}
                                    >
                                        {message.role === 'assistant' ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                    li: ({ children }) => <li>{children}</li>,
                                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                                                    code: ({ children }) => <code className="bg-[#E5E5E5] dark:bg-[#333] px-1 py-0.5 rounded text-[13px]">{children}</code>,
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <div className="whitespace-pre-wrap">{message.content}</div>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-[#999] mt-1">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="p-4 rounded-2xl rounded-tl-md bg-[#F5F5F5] dark:bg-[#222]">
                                    <motion.div
                                        className="flex items-center gap-2"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                                        <span className="text-[14px] text-[#666] dark:text-[#888]">Thinking...</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <div className="p-4 rounded-2xl rounded-tl-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
                                    <p className="text-[14px] text-red-600 dark:text-red-400">{error}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleRetry}
                                        className="mt-2 text-[13px] text-red-500 hover:underline flex items-center gap-1"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        Retry
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A]"
                >
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <p className="text-[12px] text-[#999] mb-3">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((q, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setInput(q)}
                                    className="px-3 py-1.5 rounded-full border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] hover:border-violet-300 dark:hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                >
                                    {q}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Input */}
            <div className="border-t border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] flex-shrink-0">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Ask a health question..."
                            className="flex-1 h-11 px-4 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A] transition-shadow"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            <Send className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}
