'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    Mic,
    MicOff,
    Volume2,
    Sparkles,
    Phone,
    PhoneOff,
    Loader2
} from 'lucide-react'

type CallState = 'idle' | 'connecting' | 'active' | 'ended'

export default function VoiceBotPage() {
    const [callState, setCallState] = useState<CallState>('idle')
    const [isMuted, setIsMuted] = useState(false)
    const [transcript, setTranscript] = useState<string[]>([])
    const [isListening, setIsListening] = useState(false)

    const startCall = () => {
        setCallState('connecting')
        setTranscript([])

        // Simulate connection delay
        setTimeout(() => {
            setCallState('active')
            setTranscript(prev => [...prev, '🤖 AI: Hello! I\'m your DIETEC Health Assistant. How can I help you today?'])
        }, 2000)
    }

    const endCall = () => {
        setCallState('ended')
        setTimeout(() => setCallState('idle'), 2000)
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    // Simulate voice responses
    useEffect(() => {
        if (callState === 'active' && !isMuted) {
            const responses = [
                '🤖 AI: I can help you with appointments, lab tests, or general health questions.',
                '🤖 AI: Would you like to book an appointment or check your lab results?',
            ]

            const timer = setTimeout(() => {
                if (transcript.length < 3 && callState === 'active') {
                    setTranscript(prev => [...prev, responses[Math.min(prev.length - 1, responses.length - 1)]])
                }
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [callState, transcript.length, isMuted])

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col">
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
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                                animate={callState === 'active' ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Voice Assistant</h1>
                                <p className={`text-[12px] ${callState === 'active' ? 'text-emerald-500' : 'text-[#666] dark:text-[#888]'}`}>
                                    {callState === 'idle' && 'Ready to help'}
                                    {callState === 'connecting' && 'Connecting...'}
                                    {callState === 'active' && '● Connected'}
                                    {callState === 'ended' && 'Call ended'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Call Interface */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    {/* Avatar */}
                    <div className="relative mb-8">
                        <motion.div
                            className={`w-40 h-40 rounded-full mx-auto flex items-center justify-center ${callState === 'active'
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                    : 'bg-[#F5F5F5] dark:bg-[#222]'
                                }`}
                            animate={callState === 'active' ? {
                                boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.4)', '0 0 0 30px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0)']
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {callState === 'connecting' ? (
                                <Loader2 className="w-16 h-16 text-[#666] animate-spin" />
                            ) : callState === 'active' ? (
                                <Volume2 className="w-16 h-16 text-white" />
                            ) : (
                                <Mic className="w-16 h-16 text-[#666] dark:text-[#888]" />
                            )}
                        </motion.div>

                        {/* Sound Waves (when active) */}
                        {callState === 'active' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {[1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-40 h-40 rounded-full border-2 border-emerald-500/30"
                                        animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status Text */}
                    <h2 className="text-[24px] font-bold text-[#171717] dark:text-white mb-2">
                        {callState === 'idle' && 'AI Health Assistant'}
                        {callState === 'connecting' && 'Connecting...'}
                        {callState === 'active' && 'Listening...'}
                        {callState === 'ended' && 'Call Ended'}
                    </h2>
                    <p className="text-[15px] text-[#666] dark:text-[#888] mb-8 max-w-md mx-auto">
                        {callState === 'idle' && 'Tap the button below to start a voice conversation with our AI health assistant.'}
                        {callState === 'connecting' && 'Please wait while we connect you...'}
                        {callState === 'active' && 'Speak clearly. I\'m here to help with your health questions.'}
                        {callState === 'ended' && 'Thank you for using DIETEC Voice Assistant!'}
                    </p>

                    {/* Call Transcript */}
                    {transcript.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-[#F5F5F5] dark:bg-[#222] text-left"
                        >
                            <div className="space-y-2">
                                {transcript.map((line, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[14px] text-[#171717] dark:text-white"
                                    >
                                        {line}
                                    </motion.p>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                        {callState === 'idle' && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startCall}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Phone className="w-8 h-8" />
                            </motion.button>
                        )}

                        {callState === 'active' && (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleMute}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted
                                            ? 'bg-red-100 dark:bg-red-500/20 text-red-500'
                                            : 'bg-[#F5F5F5] dark:bg-[#222] text-[#666] dark:text-[#888]'
                                        }`}
                                >
                                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={endCall}
                                    className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
                                >
                                    <PhoneOff className="w-8 h-8" />
                                </motion.button>

                                <div className="w-14 h-14" /> {/* Spacer for balance */}
                            </>
                        )}

                        {callState === 'ended' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCallState('idle')}
                                className="h-12 px-6 rounded-xl bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium"
                            >
                                New Call
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Footer Note */}
            <footer className="p-6 text-center">
                <p className="text-[13px] text-[#999]">
                    Note: Voice calls are processed using AI. Always consult a doctor for medical decisions.
                </p>
            </footer>
        </div>
    )
}
