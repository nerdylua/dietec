'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/app/(auth)/actions'
import {
    LogOut,
    Home,
    Calendar,
    Pill,
    FlaskConical,
    FileText,
    MessageSquare,
    Activity,
    ChevronRight,
    Plus,
    Bell,
    Search,
    Sparkles,
    Heart,
    Mic,
    Receipt,
    Settings
} from 'lucide-react'
import { AnimatedCard, GlowingGradient } from '@/components/motion'

const navItems = [
    { icon: Home, label: 'Overview', href: '/patient', active: true },
    { icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
    { icon: FlaskConical, label: 'Lab Tests', href: '/patient/tests' },
    { icon: Pill, label: 'Medicines', href: '/patient/medicines' },
    { icon: FileText, label: 'Records', href: '/patient/records' },
    { icon: MessageSquare, label: 'AI Chat', href: '/patient/chat' },
    { icon: Mic, label: 'Voice', href: '/patient/voice' },
    { icon: Receipt, label: 'Billing', href: '/patient/billing' },
]

const quickActions = [
    { icon: Calendar, label: 'Book Appointment', desc: 'Schedule with a doctor', href: '/patient/appointments/new', gradient: 'from-blue-500 to-cyan-400' },
    { icon: FlaskConical, label: 'Book Lab Test', desc: 'Get tested at home', href: '/patient/tests/new', gradient: 'from-violet-500 to-purple-400' },
    { icon: MessageSquare, label: 'Ask AI Advisor', desc: 'Get instant health advice', href: '/patient/chat', gradient: 'from-emerald-500 to-teal-400' },
    { icon: Pill, label: 'Order Medicines', desc: 'Refill prescriptions', href: '/patient/medicines', gradient: 'from-amber-500 to-orange-400' },
]

const stats = [
    { label: 'Appointments', value: '2', desc: 'Upcoming this week', icon: Calendar, iconColor: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10', borderColor: 'hover:border-blue-300 dark:hover:border-blue-500/50', href: '/patient/appointments' },
    { label: 'Prescriptions', value: '5', desc: 'Active medicines', icon: Pill, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', borderColor: 'hover:border-emerald-300 dark:hover:border-emerald-500/50', href: '/patient/medicines' },
    { label: 'Lab Tests', value: '1', desc: 'Pending results', icon: FlaskConical, iconColor: 'text-violet-500', bgColor: 'bg-violet-50 dark:bg-violet-500/10', borderColor: 'hover:border-violet-300 dark:hover:border-violet-500/50', href: '/patient/tests' },
    { label: 'Health Score', value: '78', desc: 'Good condition', icon: Activity, iconColor: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10', borderColor: 'hover:border-amber-300 dark:hover:border-amber-500/50', href: '/patient/records' },
]

interface PatientDashboardClientProps {
    user: { full_name?: string | null; email?: string | null }
}

export function PatientDashboardClient({ user }: PatientDashboardClientProps) {
    const firstName = user.full_name?.split(' ')[0] || 'there'
    const containerRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const actionsRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const ctx = gsap.context(() => {
            // Stagger reveal for stats
            if (statsRef.current) {
                gsap.fromTo(
                    statsRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power2.out',
                        delay: 0.2
                    }
                )
            }

            // Stagger reveal for quick actions
            if (actionsRef.current) {
                gsap.fromTo(
                    actionsRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: 'power2.out',
                        delay: 0.5
                    }
                )
            }
        }, containerRef)

        return () => ctx.revert()
    }, [])

    const handleLogout = async () => {
        await logout()
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-white dark:bg-[#0A0A0A]">
            {/* Animated background gradients */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <GlowingGradient
                    className="w-[600px] h-[600px] -top-48 -right-48"
                    colors={['#3B82F6', '#8B5CF6', '#EC4899']}
                />
                <GlowingGradient
                    className="w-[500px] h-[500px] -bottom-32 -left-32"
                    colors={['#10B981', '#06B6D4', '#3B82F6']}
                />
            </div>

            {/* Grid background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Navbar */}
            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/patient" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg
                                    height="20"
                                    viewBox="0 0 76 65"
                                    fill="currentColor"
                                    className="text-[#171717] dark:text-white"
                                >
                                    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                                </svg>
                            </motion.div>
                            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">DIETEC</span>
                        </Link>

                        <nav className="hidden lg:flex items-center">
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 text-[14px] transition-colors ${item.active
                                            ? 'text-[#171717] dark:text-white font-medium'
                                            : 'text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors relative"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </motion.button>

                        <ThemeToggle />

                        <div className="h-6 w-px bg-[#EAEAEA] dark:bg-[#333] mx-1" />

                        <span className="text-[14px] text-[#666] dark:text-[#888] hidden sm:inline">
                            {user.full_name || user.email}
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLogout}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Welcome */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                        Welcome back, {firstName}
                        <motion.span
                            className="inline-block ml-2"
                            animate={{ rotate: [0, 20, 0] }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            👋
                        </motion.span>
                    </h1>
                    <p className="text-[15px] text-[#666] dark:text-[#888]">
                        Here&apos;s an overview of your health status and quick actions.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat, i) => (
                        <Link key={i} href={stat.href}>
                            <motion.div
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className={`p-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#111]/80 backdrop-blur-sm ${stat.borderColor} transition-all cursor-pointer`}
                                style={{ opacity: mounted ? 1 : 0 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                                    >
                                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </motion.div>
                                </div>
                                <p className="text-[32px] font-bold tracking-[-0.02em] text-[#171717] dark:text-white mb-1">{stat.value}</p>
                                <p className="text-[14px] text-[#666] dark:text-[#888]">{stat.label}</p>
                                <p className="text-[12px] text-[#999] mt-1">{stat.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-10"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">Quick Actions</h2>
                    </div>
                    <div ref={actionsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -6, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                style={{ opacity: mounted ? 1 : 0 }}
                            >
                                <Link
                                    href={action.href}
                                    className="group block p-5 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#111]/80 backdrop-blur-sm hover:border-[#171717] dark:hover:border-white transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all`}>
                                        <action.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-[15px] font-medium text-[#171717] dark:text-white mb-1">{action.label}</p>
                                    <p className="text-[13px] text-[#666] dark:text-[#888] flex items-center gap-1">
                                        {action.desc}
                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Card */}
                <AnimatedCard delay={0.8}>
                    <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#333] bg-gradient-to-r from-violet-50 via-white to-blue-50 dark:from-violet-500/5 dark:via-[#111] dark:to-blue-500/5 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-5 h-5 text-red-500" />
                                <span className="text-[12px] font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide">Health Profile</span>
                            </div>
                            <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white mb-2">
                                Complete your health profile
                            </h3>
                            <p className="text-[15px] text-[#666] dark:text-[#888] max-w-xl">
                                Add your medical history, allergies, and current medications to get personalized AI-powered health insights.
                            </p>
                        </div>
                        <Link href="/patient/settings">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative z-10 h-12 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0"
                            >
                                <Sparkles className="w-4 h-4" />
                                Complete Profile
                            </motion.button>
                        </Link>
                    </div>
                </AnimatedCard>
            </main>
        </div>
    )
}
