'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Bell,
    Shield,
    LogOut,
    ChevronRight,
    Camera,
    Check,
    Heart,
    Plus,
    X,
    Pill,
    AlertTriangle,
    Stethoscope,
    Save
} from 'lucide-react'

// Available options for selection
const availableConditions = [
    'Diabetes Type 1', 'Diabetes Type 2', 'Hypertension', 'Asthma', 'COPD',
    'Heart Disease', 'Arthritis', 'Thyroid Disorder', 'Depression', 'Anxiety',
    'Migraine', 'Back Pain', 'High Cholesterol', 'Kidney Disease', 'Liver Disease'
]

const availableAllergies = [
    'Penicillin', 'Aspirin', 'Ibuprofen', 'Sulfa Drugs', 'Latex',
    'Peanuts', 'Tree Nuts', 'Shellfish', 'Eggs', 'Milk',
    'Soy', 'Wheat', 'Dust Mites', 'Pollen', 'Pet Dander'
]

const availableMedications = [
    'Metformin 500mg', 'Lisinopril 10mg', 'Atorvastatin 20mg', 'Amlodipine 5mg',
    'Metoprolol 25mg', 'Omeprazole 20mg', 'Levothyroxine 50mcg', 'Aspirin 81mg',
    'Gabapentin 300mg', 'Sertraline 50mg', 'Losartan 50mg', 'Prednisone 10mg',
    'Albuterol Inhaler', 'Insulin Glargine', 'Vitamin D 1000IU'
]

interface HealthProfile {
    conditions: string[]
    allergies: string[]
    medications: string[]
}

const STORAGE_KEY = 'dietec_health_profile'

function getStoredProfile(): HealthProfile {
    if (typeof window === 'undefined') return { conditions: [], allergies: [], medications: [] }
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            return { conditions: [], allergies: [], medications: [] }
        }
    }
    return { conditions: [], allergies: [], medications: [] }
}

interface SettingsClientProps {
    user: { full_name?: string | null; email?: string | null }
}

export function SettingsClient({ user }: SettingsClientProps) {
    const displayName = user.full_name || 'User'
    const displayEmail = user.email || 'No email'
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
    const [activeTab, setActiveTab] = useState('health')
    const [notifications, setNotifications] = useState({
        appointments: true,
        labResults: true,
        promotions: false,
        reminders: true
    })
    const [healthProfile, setHealthProfile] = useState<HealthProfile>({
        conditions: [],
        allergies: [],
        medications: []
    })
    const [showConditionPicker, setShowConditionPicker] = useState(false)
    const [showAllergyPicker, setShowAllergyPicker] = useState(false)
    const [showMedicationPicker, setShowMedicationPicker] = useState(false)
    const [saved, setSaved] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        setHealthProfile(getStoredProfile())
    }, [])

    // Save to localStorage
    const saveProfile = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(healthProfile))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const toggleItem = (category: keyof HealthProfile, item: string) => {
        setHealthProfile(prev => ({
            ...prev,
            [category]: prev[category].includes(item)
                ? prev[category].filter(i => i !== item)
                : [...prev[category], item]
        }))
    }

    const removeItem = (category: keyof HealthProfile, item: string) => {
        setHealthProfile(prev => ({
            ...prev,
            [category]: prev[category].filter(i => i !== item)
        }))
    }

    const profileCompletion = Math.min(100, Math.round(
        ((healthProfile.conditions.length > 0 ? 33 : 0) +
            (healthProfile.allergies.length > 0 ? 33 : 0) +
            (healthProfile.medications.length > 0 ? 34 : 0))
    ))

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
                        <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Settings</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-[#EAEAEA] dark:border-[#333]"
                >
                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-[32px] font-medium"
                        >
                            {initials}
                        </motion.div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] flex items-center justify-center border-4 border-white dark:border-[#0A0A0A]">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-[22px] font-bold text-[#171717] dark:text-white mb-1">{displayName}</h2>
                        <p className="text-[14px] text-[#666] dark:text-[#888]">{displayEmail}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-2 bg-[#E5E5E5] dark:bg-[#333] rounded-full overflow-hidden w-32">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${profileCompletion}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                />
                            </div>
                            <span className="text-[13px] text-emerald-500">{profileCompletion}% complete</span>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'health', label: 'Health Profile', icon: Heart },
                        { id: 'profile', label: 'Personal Info', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                                : 'text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222]'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </motion.button>
                    ))}
                </div>

                {/* Health Profile Tab */}
                {activeTab === 'health' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Medical Conditions */}
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-[16px] font-semibold text-[#171717] dark:text-white">Medical Conditions</h3>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowConditionPicker(true)}
                                    className="h-8 px-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[13px] font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </motion.button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {healthProfile.conditions.length === 0 ? (
                                    <p className="text-[14px] text-[#999]">No conditions added yet</p>
                                ) : (
                                    healthProfile.conditions.map(condition => (
                                        <motion.span
                                            key={condition}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[13px]"
                                        >
                                            {condition}
                                            <button onClick={() => removeItem('conditions', condition)} className="hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-full p-0.5">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Allergies */}
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    <h3 className="text-[16px] font-semibold text-[#171717] dark:text-white">Allergies</h3>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAllergyPicker(true)}
                                    className="h-8 px-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[13px] font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </motion.button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {healthProfile.allergies.length === 0 ? (
                                    <p className="text-[14px] text-[#999]">No allergies added yet</p>
                                ) : (
                                    healthProfile.allergies.map(allergy => (
                                        <motion.span
                                            key={allergy}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[13px]"
                                        >
                                            {allergy}
                                            <button onClick={() => removeItem('allergies', allergy)} className="hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-full p-0.5">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Current Medications */}
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-emerald-500" />
                                    <h3 className="text-[16px] font-semibold text-[#171717] dark:text-white">Current Medications</h3>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowMedicationPicker(true)}
                                    className="h-8 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[13px] font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </motion.button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {healthProfile.medications.length === 0 ? (
                                    <p className="text-[14px] text-[#999]">No medications added yet</p>
                                ) : (
                                    healthProfile.medications.map(medication => (
                                        <motion.span
                                            key={medication}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[13px]"
                                        >
                                            {medication}
                                            <button onClick={() => removeItem('medications', medication)} className="hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-full p-0.5">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={saveProfile}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[14px] font-medium flex items-center justify-center gap-2"
                        >
                            {saved ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Health Profile
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <h3 className="text-[16px] font-semibold text-[#171717] dark:text-white mb-4">Personal Information</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: User, label: 'Full Name', value: displayName },
                                    { icon: Mail, label: 'Email', value: displayEmail },
                                    { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                                    { icon: Calendar, label: 'Date of Birth', value: 'January 4, 2005' },
                                    { icon: MapPin, label: 'Address', value: '10 Halsuru Lake, Bengaluru' },
                                ].map((field, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#EAEAEA] dark:border-[#333] last:border-0">
                                        <div className="flex items-center gap-3">
                                            <field.icon className="w-4 h-4 text-[#999]" />
                                            <div>
                                                <p className="text-[12px] text-[#999]">{field.label}</p>
                                                <p className="text-[14px] text-[#171717] dark:text-white">{field.value}</p>
                                            </div>
                                        </div>
                                        <button className="text-[13px] text-[#0070F3] hover:underline">Edit</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <h3 className="text-[16px] font-semibold text-[#171717] dark:text-white mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                {[
                                    { key: 'appointments', label: 'Appointment Reminders', desc: 'Get notified about upcoming appointments' },
                                    { key: 'labResults', label: 'Lab Results', desc: 'Receive alerts when results are ready' },
                                    { key: 'reminders', label: 'Medicine Reminders', desc: 'Daily reminders for your medications' },
                                    { key: 'promotions', label: 'Promotional Updates', desc: 'Health tips and special offers' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="text-[14px] font-medium text-[#171717] dark:text-white">{item.label}</p>
                                            <p className="text-[13px] text-[#666] dark:text-[#888]">{item.desc}</p>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                                            className={`w-12 h-7 rounded-full flex items-center transition-colors ${notifications[item.key as keyof typeof notifications]
                                                ? 'bg-emerald-500 justify-end'
                                                : 'bg-[#E5E5E5] dark:bg-[#333] justify-start'
                                                }`}
                                        >
                                            <motion.div
                                                layout
                                                className="w-5 h-5 rounded-full bg-white shadow-md mx-1"
                                            />
                                        </motion.button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <h3 className="text-[16px] font-semibold text-[#171717] dark:text-white mb-4">Security Settings</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Change Password', desc: 'Update your account password' },
                                    { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                                    { label: 'Active Sessions', desc: 'Manage devices where you are logged in' },
                                ].map((item, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ x: 4 }}
                                        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                                    >
                                        <div className="text-left">
                                            <p className="text-[14px] font-medium text-[#171717] dark:text-white">{item.label}</p>
                                            <p className="text-[13px] text-[#666] dark:text-[#888]">{item.desc}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[#999]" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-12 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </motion.button>
                    </motion.div>
                )}
            </main>

            {/* Condition Picker Modal */}
            <AnimatePresence>
                {showConditionPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        onClick={() => setShowConditionPicker(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-[#111] rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[18px] font-semibold text-[#171717] dark:text-white">Select Conditions</h3>
                                <button onClick={() => setShowConditionPicker(false)} className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#222] rounded-lg">
                                    <X className="w-5 h-5 text-[#666]" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {availableConditions.map(condition => (
                                    <motion.button
                                        key={condition}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleItem('conditions', condition)}
                                        className={`w-full p-3 rounded-lg text-left text-[14px] flex items-center justify-between transition-colors ${healthProfile.conditions.includes(condition)
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                : 'hover:bg-[#F5F5F5] dark:hover:bg-[#222] text-[#171717] dark:text-white'
                                            }`}
                                    >
                                        {condition}
                                        {healthProfile.conditions.includes(condition) && <Check className="w-4 h-4" />}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Allergy Picker Modal */}
            <AnimatePresence>
                {showAllergyPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        onClick={() => setShowAllergyPicker(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-[#111] rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[18px] font-semibold text-[#171717] dark:text-white">Select Allergies</h3>
                                <button onClick={() => setShowAllergyPicker(false)} className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#222] rounded-lg">
                                    <X className="w-5 h-5 text-[#666]" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {availableAllergies.map(allergy => (
                                    <motion.button
                                        key={allergy}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleItem('allergies', allergy)}
                                        className={`w-full p-3 rounded-lg text-left text-[14px] flex items-center justify-between transition-colors ${healthProfile.allergies.includes(allergy)
                                                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                : 'hover:bg-[#F5F5F5] dark:hover:bg-[#222] text-[#171717] dark:text-white'
                                            }`}
                                    >
                                        {allergy}
                                        {healthProfile.allergies.includes(allergy) && <Check className="w-4 h-4" />}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Medication Picker Modal */}
            <AnimatePresence>
                {showMedicationPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        onClick={() => setShowMedicationPicker(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-[#111] rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[18px] font-semibold text-[#171717] dark:text-white">Select Medications</h3>
                                <button onClick={() => setShowMedicationPicker(false)} className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#222] rounded-lg">
                                    <X className="w-5 h-5 text-[#666]" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {availableMedications.map(medication => (
                                    <motion.button
                                        key={medication}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleItem('medications', medication)}
                                        className={`w-full p-3 rounded-lg text-left text-[14px] flex items-center justify-between transition-colors ${healthProfile.medications.includes(medication)
                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'hover:bg-[#F5F5F5] dark:hover:bg-[#222] text-[#171717] dark:text-white'
                                            }`}
                                    >
                                        {medication}
                                        {healthProfile.medications.includes(medication) && <Check className="w-4 h-4" />}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
