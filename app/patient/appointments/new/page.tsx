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
    ChevronRight,
    Check,
    Stethoscope
} from 'lucide-react'

const doctors = [
    { id: 1, name: 'Dr. Ananya Sharma', specialty: 'General Physician', available: true, nextSlot: '10:00 AM' },
    { id: 2, name: 'Dr. Arjun Mehta', specialty: 'Cardiologist', available: true, nextSlot: '11:30 AM' },
    { id: 3, name: 'Dr. Kavya Iyer', specialty: 'Dermatologist', available: false, nextSlot: 'Tomorrow' },
    { id: 4, name: 'Dr. Rohan Desai', specialty: 'Pediatrician', available: true, nextSlot: '2:00 PM' },
]

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

const appointmentTypes = [
    { id: 'consultation', label: 'Consultation', desc: 'General health consultation' },
    { id: 'followup', label: 'Follow-up', desc: 'Follow-up on previous visit' },
    { id: 'checkup', label: 'Check-up', desc: 'Routine health check-up' },
]

export default function BookAppointmentPage() {
    const [step, setStep] = useState(1)
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            full: date.toISOString().split('T')[0],
            isToday: i === 0
        }
    })

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
            <div
                className="fixed inset-0 -z-10 dark:block hidden"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff06 1px, transparent 1px), linear-gradient(to bottom, #ffffff06 1px, transparent 1px)`,
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
                            <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Book Appointment</h1>
                            <p className="text-[13px] text-[#666] dark:text-[#888]">Step {step} of 4</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Progress Bar */}
            <div className="border-b border-[#EAEAEA] dark:border-[#333]">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex">
                        {['Doctor', 'Date & Time', 'Type', 'Confirm'].map((label, i) => (
                            <div key={i} className="flex-1 relative">
                                <div className={`h-1 ${i + 1 <= step ? 'bg-[#171717] dark:bg-white' : 'bg-[#EAEAEA] dark:bg-[#333]'} transition-colors`} />
                                <span className={`absolute top-3 left-0 text-[12px] ${i + 1 <= step ? 'text-[#171717] dark:text-white' : 'text-[#999]'}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Step 1: Select Doctor */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                            Select a Doctor
                        </h2>
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                            Choose from our available specialists
                        </p>

                        <div className="space-y-3">
                            {doctors.map((doctor) => (
                                <button
                                    key={doctor.id}
                                    onClick={() => setSelectedDoctor(doctor.id)}
                                    disabled={!doctor.available}
                                    className={`w-full p-5 rounded-xl border text-left transition-all ${selectedDoctor === doctor.id
                                            ? 'border-[#171717] dark:border-white bg-[#FAFAFA] dark:bg-[#111]'
                                            : doctor.available
                                                ? 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                                : 'border-[#EAEAEA] dark:border-[#333] opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[16px] font-medium">
                                                {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-medium text-[#171717] dark:text-white">{doctor.name}</p>
                                                <p className="text-[13px] text-[#666] dark:text-[#888]">{doctor.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {doctor.available ? (
                                                <span className="text-[13px] text-emerald-600 dark:text-emerald-400">
                                                    Next: {doctor.nextSlot}
                                                </span>
                                            ) : (
                                                <span className="text-[13px] text-[#999]">Unavailable</span>
                                            )}
                                            {selectedDoctor === doctor.id && (
                                                <div className="w-6 h-6 rounded-full bg-[#171717] dark:bg-white flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white dark:text-[#171717]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedDoctor}
                                className="h-11 px-6 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium flex items-center gap-2 hover:bg-[#333] dark:hover:bg-[#EAEAEA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Select Date & Time */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                            Select Date & Time
                        </h2>
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                            Choose a convenient slot for your appointment
                        </p>

                        {/* Date Selection */}
                        <div className="mb-8">
                            <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Select Date
                            </h3>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {dates.map((d) => (
                                    <button
                                        key={d.full}
                                        onClick={() => setSelectedDate(d.full)}
                                        className={`flex-shrink-0 w-20 p-3 rounded-xl border text-center transition-all ${selectedDate === d.full
                                                ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                                                : 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                            }`}
                                    >
                                        <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/70 dark:text-[#171717]/70' : 'text-[#999]'}`}>
                                            {d.day}
                                        </p>
                                        <p className={`text-[20px] font-bold ${selectedDate === d.full ? '' : 'text-[#171717] dark:text-white'}`}>
                                            {d.date}
                                        </p>
                                        <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/70 dark:text-[#171717]/70' : 'text-[#999]'}`}>
                                            {d.month}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Selection */}
                        <div className="mb-8">
                            <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Select Time
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-3 rounded-lg border text-[14px] transition-all ${selectedTime === time
                                                ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-medium'
                                                : 'border-[#EAEAEA] dark:border-[#333] text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="h-11 px-6 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555] transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedDate || !selectedTime}
                                className="h-11 px-6 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium flex items-center gap-2 hover:bg-[#333] dark:hover:bg-[#EAEAEA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Select Type */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                            Appointment Type
                        </h2>
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                            What kind of appointment would you like?
                        </p>

                        <div className="space-y-3 mb-8">
                            {appointmentTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`w-full p-5 rounded-xl border text-left transition-all ${selectedType === type.id
                                            ? 'border-[#171717] dark:border-white bg-[#FAFAFA] dark:bg-[#111]'
                                            : 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedType === type.id
                                                    ? 'bg-[#171717] dark:bg-white'
                                                    : 'bg-[#F5F5F5] dark:bg-[#222]'
                                                }`}>
                                                <Stethoscope className={`w-5 h-5 ${selectedType === type.id
                                                        ? 'text-white dark:text-[#171717]'
                                                        : 'text-[#666] dark:text-[#888]'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-medium text-[#171717] dark:text-white">{type.label}</p>
                                                <p className="text-[13px] text-[#666] dark:text-[#888]">{type.desc}</p>
                                            </div>
                                        </div>
                                        {selectedType === type.id && (
                                            <div className="w-6 h-6 rounded-full bg-[#171717] dark:bg-white flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white dark:text-[#171717]" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="h-11 px-6 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555] transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                disabled={!selectedType}
                                className="h-11 px-6 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium flex items-center gap-2 hover:bg-[#333] dark:hover:bg-[#EAEAEA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                            Confirm Appointment
                        </h2>
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                            Review your appointment details
                        </p>

                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333]">
                                    <span className="text-[14px] text-[#666] dark:text-[#888]">Doctor</span>
                                    <span className="text-[14px] font-medium text-[#171717] dark:text-white">
                                        {doctors.find(d => d.id === selectedDoctor)?.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333]">
                                    <span className="text-[14px] text-[#666] dark:text-[#888]">Specialty</span>
                                    <span className="text-[14px] font-medium text-[#171717] dark:text-white">
                                        {doctors.find(d => d.id === selectedDoctor)?.specialty}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333]">
                                    <span className="text-[14px] text-[#666] dark:text-[#888]">Date</span>
                                    <span className="text-[14px] font-medium text-[#171717] dark:text-white">
                                        {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333]">
                                    <span className="text-[14px] text-[#666] dark:text-[#888]">Time</span>
                                    <span className="text-[14px] font-medium text-[#171717] dark:text-white">{selectedTime}</span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-[14px] text-[#666] dark:text-[#888]">Type</span>
                                    <span className="text-[14px] font-medium text-[#171717] dark:text-white">
                                        {appointmentTypes.find(t => t.id === selectedType)?.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(3)}
                                className="h-11 px-6 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555] transition-colors"
                            >
                                Back
                            </button>
                            <button
                                className="h-11 px-6 rounded-lg bg-emerald-600 text-white text-[14px] font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                Confirm Booking
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
