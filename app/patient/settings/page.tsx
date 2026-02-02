'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
    Check
} from 'lucide-react'

export default function PatientSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [notifications, setNotifications] = useState({
        appointments: true,
        labResults: true,
        promotions: false,
        reminders: true
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
                            U
                        </motion.div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] flex items-center justify-center border-4 border-white dark:border-[#0A0A0A]">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-[22px] font-bold text-[#171717] dark:text-white mb-1">User Name</h2>
                        <p className="text-[14px] text-[#666] dark:text-[#888]">user@example.com</p>
                        <p className="text-[13px] text-emerald-500 mt-2">Profile 70% complete</p>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                                    : 'text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222]'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </motion.button>
                    ))}
                </div>

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
                                    { icon: User, label: 'Full Name', value: 'User Name' },
                                    { icon: Mail, label: 'Email', value: 'user@example.com' },
                                    { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                                    { icon: Calendar, label: 'Date of Birth', value: 'January 1, 1990' },
                                    { icon: MapPin, label: 'Address', value: '123 Main Street, City' },
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
        </div>
    )
}
