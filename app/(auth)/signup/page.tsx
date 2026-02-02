'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { signup } from '../actions'
import { ArrowRight, Loader2, Check } from 'lucide-react'

const features = [
    'AI-powered health insights',
    'Instant appointment booking',
    'Secure medical records',
    'Connect with specialists',
]

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLDivElement>(null)
    const featuresRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            )
            gsap.fromTo(
                featuresRef.current,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [])

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            setIsLoading(false)
            return
        }

        const result = await signup(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div ref={containerRef} className="min-h-screen pt-16">
            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 items-start">
                {/* Left side - Form */}
                <div ref={formRef} className="w-full lg:w-1/2 max-w-[480px] opacity-0">
                    <h1 className="text-[40px] font-bold tracking-[-0.04em] leading-tight mb-3">
                        Start your health journey
                    </h1>
                    <p className="text-[17px] text-[#666] dark:text-[#888] mb-8">
                        Create a free account to access all features.
                    </p>

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-[13px] font-medium text-[#171717] dark:text-[#EDEDED] mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="John Doe"
                                required
                                autoComplete="name"
                                className="w-full h-11 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A] transition-shadow"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[13px] font-medium text-[#171717] dark:text-[#EDEDED] mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full h-11 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A] transition-shadow"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[13px] font-medium text-[#171717] dark:text-[#EDEDED] mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Min. 8 chars"
                                    required
                                    autoComplete="new-password"
                                    className="w-full h-11 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A] transition-shadow"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-[13px] font-medium text-[#171717] dark:text-[#EDEDED] mb-2"
                                >
                                    Confirm
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    className="w-full h-11 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A] transition-shadow"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 border border-[#FECACA] dark:border-[#7F1D1D]">
                                <p className="text-[13px] text-[#DC2626] dark:text-[#FCA5A5]">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#333] dark:hover:bg-[#EAEAEA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-[14px] text-[#666] dark:text-[#888]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#0070F3] hover:underline font-medium">
                            Log in
                        </Link>
                    </p>

                    <p className="mt-8 text-[12px] text-[#999]">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="hover:text-[#666] underline underline-offset-2">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="hover:text-[#666] underline underline-offset-2">Privacy Policy</Link>
                    </p>
                </div>

                {/* Right side - Features */}
                <div ref={featuresRef} className="hidden lg:block w-1/2 opacity-0">
                    <div className="sticky top-32">
                        <div className="p-8 rounded-2xl border border-[#EAEAEA] dark:border-[#333] bg-gradient-to-br from-[#FAFAFA] to-white dark:from-[#111] dark:to-[#0A0A0A]">
                            <h2 className="text-[20px] font-semibold tracking-[-0.02em] mb-6">
                                Why choose DIETEC?
                            </h2>
                            <div className="space-y-4">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#171717] dark:bg-white flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-white dark:text-[#171717]" />
                                        </div>
                                        <span className="text-[15px] text-[#666] dark:text-[#888]">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-[#EAEAEA] dark:border-[#333]">
                                <p className="text-[13px] text-[#999] mb-3">Trusted by healthcare professionals</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0070F3] to-[#00DFD8] border-2 border-white dark:border-[#0A0A0A]"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[13px] text-[#666] dark:text-[#888]">1,000+ active users</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
