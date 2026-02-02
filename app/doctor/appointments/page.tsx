'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Video,
    Phone,
    CheckCircle,
    XCircle,
    MessageSquare,
    FileText,
    ChevronRight
} from 'lucide-react'

interface Appointment {
    id: string
    patient: string
    age: number
    gender: string
    time: string
    type: string
    status: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
    notes?: string
}

const todayAppointments: Appointment[] = [
    { id: '1', patient: 'John Smith', age: 35, gender: 'Male', time: '9:00 AM', type: 'Consultation', status: 'completed', notes: 'Follow-up on blood pressure' },
    { id: '2', patient: 'Sarah Williams', age: 28, gender: 'Female', time: '10:00 AM', type: 'Check-up', status: 'in_progress' },
    { id: '3', patient: 'Michael Brown', age: 45, gender: 'Male', time: '11:00 AM', type: 'Follow-up', status: 'waiting' },
    { id: '4', patient: 'Emily Davis', age: 22, gender: 'Female', time: '2:00 PM', type: 'Consultation', status: 'waiting' },
    { id: '5', patient: 'Robert Johnson', age: 55, gender: 'Male', time: '3:00 PM', type: 'Consultation', status: 'cancelled' },
]

const statusConfig = {
    waiting: { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Waiting' },
    in_progress: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', label: 'In Progress' },
    completed: { color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Completed' },
    cancelled: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Cancelled' },
}

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>(todayAppointments)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const waitingCount = appointments.filter(a => a.status === 'waiting').length
    const completedCount = appointments.filter(a => a.status === 'completed').length

    const startConsultation = (id: string) => {
        setAppointments(prev => prev.map(a =>
            a.id === id ? { ...a, status: 'in_progress' as const } : a
        ))
    }

    const completeConsultation = (id: string) => {
        setAppointments(prev => prev.map(a =>
            a.id === id ? { ...a, status: 'completed' as const } : a
        ))
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
            {/* Grid background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Header */}
            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/doctor"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Today&apos;s Appointments</h1>
                            <p className="text-[12px] text-[#666] dark:text-[#888]">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Total', value: appointments.length, color: 'text-[#171717] dark:text-white' },
                        { label: 'Waiting', value: waitingCount, color: 'text-amber-500' },
                        { label: 'Completed', value: completedCount, color: 'text-emerald-500' },
                        { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, color: 'text-red-500' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4 }}
                            className="p-4 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] text-center"
                        >
                            <p className={`text-[28px] font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-[13px] text-[#666] dark:text-[#888]">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Appointments List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Queue */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-[16px] font-semibold text-[#171717] dark:text-white mb-4">Patient Queue</h2>
                        {appointments.filter(a => ['waiting', 'in_progress'].includes(a.status)).map((apt, i) => {
                            const config = statusConfig[apt.status]
                            return (
                                <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -2 }}
                                    onClick={() => setSelectedId(apt.id)}
                                    className={`p-5 rounded-xl border ${selectedId === apt.id ? 'border-blue-500 dark:border-blue-400' : 'border-[#EAEAEA] dark:border-[#333]'} bg-white dark:bg-[#111] hover:border-[#CCC] dark:hover:border-[#555] transition-all cursor-pointer`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[14px] font-medium"
                                            >
                                                {apt.patient.split(' ').map(n => n[0]).join('')}
                                            </motion.div>
                                            <div>
                                                <p className="text-[15px] font-medium text-[#171717] dark:text-white">{apt.patient}</p>
                                                <p className="text-[13px] text-[#666] dark:text-[#888]">{apt.age} yrs, {apt.gender} • {apt.type}</p>
                                                <div className="flex items-center gap-2 mt-2 text-[13px] text-[#999]">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{apt.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${config.bg} ${config.color}`}>
                                                {config.label}
                                            </span>
                                            {apt.status === 'waiting' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => { e.stopPropagation(); startConsultation(apt.id) }}
                                                    className="h-8 px-4 rounded-lg bg-blue-500 text-white text-[13px] font-medium flex items-center gap-1.5"
                                                >
                                                    <Video className="w-3.5 h-3.5" />
                                                    Start
                                                </motion.button>
                                            )}
                                            {apt.status === 'in_progress' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => { e.stopPropagation(); completeConsultation(apt.id) }}
                                                    className="h-8 px-4 rounded-lg bg-emerald-500 text-white text-[13px] font-medium flex items-center gap-1.5"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Complete
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}

                        {appointments.filter(a => ['waiting', 'in_progress'].includes(a.status)).length === 0 && (
                            <div className="text-center py-12">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                <p className="text-[15px] text-[#666] dark:text-[#888]">All appointments completed!</p>
                            </div>
                        )}
                    </div>

                    {/* Patient Details */}
                    <div className="lg:col-span-1">
                        <h2 className="text-[16px] font-semibold text-[#171717] dark:text-white mb-4">Patient Details</h2>
                        {selectedId ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6"
                            >
                                {(() => {
                                    const apt = appointments.find(a => a.id === selectedId)
                                    if (!apt) return null
                                    return (
                                        <>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[18px] font-medium">
                                                    {apt.patient.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-[17px] font-semibold text-[#171717] dark:text-white">{apt.patient}</p>
                                                    <p className="text-[14px] text-[#666] dark:text-[#888]">{apt.age} years, {apt.gender}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center justify-between py-2 border-b border-[#EAEAEA] dark:border-[#333]">
                                                    <span className="text-[13px] text-[#666] dark:text-[#888]">Appointment Type</span>
                                                    <span className="text-[13px] font-medium text-[#171717] dark:text-white">{apt.type}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-[#EAEAEA] dark:border-[#333]">
                                                    <span className="text-[13px] text-[#666] dark:text-[#888]">Time</span>
                                                    <span className="text-[13px] font-medium text-[#171717] dark:text-white">{apt.time}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-[13px] text-[#666] dark:text-[#888]">Status</span>
                                                    <span className={`text-[13px] font-medium ${statusConfig[apt.status].color}`}>
                                                        {statusConfig[apt.status].label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full h-10 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] flex items-center justify-center gap-2 hover:border-[#CCC] dark:hover:border-[#555]"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    View Medical History
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full h-10 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] flex items-center justify-center gap-2 hover:border-[#CCC] dark:hover:border-[#555]"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    Send Message
                                                </motion.button>
                                            </div>
                                        </>
                                    )
                                })()}
                            </motion.div>
                        ) : (
                            <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6 text-center">
                                <User className="w-10 h-10 text-[#CCC] mx-auto mb-3" />
                                <p className="text-[14px] text-[#666] dark:text-[#888]">Select a patient to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
