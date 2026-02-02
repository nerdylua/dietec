import { Metadata } from 'next'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'DIETEC Healthcare',
    description: 'Your personal healthcare companion',
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-[#171717] dark:text-[#EDEDED]">
            {/* Subtle grid pattern like Vercel */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />
            <div
                className="fixed inset-0 -z-10 dark:block hidden"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff06 1px, transparent 1px), linear-gradient(to bottom, #ffffff06 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-[#EAEAEA] dark:border-[#333]">
                <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <svg
                            height="22"
                            viewBox="0 0 76 65"
                            fill="currentColor"
                            className="text-[#171717] dark:text-white"
                        >
                            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                        </svg>
                        <span className="text-[15px] font-semibold tracking-[-0.02em]">DIETEC</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="text-[14px] text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="h-9 px-4 rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium flex items-center justify-center hover:bg-[#333] dark:hover:bg-[#EAEAEA] transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            {children}
        </div>
    )
}
