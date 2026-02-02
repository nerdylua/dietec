'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { login, adminLogin } from '../actions'
import { ArrowRight, Loader2, Shield, User } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loginType, setLoginType] = useState<'patient' | 'admin'>('patient')

    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)
        const result = loginType === 'admin' ? await adminLogin(formData) : await login(formData)
        if (result?.error) { setError(result.error); setIsLoading(false) }
    }

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center px-4 pt-16">
            <form ref={formRef} action={handleSubmit} className="w-full max-w-[400px] opacity-0">
                <div className="text-center mb-8">
                    <h1 className="text-[32px] font-bold tracking-[-0.04em] mb-2">Log in to DIETEC</h1>
                    <p className="text-[15px] text-[#666] dark:text-[#888]">Welcome back! Enter your credentials to continue.</p>
                </div>

                {/* Login Type Toggle */}
                <div className="flex gap-2 mb-6 p-1 rounded-xl bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                    <button type="button" onClick={() => { setLoginType('patient'); setError(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-all ${loginType === 'patient' ? 'bg-white dark:bg-[#333] text-[#171717] dark:text-white shadow-sm' : 'text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white'}`}>
                        <User className="w-4 h-4" />Patient
                    </button>
                    <button type="button" onClick={() => { setLoginType('admin'); setError(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-all ${loginType === 'admin' ? 'bg-white dark:bg-[#333] text-[#171717] dark:text-white shadow-sm' : 'text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white'}`}>
                        <Shield className="w-4 h-4" />Admin
                    </button>
                </div>

                {loginType === 'admin' && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
                        <p className="text-[13px] text-amber-700 dark:text-amber-400 flex items-center gap-2"><Shield className="w-4 h-4" />Admin access is restricted to authorized personnel only.</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-[13px] font-medium text-[#171717] dark:text-[#EDEDED] mb-2">Email Address</label>
                        <input id="email" name="email" type="email" placeholder={loginType === 'admin' ? 'admin@dietec.com' : 'you@example.com'} required autoComplete="email" className="w-full h-11 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 transition-shadow" />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="text-[13px] font-medium text-[#171717] dark:text-[#EDEDED]">Password</label>
                            <Link href="/forgot-password" className="text-[13px] text-[#0070F3] hover:underline">Forgot?</Link>
                        </div>
                        <input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" className="w-full h-11 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 transition-shadow" />
                    </div>
                    {error && <div className="p-3 rounded-lg bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 border border-[#FECACA] dark:border-[#7F1D1D]"><p className="text-[13px] text-[#DC2626] dark:text-[#FCA5A5]">{error}</p></div>}
                    <button type="submit" disabled={isLoading} className={`w-full h-11 rounded-lg text-white text-[14px] font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${loginType === 'admin' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : 'bg-[#171717] dark:bg-white dark:text-[#171717] hover:bg-[#333] dark:hover:bg-[#EAEAEA]'}`}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>{loginType === 'admin' ? 'Login as Admin' : 'Continue'}</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                </div>

                {loginType === 'patient' && (
                    <div className="mt-8 pt-6 border-t border-[#EAEAEA] dark:border-[#333]">
                        <p className="text-center text-[14px] text-[#666] dark:text-[#888]">Don&apos;t have an account?{' '}<Link href="/signup" className="text-[#0070F3] hover:underline font-medium">Sign up</Link></p>
                    </div>
                )}

                <p className="mt-6 text-center text-[12px] text-[#999]">By continuing, you agree to our{' '}<Link href="/terms" className="hover:text-[#666] underline underline-offset-2">Terms</Link>{' '}and{' '}<Link href="/privacy" className="hover:text-[#666] underline underline-offset-2">Privacy Policy</Link></p>
            </form>
        </div>
    )
}
