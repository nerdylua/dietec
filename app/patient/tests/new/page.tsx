'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArrowLeft, FlaskConical, ChevronRight, Check, MapPin, Home, Building2, Clock, Calendar, CheckCircle, CreditCard, Bell } from 'lucide-react'

const labTests = [
    { id: 1, name: 'Complete Blood Count (CBC)', price: 299, popular: true, desc: 'RBC, WBC, Platelets' },
    { id: 2, name: 'Lipid Profile', price: 399, popular: true, desc: 'Cholesterol, Triglycerides' },
    { id: 3, name: 'Thyroid Profile (T3, T4, TSH)', price: 599, popular: true, desc: 'Complete thyroid panel' },
    { id: 4, name: 'Liver Function Test (LFT)', price: 449, popular: false, desc: 'SGPT, SGOT, Bilirubin' },
    { id: 5, name: 'Kidney Function Test (KFT)', price: 549, popular: false, desc: 'Creatinine, Urea, Uric Acid' },
    { id: 6, name: 'HbA1c (Diabetes)', price: 349, popular: true, desc: '3-month avg blood sugar' },
    { id: 7, name: 'Vitamin D', price: 699, popular: false, desc: '25-OH Vitamin D' },
    { id: 8, name: 'Vitamin B12', price: 599, popular: false, desc: 'Cobalamin levels' },
    { id: 9, name: 'Iron Studies', price: 499, popular: false, desc: 'Ferritin, TIBC, Iron' },
    { id: 10, name: 'Complete Urine Analysis', price: 199, popular: false, desc: 'Routine + Microscopy' },
]

const collectionTypes = [
    { id: 'home', label: 'Home Collection', desc: 'Sample collected at doorstep', icon: Home, extra: '+ ₹50', color: 'from-emerald-500 to-teal-500' },
    { id: 'lab', label: 'Visit Lab', desc: 'Walk-in to nearest center', icon: Building2, extra: 'Free', color: 'from-violet-500 to-purple-500' },
]

const timeSlots = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM']

export default function BookLabTestPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedTests, setSelectedTests] = useState<number[]>([])
    const [collectionType, setCollectionType] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [address, setAddress] = useState('')
    const [showPayment, setShowPayment] = useState(false)
    const [paymentProcessing, setPaymentProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(); date.setDate(date.getDate() + i)
        return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), date: date.getDate(), month: date.toLocaleDateString('en-US', { month: 'short' }), full: date.toISOString().split('T')[0], isToday: i === 0 }
    })

    const toggleTest = (id: number) => setSelectedTests(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
    const totalPrice = selectedTests.reduce((sum, id) => sum + (labTests.find(t => t.id === id)?.price || 0), 0) + (collectionType === 'home' ? 50 : 0)

    const handleConfirmPay = () => {
        setShowPayment(true); setPaymentProcessing(true)
        setTimeout(() => { setPaymentProcessing(false); setPaymentSuccess(true) }, 2000)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
            <div className="fixed inset-0 -z-10" style={{ backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="h-full max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/patient/tests" className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
                        <div><h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Book Lab Test</h1><p className="text-[13px] text-[#666] dark:text-[#888]">Step {step} of 3</p></div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="border-b border-[#EAEAEA] dark:border-[#333]"><div className="max-w-4xl mx-auto px-6"><div className="flex">
                {['Tests', 'Collection', 'Confirm'].map((label, i) => (
                    <div key={i} className="flex-1 relative">
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: i + 1 <= step ? 1 : 0 }} className={`h-1 origin-left ${i + 1 <= step ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-[#EAEAEA] dark:bg-[#333]'}`} />
                        <span className={`absolute top-3 left-0 text-[12px] ${i + 1 <= step ? 'text-[#171717] dark:text-white font-medium' : 'text-[#999]'}`}>{label}</span>
                    </div>
                ))}
            </div></div></div>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">Select Lab Tests</h2>
                            <p className="text-[15px] text-[#666] dark:text-[#888] mb-6">Choose from our comprehensive test menu</p>
                            <div className="mb-6"><h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-3 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-violet-500" />Popular Tests</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {labTests.filter(t => t.popular).map((test, i) => (
                                        <motion.button key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => toggleTest(test.id)} whileHover={{ scale: 1.01 }} className={`p-4 rounded-xl border text-left transition-all ${selectedTests.includes(test.id) ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-lg' : 'border-[#EAEAEA] dark:border-[#333] hover:border-violet-300 dark:hover:border-violet-500/50'}`}>
                                            <div className="flex items-center justify-between">
                                                <div><p className="text-[14px] font-semibold text-[#171717] dark:text-white">{test.name}</p><p className="text-[12px] text-[#999] mt-0.5">{test.desc}</p><p className="text-[15px] text-emerald-600 font-bold mt-1">₹{test.price}</p></div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedTests.includes(test.id) ? 'border-violet-500 bg-violet-500' : 'border-[#CCC]'}`}>{selectedTests.includes(test.id) && <Check className="w-4 h-4 text-white" />}</div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-8"><h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-3">All Tests</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {labTests.filter(t => !t.popular).map((test, i) => (
                                        <motion.button key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => toggleTest(test.id)} whileHover={{ scale: 1.01 }} className={`p-4 rounded-xl border text-left transition-all ${selectedTests.includes(test.id) ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10' : 'border-[#EAEAEA] dark:border-[#333] hover:border-violet-300'}`}>
                                            <div className="flex items-center justify-between">
                                                <div><p className="text-[14px] font-medium text-[#171717] dark:text-white">{test.name}</p><p className="text-[12px] text-[#999]">{test.desc}</p><p className="text-[14px] text-emerald-600 font-bold mt-1">₹{test.price}</p></div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedTests.includes(test.id) ? 'border-violet-500 bg-violet-500' : 'border-[#CCC]'}`}>{selectedTests.includes(test.id) && <Check className="w-4 h-4 text-white" />}</div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            {selectedTests.length > 0 && (
                                <div className="fixed bottom-0 left-0 right-0 border-t border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#0A0A0A] p-4">
                                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                                        <div><p className="text-[14px] text-[#666]">{selectedTests.length} tests selected</p><p className="text-[20px] font-bold text-[#171717] dark:text-white">₹{totalPrice}</p></div>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(2)} className="h-11 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg">Continue<ChevronRight className="w-4 h-4" /></motion.button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">Collection Details</h2>
                            <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">Choose how you&apos;d like to get tested</p>
                            <div className="mb-8"><h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-violet-500" />Collection Type</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {collectionTypes.map((type, i) => (
                                        <motion.button key={type.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setCollectionType(type.id)} whileHover={{ scale: 1.01 }} className={`p-5 rounded-xl border text-left transition-all ${collectionType === type.id ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-lg' : 'border-[#EAEAEA] dark:border-[#333] hover:border-violet-300'}`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${collectionType === type.id ? `bg-gradient-to-br ${type.color} shadow-lg` : 'bg-[#F5F5F5] dark:bg-[#222]'}`}><type.icon className={`w-6 h-6 ${collectionType === type.id ? 'text-white' : 'text-[#666]'}`} /></div>
                                                    <div><p className="text-[15px] font-semibold text-[#171717] dark:text-white">{type.label}</p><p className="text-[13px] text-[#666]">{type.desc}</p></div>
                                                </div>
                                                <span className={`text-[13px] font-medium ${type.id === 'home' ? 'text-amber-600' : 'text-emerald-600'}`}>{type.extra}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            {collectionType === 'home' && <div className="mb-8"><label className="block text-[14px] font-medium text-[#171717] dark:text-white mb-2">Collection Address</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your complete address..." rows={3} className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" /></div>}
                            <div className="mb-8"><h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-500" />Preferred Date</h3>
                                <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                                    {dates.map((d, i) => (
                                        <motion.button key={d.full} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedDate(d.full)} whileHover={{ scale: 1.05 }} className={`flex-shrink-0 w-20 p-3 rounded-xl border text-center transition-all ${selectedDate === d.full ? 'border-violet-500 bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg' : 'border-[#EAEAEA] dark:border-[#333] hover:border-violet-300'}`}>
                                            <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/80' : 'text-[#999]'}`}>{d.isToday ? 'Today' : d.day}</p>
                                            <p className={`text-[20px] font-bold ${selectedDate === d.full ? '' : 'text-[#171717] dark:text-white'}`}>{d.date}</p>
                                            <p className={`text-[12px] ${selectedDate === d.full ? 'text-white/80' : 'text-[#999]'}`}>{d.month}</p>
                                        </motion.button>
                                    ))}
                                </div>
                                <h3 className="text-[14px] font-medium text-[#171717] dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-violet-500" />Preferred Time</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {timeSlots.map((time, i) => (
                                        <motion.button key={time} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} onClick={() => setSelectedTime(time)} whileHover={{ scale: 1.05 }} className={`p-3 rounded-xl border text-[14px] transition-all ${selectedTime === time ? 'border-violet-500 bg-gradient-to-br from-violet-500 to-purple-500 text-white font-medium shadow-lg' : 'border-[#EAEAEA] dark:border-[#333] text-[#666] hover:border-violet-300'}`}>{time}</motion.button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(1)} className="h-11 px-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666]">Back</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(3)} disabled={!collectionType || !selectedDate || !selectedTime || (collectionType === 'home' && !address)} className="h-11 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg disabled:opacity-50">Continue<ChevronRight className="w-4 h-4" /></motion.button>
                            </div>
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">Confirm Booking</h2>
                            <p className="text-[15px] text-[#666] dark:text-[#888] mb-8">Review your test booking</p>
                            <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] overflow-hidden mb-6">
                                <div className="p-6 border-b border-[#EAEAEA] dark:border-[#333] bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-500/5 dark:to-purple-500/5">
                                    <h3 className="text-[14px] font-semibold text-[#171717] dark:text-white mb-4 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-violet-500" />Selected Tests ({selectedTests.length})</h3>
                                    <div className="space-y-2">{selectedTests.map(id => { const test = labTests.find(t => t.id === id); return test ? <div key={id} className="flex items-center justify-between"><span className="text-[14px] text-[#666]">{test.name}</span><span className="text-[14px] font-semibold text-[#171717] dark:text-white">₹{test.price}</span></div> : null })}</div>
                                </div>
                                <div className="p-6 border-b border-[#EAEAEA] dark:border-[#333] space-y-3">
                                    <div className="flex items-center justify-between"><span className="text-[14px] text-[#666] flex items-center gap-2">{collectionType === 'home' ? <Home className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}Collection</span><span className="text-[14px] font-semibold text-[#171717] dark:text-white">{collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-[14px] text-[#666] flex items-center gap-2"><Calendar className="w-4 h-4" />Date</span><span className="text-[14px] font-semibold text-[#171717] dark:text-white">{selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-[14px] text-[#666] flex items-center gap-2"><Clock className="w-4 h-4" />Time</span><span className="text-[14px] font-semibold text-[#171717] dark:text-white">{selectedTime}</span></div>
                                    {collectionType === 'home' && <div className="flex items-center justify-between"><span className="text-[14px] text-[#666]">Home Collection Fee</span><span className="text-[14px] font-semibold text-amber-600">+ ₹50</span></div>}
                                </div>
                                <div className="p-6"><div className="flex items-center justify-between"><span className="text-[16px] font-medium text-[#171717] dark:text-white">Total Amount</span><span className="text-[24px] font-bold text-emerald-600">₹{totalPrice}</span></div></div>
                            </div>
                            <div className="flex justify-between">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(2)} className="h-11 px-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] text-[14px] font-medium text-[#666]">Back</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleConfirmPay} className="h-11 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[14px] font-medium flex items-center gap-2 shadow-lg"><CreditCard className="w-4 h-4" />Pay ₹{totalPrice}</motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {(showPayment || paymentProcessing) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={paymentSuccess ? () => router.push('/patient/tests') : undefined}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                            {paymentProcessing ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><CreditCard className="w-8 h-8 text-violet-500" /></motion.div></div>
                                    <h3 className="text-[18px] font-semibold text-[#171717] dark:text-white mb-2">Processing Payment</h3>
                                    <p className="text-[14px] text-[#666]">Please wait...</p>
                                    <div className="mt-6 h-1 bg-[#E5E5E5] dark:bg-[#333] rounded-full overflow-hidden"><motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1, repeat: Infinity }} className="h-full w-1/2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" /></div>
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 200 }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"><motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}><CheckCircle className="w-10 h-10 text-white" /></motion.div></motion.div>
                                    <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[20px] font-bold text-[#171717] dark:text-white mb-2">Payment Successful!</motion.h3>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-[14px] text-[#666] mb-6">Your lab test has been booked</motion.p>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded-xl p-4 mb-6 text-left">
                                        <div className="flex items-center justify-between mb-2"><span className="text-[13px] text-[#666]">Booking ID</span><span className="text-[13px] font-mono text-[#171717] dark:text-white">LT{Date.now().toString().slice(-8)}</span></div>
                                        <div className="flex items-center justify-between mb-2"><span className="text-[13px] text-[#666]">Tests</span><span className="text-[13px] font-semibold text-[#171717] dark:text-white">{selectedTests.length} tests</span></div>
                                        <div className="flex items-center justify-between"><span className="text-[13px] text-[#666]">Amount Paid</span><span className="text-[15px] font-bold text-emerald-600">₹{totalPrice}</span></div>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-center gap-2 mb-6 text-[13px] text-violet-600 dark:text-violet-400"><Bell className="w-4 h-4" />We&apos;ll remind you before collection</motion.div>
                                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push('/patient/tests')} className="w-full h-12 rounded-xl bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium">View My Tests</motion.button>
                                </div>
                            )}
                            <div className="px-8 py-4 bg-[#F5F5F5] dark:bg-[#0A0A0A] flex items-center justify-center gap-2"><span className="text-[12px] text-[#999]">Secured by</span><span className="text-[14px] font-bold text-blue-600">Razorpay</span></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
