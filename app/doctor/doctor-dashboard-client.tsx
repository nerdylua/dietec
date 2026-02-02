'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/app/(auth)/actions'
import {
    LogOut, Home, Calendar, Users, ClipboardList, FileText, Activity,
    Bell, Clock, CheckCircle2, XCircle, X, Play, Pause, Phone, Video,
    ChevronRight, RefreshCw, MessageSquare, Pill, Heart, ArrowUpRight
} from 'lucide-react'

// Only Overview since other pages don't exist
const navItems = [
    { icon: Home, label: 'Overview', href: '/doctor', active: true },
]

// Realistic data for a doctor
const initialAppointments = [
    { id: 1, patient: 'Rajesh Sharma', age: 45, time: '09:00 AM', type: 'General Consultation', status: 'upcoming', mode: 'in-person', symptoms: 'Chest pain, fatigue' },
    { id: 2, patient: 'Priya Mehta', age: 32, time: '09:30 AM', type: 'Follow-up', status: 'upcoming', mode: 'video', symptoms: 'Post-surgery checkup' },
    { id: 3, patient: 'Amit Kumar', age: 58, time: '10:15 AM', type: 'Diabetes Review', status: 'upcoming', mode: 'in-person', symptoms: 'Blood sugar monitoring' },
    { id: 4, patient: 'Sneha Reddy', age: 28, time: '11:00 AM', type: 'Skin Consultation', status: 'upcoming', mode: 'video', symptoms: 'Acne, skin irritation' },
    { id: 5, patient: 'Vikram Singh', age: 62, time: '02:00 PM', type: 'Cardiac Follow-up', status: 'upcoming', mode: 'in-person', symptoms: 'BP monitoring' },
]

const recentPatients = [
    { id: 1, name: 'Neha Gupta', lastVisit: '2 days ago', condition: 'Hypertension', status: 'stable' },
    { id: 2, name: 'Arun Patel', lastVisit: '3 days ago', condition: 'Type 2 Diabetes', status: 'improving' },
    { id: 3, name: 'Kavita Sharma', lastVisit: '1 week ago', condition: 'Thyroid', status: 'stable' },
]

const pendingTasks = [
    { id: 1, type: 'prescription', text: 'Review prescription for Neha Gupta', priority: 'high' },
    { id: 2, type: 'report', text: 'Sign lab report - Arun Patel', priority: 'medium' },
    { id: 3, type: 'followup', text: 'Schedule follow-up for Vikram Singh', priority: 'low' },
]

interface DoctorDashboardClientProps {
    firstName: string
    fullName: string
}

export default function DoctorDashboardClient({ firstName, fullName }: DoctorDashboardClientProps) {
    const [appointments, setAppointments] = useState(initialAppointments)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [activeConsultation, setActiveConsultation] = useState<number | null>(null)
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New appointment', message: 'Sneha Reddy booked for 11:00 AM', read: false, time: '10 min ago' },
        { id: 2, title: 'Lab results ready', message: 'CBC results for Arun Patel', read: false, time: '1 hour ago' },
        { id: 3, title: 'Reminder', message: 'Team meeting at 4:00 PM', read: true, time: '2 hours ago' },
    ])

    const stats = {
        todayAppointments: appointments.length,
        completed: appointments.filter(a => a.status === 'completed').length,
        totalPatients: 47,
        pendingReports: 3
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    const refreshData = async () => {
        setIsRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsRefreshing(false)
    }

    const startConsultation = (id: number) => {
        setActiveConsultation(id)
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'in-progress' } : a))
    }

    const completeConsultation = (id: number) => {
        setActiveConsultation(null)
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a))
    }

    const cancelAppointment = (id: number) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    }

    const markNotificationRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const unreadCount = notifications.filter(n => !n.read).length
    const upcomingAppointments = appointments.filter(a => a.status === 'upcoming')
    const inProgressAppointment = appointments.find(a => a.status === 'in-progress')

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
            <div className="fixed inset-0 -z-10" style={{ backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/doctor" className="flex items-center gap-2">
                            <svg height="20" viewBox="0 0 76 65" fill="currentColor" className="text-[#171717] dark:text-white"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" /></svg>
                            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">DIETEC</span>
                            <span className="ml-2 px-2 py-0.5 text-[11px] font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded">Doctor</span>
                        </Link>
                        <nav className="hidden lg:flex items-center">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#171717] dark:text-white font-medium">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNotifications(!showNotifications)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors relative">
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
                            </motion.button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 w-80 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] shadow-xl overflow-hidden">
                                        <div className="p-4 border-b border-[#EAEAEA] dark:border-[#333] flex items-center justify-between">
                                            <h3 className="text-[14px] font-semibold text-[#171717] dark:text-white">Notifications</h3>
                                            <button onClick={() => setShowNotifications(false)} className="text-[#666]"><X className="w-4 h-4" /></button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-4 border-b border-[#EAEAEA] dark:border-[#333] cursor-pointer hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] ${!n.read ? 'bg-blue-50 dark:bg-blue-500/5' : ''}`}>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className={`text-[13px] ${!n.read ? 'font-semibold text-[#171717] dark:text-white' : 'text-[#666] dark:text-[#888]'}`}>{n.title}</p>
                                                            <p className="text-[12px] text-[#999] mt-0.5">{n.message}</p>
                                                        </div>
                                                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                                                    </div>
                                                    <p className="text-[11px] text-[#999] mt-1">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <ThemeToggle />
                        <div className="h-6 w-px bg-[#EAEAEA] dark:bg-[#333] mx-1" />
                        <form action={logout}>
                            <button type="submit" className="flex items-center gap-2 text-[14px] text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white transition-colors">
                                <span className="hidden sm:inline">Dr. {firstName}</span><LogOut className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-1">{getGreeting()}, Dr. {firstName}</h1>
                        <p className="text-[15px] text-[#666] dark:text-[#888]">You have {upcomingAppointments.length} appointments scheduled for today.</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refreshData} disabled={isRefreshing} className="h-9 px-4 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] flex items-center gap-2 hover:border-[#CCC] disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh
                    </motion.button>
                </div>

                {/* Active Consultation Banner */}
                <AnimatePresence>
                    {inProgressAppointment && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <Activity className="w-6 h-6 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-medium">Active Consultation</p>
                                    <p className="text-[16px] font-bold">{inProgressAppointment.patient} - {inProgressAppointment.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-[13px] font-medium flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />Notes
                                </button>
                                <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-[13px] font-medium flex items-center gap-2">
                                    <Pill className="w-4 h-4" />Prescribe
                                </button>
                                <button onClick={() => completeConsultation(inProgressAppointment.id)} className="px-4 py-2 rounded-lg bg-white text-blue-600 text-[13px] font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />Complete
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'from-blue-500 to-cyan-500' },
                        { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
                        { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'from-violet-500 to-purple-500' },
                        { label: 'Pending Reports', value: stats.pendingReports, icon: FileText, color: 'from-amber-500 to-orange-500' },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -2 }} className="p-5 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}><stat.icon className="w-5 h-5 text-white" /></div>
                            </div>
                            <p className="text-[24px] font-bold text-[#171717] dark:text-white">{stat.value}</p>
                            <p className="text-[12px] text-[#999]">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Schedule */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] overflow-hidden">
                        <div className="p-5 border-b border-[#EAEAEA] dark:border-[#333] flex items-center justify-between">
                            <h2 className="text-[16px] font-semibold text-[#171717] dark:text-white">Today&apos;s Schedule</h2>
                            <span className="text-[13px] text-[#999]">{upcomingAppointments.length} upcoming</span>
                        </div>
                        <div className="divide-y divide-[#EAEAEA] dark:divide-[#333]">
                            {appointments.map((apt) => (
                                <motion.div key={apt.id} layout className={`p-4 transition-colors ${apt.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/5' : apt.status === 'cancelled' ? 'bg-red-50 dark:bg-red-500/5 opacity-60' : apt.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-500/5' : 'hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A]'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-medium ${apt.status === 'completed' ? 'bg-emerald-500' : apt.status === 'cancelled' ? 'bg-red-400' : 'bg-gradient-to-br from-blue-500 to-violet-500'}`}>
                                                {apt.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : apt.status === 'cancelled' ? <XCircle className="w-5 h-5" /> : apt.patient.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[14px] font-medium text-[#171717] dark:text-white">{apt.patient}</p>
                                                    <span className="text-[11px] text-[#999]">{apt.age} yrs</span>
                                                    {apt.mode === 'video' && <Video className="w-3.5 h-3.5 text-blue-500" />}
                                                </div>
                                                <p className="text-[13px] text-[#666] dark:text-[#888]">{apt.type}</p>
                                                <p className="text-[12px] text-[#999]">{apt.symptoms}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-[13px] text-[#666] dark:text-[#888]">
                                                <Clock className="w-4 h-4" />{apt.time}
                                            </div>
                                            {apt.status === 'upcoming' && (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => cancelAppointment(apt.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => startConsultation(apt.id)} className="h-8 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[13px] font-medium flex items-center gap-1.5 hover:shadow-lg transition-shadow">
                                                        <Play className="w-3.5 h-3.5" />Start
                                                    </button>
                                                </div>
                                            )}
                                            {apt.status === 'in-progress' && (
                                                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[12px] font-medium flex items-center gap-1.5">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />In Progress
                                                </span>
                                            )}
                                            {apt.status === 'completed' && <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[12px] font-medium">Completed</span>}
                                            {apt.status === 'cancelled' && <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[12px] font-medium">Cancelled</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Pending Tasks */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-5">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Pending Tasks</h3>
                            <div className="space-y-3">
                                {pendingTasks.map(task => (
                                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] cursor-pointer group">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                                        <div className="flex-1">
                                            <p className="text-[13px] text-[#171717] dark:text-white">{task.text}</p>
                                            <p className="text-[11px] text-[#999] capitalize">{task.priority} priority</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#999] opacity-0 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Patients */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-5">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Recent Patients</h3>
                            <div className="space-y-3">
                                {recentPatients.map(patient => (
                                    <div key={patient.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-[12px] font-medium">
                                            {patient.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] font-medium text-[#171717] dark:text-white">{patient.name}</p>
                                            <p className="text-[12px] text-[#999]">{patient.condition}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${patient.status === 'stable' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600'}`}>{patient.status}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Today's Progress */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-5">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Today&apos;s Progress</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[13px] mb-1.5">
                                        <span className="text-[#666] dark:text-[#888]">Appointments</span>
                                        <span className="font-medium text-[#171717] dark:text-white">{stats.completed}/{stats.todayAppointments}</span>
                                    </div>
                                    <div className="h-2 bg-[#E5E5E5] dark:bg-[#333] rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: stats.todayAppointments > 0 ? `${(stats.completed / stats.todayAppointments) * 100}%` : '0%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-[#EAEAEA] dark:border-[#333]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#666]">Avg. consultation time</span>
                                        <span className="text-[14px] font-semibold text-[#171717] dark:text-white">18 min</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}
