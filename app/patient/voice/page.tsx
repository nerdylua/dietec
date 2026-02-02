'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    Mic,
    Phone,
    PhoneOff,
    Loader2,
    Video,
    AlertCircle,
    RefreshCw,
    Shield,
    Clock,
    Globe,
    Sparkles,
    Heart,
    Stethoscope,
    MessageCircle
} from 'lucide-react'

type CallState = 'idle' | 'initializing' | 'connecting' | 'active' | 'ended' | 'error'

// Store persona ID in localStorage for reuse
const PERSONA_STORAGE_KEY = 'dietec_tavus_persona_id'

export default function VoiceBotPage() {
    const [callState, setCallState] = useState<CallState>('idle')
    const [conversationUrl, setConversationUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const getOrCreatePersona = async (): Promise<string | null> => {
        // Check if we have a stored persona ID
        const storedPersonaId = localStorage.getItem(PERSONA_STORAGE_KEY)
        if (storedPersonaId) {
            return storedPersonaId
        }

        // Create a new persona
        const response = await fetch('/api/tavus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-persona' })
        })

        if (!response.ok) {
            throw new Error('Failed to create persona')
        }

        const data = await response.json()
        localStorage.setItem(PERSONA_STORAGE_KEY, data.persona_id)
        return data.persona_id
    }

    const startCall = async () => {
        setCallState('initializing')
        setError(null)

        try {
            // Get or create persona
            const personaId = await getOrCreatePersona()
            if (!personaId) {
                throw new Error('Could not get persona')
            }

            setCallState('connecting')

            // Create conversation
            const response = await fetch('/api/tavus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create-conversation',
                    personaId
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create conversation')
            }

            const data = await response.json()
            setConversationUrl(data.conversation_url)
            setCallState('active')

        } catch (err) {
            console.error('Call error:', err)
            setError(err instanceof Error ? err.message : 'Failed to start call')
            setCallState('error')
        }
    }

    const endCall = () => {
        setConversationUrl(null)
        setCallState('ended')
        setTimeout(() => setCallState('idle'), 2000)
    }

    const retryCall = () => {
        setError(null)
        setCallState('idle')
    }

    const features = [
        { icon: Video, label: 'Face-to-Face Video', desc: 'See and talk to your AI assistant' },
        { icon: Mic, label: 'Natural Voice Chat', desc: 'Speak naturally, get instant responses' },
        { icon: Stethoscope, label: 'Health Guidance', desc: 'Get answers to health questions' },
        { icon: MessageCircle, label: 'Platform Help', desc: 'Navigate DIETEC with ease' },
    ]

    const stats = [
        { icon: Clock, value: '24/7', label: 'Available' },
        { icon: Globe, value: '30+', label: 'Languages' },
        { icon: Shield, value: '100%', label: 'Private' },
    ]

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0A0A0A] dark:to-[#111] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 h-16 border-b border-slate-200 dark:border-[#222] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl flex-shrink-0">
                <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/patient"
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#222] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <motion.div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20"
                                    animate={callState === 'active' ? { scale: [1, 1.05, 1] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Heart className="w-5 h-5 text-white" />
                                </motion.div>
                                {callState === 'active' && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0A0A0A]" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-[15px] font-semibold text-slate-900 dark:text-white">AI Health Assistant</h1>
                                <p className={`text-[12px] flex items-center gap-1.5 ${callState === 'active' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {callState === 'active' && (
                                        <motion.span 
                                            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}
                                    {callState === 'idle' && 'Ready to assist'}
                                    {callState === 'initializing' && 'Setting up...'}
                                    {callState === 'connecting' && 'Connecting...'}
                                    {callState === 'active' && 'Live Session'}
                                    {callState === 'ended' && 'Session ended'}
                                    {callState === 'error' && 'Connection failed'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AnimatePresence>
                            {callState === 'active' && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={endCall}
                                    className="h-9 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium flex items-center gap-2 shadow-lg shadow-red-500/20 transition-colors"
                                >
                                    <PhoneOff className="w-4 h-4" />
                                    End Session
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    {callState === 'active' && conversationUrl ? (
                        /* Video Container */
                        <motion.div
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 p-4 md:p-6"
                        >
                            <div className="w-full h-full max-w-5xl mx-auto rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10">
                                <iframe
                                    ref={iframeRef}
                                    src={conversationUrl}
                                    allow="camera; microphone; autoplay; display-capture"
                                    className="w-full h-full border-0"
                                    title="DIETEC AI Video Assistant"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        /* Landing Interface */
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 overflow-y-auto"
                        >
                            <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
                                {/* Hero Section */}
                                <div className="text-center mb-12">
                                    {/* Avatar */}
                                    <div className="relative inline-block mb-6">
                                        <motion.div
                                            className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center shadow-2xl ${
                                                callState === 'error'
                                                    ? 'bg-red-100 dark:bg-red-500/20'
                                                    : callState === 'initializing' || callState === 'connecting'
                                                        ? 'bg-slate-100 dark:bg-slate-800'
                                                        : 'bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600'
                                            }`}
                                            animate={callState === 'connecting' ? {
                                                boxShadow: ['0 0 0 0 rgba(139, 92, 246, 0.4)', '0 0 0 20px rgba(139, 92, 246, 0)', '0 0 0 0 rgba(139, 92, 246, 0)']
                                            } : {}}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            {callState === 'initializing' || callState === 'connecting' ? (
                                                <Loader2 className="w-14 h-14 md:w-16 md:h-16 text-violet-500 animate-spin" />
                                            ) : callState === 'error' ? (
                                                <AlertCircle className="w-14 h-14 md:w-16 md:h-16 text-red-500" />
                                            ) : callState === 'ended' ? (
                                                <PhoneOff className="w-14 h-14 md:w-16 md:h-16 text-white" />
                                            ) : (
                                                <Sparkles className="w-14 h-14 md:w-16 md:h-16 text-white" />
                                            )}
                                        </motion.div>

                                        {/* Pulse rings for idle state */}
                                        {callState === 'idle' && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                {[1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-violet-500/30"
                                                        animate={{ scale: [1, 1.2, 1.4], opacity: [0.5, 0.2, 0] }}
                                                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Description */}
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                        {callState === 'idle' && 'Meet Your AI Health Assistant'}
                                        {callState === 'initializing' && 'Preparing Your Session...'}
                                        {callState === 'connecting' && 'Connecting to Assistant...'}
                                        {callState === 'ended' && 'Session Complete'}
                                        {callState === 'error' && 'Connection Failed'}
                                    </h2>
                                    <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8">
                                        {callState === 'idle' && 'Have a face-to-face video conversation with our AI health assistant. Get instant help with health questions, appointments, and navigating DIETEC.'}
                                        {callState === 'initializing' && 'Setting up your personalized health assistant experience...'}
                                        {callState === 'connecting' && 'Almost there! Establishing a secure connection...'}
                                        {callState === 'ended' && 'Thank you for using DIETEC AI Assistant. Your session has ended.'}
                                        {callState === 'error' && (error || 'Something went wrong. Please check your connection and try again.')}
                                    </p>

                                    {/* CTA Button */}
                                    <div className="flex justify-center gap-4">
                                        {callState === 'idle' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={startCall}
                                                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-base font-semibold flex items-center gap-3 shadow-xl shadow-violet-500/30 transition-all"
                                            >
                                                <Phone className="w-5 h-5" />
                                                Start Video Call
                                            </motion.button>
                                        )}

                                        {callState === 'ended' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setCallState('idle')}
                                                className="h-12 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[14px] font-medium flex items-center gap-2"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Start New Session
                                            </motion.button>
                                        )}

                                        {callState === 'error' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={retryCall}
                                                className="h-12 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[14px] font-medium flex items-center gap-2"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Try Again
                                            </motion.button>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                {callState === 'idle' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex justify-center gap-8 mb-12"
                                    >
                                        {stats.map((stat, i) => (
                                            <div key={i} className="text-center">
                                                <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mx-auto mb-2">
                                                    <stat.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                                </div>
                                                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Features Grid */}
                                {callState === 'idle' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {features.map((feature, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + i * 0.05 }}
                                                className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#222] hover:border-violet-300 dark:hover:border-violet-500/30 transition-colors"
                                            >
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/10 dark:to-purple-500/10 flex items-center justify-center flex-shrink-0">
                                                    <feature.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-0.5">{feature.label}</h3>
                                                    <p className="text-[13px] text-slate-500 dark:text-slate-400">{feature.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
