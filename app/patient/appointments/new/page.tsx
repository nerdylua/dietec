'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    Calendar,
    Clock,
    ChevronRight,
    Check,
    Stethoscope,
    CheckCircle,
    Video,
    MapPin,
    Bell
} from 'lucide-react'

const doctors = [
    { id: 1, name: 'Dr. Ananya Sharma', specialty: 'General Physician', available: true, nextSlot: '10:00 AM', fee: 500, rating: 4.8 },
    { id: 2, name: 'Dr. Arjun Mehta', specialty: 'Cardiologist', available: true, nextSlot: '11:30 AM', fee: 1200, rating: 4.9 },
    { id: 3, name: 'Dr. Kavya Iyer', specialty: 'Dermatologist', available: false, nextSlot: 'Tomorrow', fee: 800, rating: 4.7 },
    { id: 4, name: 'Dr. Rohan Desai', specialty: 'Pediatrician', available: true, nextSlot: '2:00 PM', fee: 600, rating: 4.6 },
    { id: 5, name: 'Dr. Priya Patel', specialty: 'Orthopedic', available: true, nextSlot: '3:30 PM', fee: 700, rating: 4.5 },
    { id: 6, name: 'Dr. Vikram Singh', specialty: 'ENT Specialist', available: true, nextSlot: '4:00 PM', fee: 450, rating: 4.8 },
]

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

const appointmentTypes = [
    { id: 'consultation', label: 'Video Consultation', desc: 'Connect with doctor via video call', icon: Video },
    { id: 'inperson', label: 'In-Person Visit', desc: 'Visit the clinic/hospital', icon: MapPin },
    { id: 'followup', label: 'Follow-up', desc: 'Follow-up on previous visit', icon: Stethoscope },
]

export default function BookAppointmentPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [bookingProcessing, setBookingProcessing] = useState(false)

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

    const selectedDoctorData = doctors.find(d => d.id === selectedDoctor)
    const selectedTypeData = appointmentTypes.find(t => t.id === selectedType)

    const handleConfirmBooking = () => {
        setBookingProcessing(true)
        setTimeout(() => {
            setBookingProcessing(false)
            setShowSuccess(true)
        }, 1500)
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
                <div className="h-full max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/patient/appointments"
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
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: i + 1 <= step ? 1 : 0 }}
                                    className={`h-1 origin-left ${i + 1 <= step ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-[#EAEAEA] dark:bg-[#333]'}`}
                                />
                                <span className={`absolute top-3 left-0 text-[12px] ${i + 1 <= step ? 'text-[#171717] dark:text-white font-medium' : 'text-[#999]'}`}>
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
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                                Select a Doctor
                            </h2>
                            <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                                Choose from our available specialists
                            </p>

                            <div className="grid gap-3">
                                {doctors.map((doctor, i) => (
                                    <motion.button
                                        key={doctor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedDoctor(doctor.id)}
                                        disabled={!doctor.available}
                                        whileHover={doctor.available ? { scale: 1.01 } : {}}
                                        whileTap={doctor.available ? { scale: 0.99 } : {}}
                                        className={`w-full p-5 rounded-xl border text-left transition-all ${selectedDoctor === doctor.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-lg'
                                            : doctor.available
                                                ? 'border-[#EAEAEA] dark:border-[#333] hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md'
                                                : 'border-[#EAEAEA] dark:border-[#333] opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[18px] font-bold shadow-lg">
                                                    {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-[16px] font-semibold text-[#171717] dark:text-white">{doctor.name}</p>
                                                    <p className="text-[13px] text-[#666] dark:text-[#888]">{doctor.specialty}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[12px] text-yellow-500">★ {doctor.rating}</span>
                                                        <span className="text-[14px] font-bold text-emerald-600">₹{doctor.fee}</span>
                                                    </div>
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
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                                                    >
                                                        <Check className="w-4 h-4 text-white" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(2)}
                                    disabled={!selectedDoctor}
                                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Select Date & Time */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
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
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Select Date
                                </h3>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {dates.map((d, i) => (
                                        <motion.button
                                            key={d.full}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => setSelectedDate(d.full)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex-shrink-0 w-20 p-3 rounded-xl border text-center transition-all ${selectedDate === d.full
                                                ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg'
                                                : 'border-[#EAEAEA] dark:border-[#333] hover:border-blue-300 dark:hover:border-blue-500/50'
                                                }`}
                                        >
                                            <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/80' : 'text-[#999]'}`}>
                                                {d.isToday ? 'Today' : d.day}
                                            </p>
                                            <p className={`text-[20px] font-bold ${selectedDate === d.full ? '' : 'text-[#171717] dark:text-white'}`}>
                                                {d.date}
                                            </p>
                                            <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/80' : 'text-[#999]'}`}>
                                                {d.month}
                                            </p>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="mb-8">
                                <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    Select Time
                                </h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {timeSlots.map((time, i) => (
                                        <motion.button
                                            key={time}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            onClick={() => setSelectedTime(time)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-3 rounded-xl border text-[14px] transition-all ${selectedTime === time
                                                ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-medium shadow-lg'
                                                : 'border-[#EAEAEA] dark:border-[#333] text-[#666] dark:text-[#888] hover:border-blue-300 dark:hover:border-blue-500/50'
                                                }`}
                                        >
                                            {time}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(1)}
                                    className="h-11 px-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555] transition-colors"
                                >
                                    Back
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(3)}
                                    disabled={!selectedDate || !selectedTime}
                                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Select Type */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                                Appointment Type
                            </h2>
                            <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                                How would you like to meet the doctor?
                            </p>

                            <div className="space-y-3 mb-8">
                                {appointmentTypes.map((type, i) => (
                                    <motion.button
                                        key={type.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setSelectedType(type.id)}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`w-full p-5 rounded-xl border text-left transition-all ${selectedType === type.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-lg'
                                            : 'border-[#EAEAEA] dark:border-[#333] hover:border-blue-300 dark:hover:border-blue-500/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedType === type.id
                                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg'
                                                    : 'bg-[#F5F5F5] dark:bg-[#222]'
                                                    }`}>
                                                    <type.icon className={`w-6 h-6 ${selectedType === type.id
                                                        ? 'text-white'
                                                        : 'text-[#666] dark:text-[#888]'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <p className="text-[16px] font-semibold text-[#171717] dark:text-white">{type.label}</p>
                                                    <p className="text-[13px] text-[#666] dark:text-[#888]">{type.desc}</p>
                                                </div>
                                            </div>
                                            {selectedType === type.id && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                                                >
                                                    <Check className="w-4 h-4 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(2)}
                                    className="h-11 px-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555] transition-colors"
                                >
                                    Back
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(4)}
                                    disabled={!selectedType}
                                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                                Confirm Appointment
                            </h2>
                            <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                                Review your appointment details
                            </p>

                            <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] overflow-hidden mb-8">
                                {/* Doctor Card */}
                                <div className="p-6 border-b border-[#EAEAEA] dark:border-[#333] bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/5 dark:to-cyan-500/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[20px] font-bold shadow-lg">
                                            {selectedDoctorData?.name.split(' ').slice(1).map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[18px] font-bold text-[#171717] dark:text-white">{selectedDoctorData?.name}</p>
                                            <p className="text-[14px] text-[#666] dark:text-[#888]">{selectedDoctorData?.specialty}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[13px] text-yellow-500">★ {selectedDoctorData?.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333]">
                                        <span className="text-[14px] text-[#666] dark:text-[#888] flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Date
                                        </span>
                                        <span className="text-[14px] font-semibold text-[#171717] dark:text-white">
                                            {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333]">
                                        <span className="text-[14px] text-[#666] dark:text-[#888] flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Time
                                        </span>
                                        <span className="text-[14px] font-semibold text-[#171717] dark:text-white">{selectedTime}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333]">
                                        <span className="text-[14px] text-[#666] dark:text-[#888] flex items-center gap-2">
                                            {selectedTypeData?.icon && <selectedTypeData.icon className="w-4 h-4" />} Type
                                        </span>
                                        <span className="text-[14px] font-semibold text-[#171717] dark:text-white">
                                            {selectedTypeData?.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-[14px] text-[#666] dark:text-[#888]">Consultation Fee</span>
                                        <span className="text-[20px] font-bold text-emerald-600">₹{selectedDoctorData?.fee}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(3)}
                                    className="h-11 px-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555] transition-colors"
                                >
                                    Back
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleConfirmBooking}
                                    className="h-11 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm Booking
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Success Modal */}
            <AnimatePresence>
                {(showSuccess || bookingProcessing) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
                        onClick={showSuccess ? () => router.push('/patient/appointments') : undefined}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
                        >
                            {bookingProcessing ? (
                                /* Processing State */
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Calendar className="w-8 h-8 text-blue-500" />
                                        </motion.div>
                                    </div>
                                    <h3 className="text-[18px] font-semibold text-[#171717] dark:text-white mb-2">Booking Appointment</h3>
                                    <p className="text-[14px] text-[#666] dark:text-[#888]">Please wait...</p>

                                    <div className="mt-6 h-1 bg-[#E5E5E5] dark:bg-[#333] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* Success State */
                                <div className="p-8 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"
                                    >
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </motion.div>
                                    </motion.div>

                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-[20px] font-bold text-[#171717] dark:text-white mb-2"
                                    >
                                        Appointment Booked!
                                    </motion.h3>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-[14px] text-[#666] dark:text-[#888] mb-6"
                                    >
                                        Your appointment has been confirmed
                                    </motion.p>

                                    {/* Appointment Summary */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded-xl p-4 mb-6 text-left"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[12px] font-bold">
                                                {selectedDoctorData?.name.split(' ').slice(1).map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-semibold text-[#171717] dark:text-white">{selectedDoctorData?.name}</p>
                                                <p className="text-[12px] text-[#666] dark:text-[#888]">{selectedDoctorData?.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[12px] text-[#666] dark:text-[#888]">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {selectedTime}
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Reminder Note */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center justify-center gap-2 mb-6 text-[13px] text-blue-600 dark:text-blue-400"
                                    >
                                        <Bell className="w-4 h-4" />
                                        We'll remind you before the appointment
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => router.push('/patient/appointments')}
                                        className="w-full h-12 rounded-xl bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium"
                                    >
                                        View My Appointments
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
