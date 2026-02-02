'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    FlaskConical,
    ChevronRight,
    Check,
    MapPin,
    Home,
    Building2,
    Clock
} from 'lucide-react'

const labTests = [
    { id: 1, name: 'Complete Blood Count (CBC)', price: 299, popular: true },
    { id: 2, name: 'Lipid Profile', price: 399, popular: true },
    { id: 3, name: 'Thyroid Profile (T3, T4, TSH)', price: 599, popular: true },
    { id: 4, name: 'Liver Function Test (LFT)', price: 449, popular: false },
    { id: 5, name: 'Kidney Function Test (KFT)', price: 549, popular: false },
    { id: 6, name: 'HbA1c (Diabetes)', price: 349, popular: true },
    { id: 7, name: 'Vitamin D', price: 699, popular: false },
    { id: 8, name: 'Vitamin B12', price: 599, popular: false },
]

const collectionTypes = [
    { id: 'home', label: 'Home Collection', desc: 'Sample collected at your doorstep', icon: Home, extra: '+ ₹50' },
    { id: 'lab', label: 'Visit Lab', desc: 'Walk-in to nearest center', icon: Building2, extra: 'Free' },
]

const timeSlots = [
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'
]

export default function BookLabTestPage() {
    const [step, setStep] = useState(1)
    const [selectedTests, setSelectedTests] = useState<number[]>([])
    const [collectionType, setCollectionType] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [address, setAddress] = useState('')

    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            full: date.toISOString().split('T')[0],
        }
    })

    const toggleTest = (id: number) => {
        setSelectedTests(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    const totalPrice = selectedTests.reduce((sum, id) => {
        const test = labTests.find(t => t.id === id)
        return sum + (test?.price || 0)
    }, 0) + (collectionType === 'home' ? 50 : 0)

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
                            <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Book Lab Test</h1>
                            <p className="text-[13px] text-[#666] dark:text-[#888]">Step {step} of 3</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Progress Bar */}
            <div className="border-b border-[#EAEAEA] dark:border-[#333]">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex">
                        {['Tests', 'Collection', 'Confirm'].map((label, i) => (
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
                {/* Step 1: Select Tests */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                            Select Lab Tests
                        </h2>
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-6">
                            Choose from our comprehensive test menu
                        </p>

                        {/* Popular Tests */}
                        <div className="mb-6">
                            <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-3 flex items-center gap-2">
                                <FlaskConical className="w-4 h-4" />
                                Popular Tests
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {labTests.filter(t => t.popular).map((test) => (
                                    <button
                                        key={test.id}
                                        onClick={() => toggleTest(test.id)}
                                        className={`p-4 rounded-xl border text-left transition-all ${selectedTests.includes(test.id)
                                                ? 'border-[#171717] dark:border-white bg-[#FAFAFA] dark:bg-[#111]'
                                                : 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[14px] font-medium text-[#171717] dark:text-white">{test.name}</p>
                                                <p className="text-[14px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">₹{test.price}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedTests.includes(test.id)
                                                    ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white'
                                                    : 'border-[#CCC] dark:border-[#555]'
                                                }`}>
                                                {selectedTests.includes(test.id) && (
                                                    <Check className="w-4 h-4 text-white dark:text-[#171717]" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* All Tests */}
                        <div className="mb-8">
                            <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-3">All Tests</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {labTests.filter(t => !t.popular).map((test) => (
                                    <button
                                        key={test.id}
                                        onClick={() => toggleTest(test.id)}
                                        className={`p-4 rounded-xl border text-left transition-all ${selectedTests.includes(test.id)
                                                ? 'border-[#171717] dark:border-white bg-[#FAFAFA] dark:bg-[#111]'
                                                : 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[14px] font-medium text-[#171717] dark:text-white">{test.name}</p>
                                                <p className="text-[14px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">₹{test.price}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedTests.includes(test.id)
                                                    ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white'
                                                    : 'border-[#CCC] dark:border-[#555]'
                                                }`}>
                                                {selectedTests.includes(test.id) && (
                                                    <Check className="w-4 h-4 text-white dark:text-[#171717]" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary Bar */}
                        {selectedTests.length > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 border-t border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] p-4">
                                <div className="max-w-4xl mx-auto flex items-center justify-between">
                                    <div>
                                        <p className="text-[14px] text-[#666] dark:text-[#888]">{selectedTests.length} tests selected</p>
                                        <p className="text-[20px] font-bold text-[#171717] dark:text-white">₹{totalPrice}</p>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="h-11 px-6 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium flex items-center gap-2 hover:bg-[#333] dark:hover:bg-[#EAEAEA] transition-colors"
                                    >
                                        Continue
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 2: Collection Details */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                            Collection Details
                        </h2>
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                            Choose how you&apos;d like to get tested
                        </p>

                        {/* Collection Type */}
                        <div className="mb-8">
                            <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Collection Type
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {collectionTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setCollectionType(type.id)}
                                        className={`p-5 rounded-xl border text-left transition-all ${collectionType === type.id
                                                ? 'border-[#171717] dark:border-white bg-[#FAFAFA] dark:bg-[#111]'
                                                : 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${collectionType === type.id
                                                        ? 'bg-[#171717] dark:bg-white'
                                                        : 'bg-[#F5F5F5] dark:bg-[#222]'
                                                    }`}>
                                                    <type.icon className={`w-5 h-5 ${collectionType === type.id
                                                            ? 'text-white dark:text-[#171717]'
                                                            : 'text-[#666] dark:text-[#888]'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <p className="text-[15px] font-medium text-[#171717] dark:text-white">{type.label}</p>
                                                    <p className="text-[13px] text-[#666] dark:text-[#888]">{type.desc}</p>
                                                </div>
                                            </div>
                                            <span className="text-[13px] text-[#999]">{type.extra}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Address (for home collection) */}
                        {collectionType === 'home' && (
                            <div className="mb-8">
                                <label className="block text-[14px] font-medium text-[#171717] dark:text-white mb-2">
                                    Collection Address
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your complete address..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 transition-shadow resize-none"
                                />
                            </div>
                        )}

                        {/* Date & Time */}
                        <div className="mb-8">
                            <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Preferred Date & Time
                            </h3>

                            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                                {dates.map((d) => (
                                    <button
                                        key={d.full}
                                        onClick={() => setSelectedDate(d.full)}
                                        className={`flex-shrink-0 w-20 p-3 rounded-xl border text-center transition-all ${selectedDate === d.full
                                                ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                                                : 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                            }`}
                                    >
                                        <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/70 dark:text-[#171717]/70' : 'text-[#999]'}`}>{d.day}</p>
                                        <p className={`text-[20px] font-bold ${selectedDate === d.full ? '' : 'text-[#171717] dark:text-white'}`}>{d.date}</p>
                                        <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/70 dark:text-[#171717]/70' : 'text-[#999]'}`}>{d.month}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                                disabled={!collectionType || !selectedDate || !selectedTime || (collectionType === 'home' && !address)}
                                className="h-11 px-6 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium flex items-center gap-2 hover:bg-[#333] dark:hover:bg-[#EAEAEA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                            Confirm Booking
                        </h2>
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">
                            Review your test booking
                        </p>

                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] mb-6">
                            {/* Tests */}
                            <div className="p-6 border-b border-[#EAEAEA] dark:border-[#333]">
                                <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4">Selected Tests</h3>
                                <div className="space-y-3">
                                    {selectedTests.map((id) => {
                                        const test = labTests.find(t => t.id === id)
                                        return test ? (
                                            <div key={id} className="flex items-center justify-between">
                                                <span className="text-[14px] text-[#666] dark:text-[#888]">{test.name}</span>
                                                <span className="text-[14px] font-medium text-[#171717] dark:text-white">₹{test.price}</span>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                            </div>

                            {/* Collection Details */}
                            <div className="p-6 border-b border-[#EAEAEA] dark:border-[#333]">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[14px] text-[#666] dark:text-[#888]">Collection</span>
                                        <span className="text-[14px] font-medium text-[#171717] dark:text-white">
                                            {collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[14px] text-[#666] dark:text-[#888]">Date</span>
                                        <span className="text-[14px] font-medium text-[#171717] dark:text-white">
                                            {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[14px] text-[#666] dark:text-[#888]">Time</span>
                                        <span className="text-[14px] font-medium text-[#171717] dark:text-white">{selectedTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[16px] font-medium text-[#171717] dark:text-white">Total Amount</span>
                                    <span className="text-[24px] font-bold text-[#171717] dark:text-white">₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="h-11 px-6 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666] dark:text-[#888] hover:border-[#CCC] dark:hover:border-[#555] transition-colors"
                            >
                                Back
                            </button>
                            <button
                                className="h-11 px-6 rounded-lg bg-emerald-600 text-white text-[14px] font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                Confirm & Pay ₹{totalPrice}
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
