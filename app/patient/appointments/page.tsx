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
    MoreVertical,
    CheckCircle,
    XCircle,
    AlertCircle,
    Plus,
    Filter
} from 'lucide-react'

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'

interface Appointment {
    id: string
    doctor: string
    specialty: string
    date: string
    time: string
    type: string
    status: AppointmentStatus
}

const mockAppointments: Appointment[] = [
    { id: '1', doctor: 'Dr. Sarah Johnson', specialty: 'General Physician', date: '2024-02-05', time: '10:00 AM', type: 'Consultation', status: 'upcoming' },
    { id: '2', doctor: 'Dr. Michael Chen', specialty: 'Cardiologist', date: '2024-02-08', time: '2:30 PM', type: 'Follow-up', status: 'upcoming' },
    { id: '3', doctor: 'Dr. Emily Williams', specialty: 'Dermatologist', date: '2024-01-28', time: '11:00 AM', type: 'Check-up', status: 'completed' },
    { id: '4', doctor: 'Dr. James Brown', specialty: 'Pediatrician', date: '2024-01-20', time: '9:00 AM', type: 'Consultation', status: 'cancelled' },
]

const statusConfig = {
    upcoming: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', label: 'Upcoming' },
    completed: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Cancelled' },
}

export default function AppointmentsListPage() {
    const [filter, setFilter] = useState<string>('all')
    const [appointments] = useState<Appointment[]>(mockAppointments)

    const filteredAppointments = appointments.filter(a => filter === 'all' || a.status === filter)

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
                <div className="h-full max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/patient"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Appointments</h1>
                            <p className="text-[12px] text-[#666] dark:text-[#888]">{appointments.length} total</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/patient/appointments/new">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-9 px-4 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[13px] font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Book New
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
                >
                    <Filter className="w-4 h-4 text-[#999] flex-shrink-0" />
                    {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
                        <motion.button
                            key={f}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${filter === f
                                    ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                                    : 'bg-[#F5F5F5] dark:bg-[#222] text-[#666] dark:text-[#888] hover:bg-[#EAEAEA] dark:hover:bg-[#333]'
                                }`}
                        >
                            {f === 'all' ? 'All' : statusConfig[f as AppointmentStatus]?.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Appointments List */}
                <div className="space-y-4">
                    {filteredAppointments.map((apt, i) => {
                        const config = statusConfig[apt.status]
                        return (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -2 }}
                                className="p-5 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] hover:border-[#CCC] dark:hover:border-[#555] transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[14px] font-medium"
                                        >
                                            {apt.doctor.split(' ').slice(1).map(n => n[0]).join('')}
                                        </motion.div>
                                        <div>
                                            <p className="text-[15px] font-medium text-[#171717] dark:text-white mb-1">{apt.doctor}</p>
                                            <p className="text-[13px] text-[#666] dark:text-[#888] mb-2">{apt.specialty}</p>
                                            <div className="flex items-center gap-4 text-[13px] text-[#999]">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {apt.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${config.bg} ${config.color}`}>
                                            {config.label}
                                        </span>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#999] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {apt.status === 'upcoming' && (
                                    <div className="mt-4 pt-4 border-t border-[#EAEAEA] dark:border-[#333] flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-8 px-4 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[13px] font-medium"
                                        >
                                            Join Video Call
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-8 px-4 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555]"
                                        >
                                            Reschedule
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-8 px-4 rounded-lg border border-red-200 dark:border-red-500/30 text-[13px] text-red-500"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredAppointments.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <Calendar className="w-12 h-12 text-[#CCC] mx-auto mb-4" />
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-4">No appointments found</p>
                        <Link href="/patient/appointments/new">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-10 px-6 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Book Appointment
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
