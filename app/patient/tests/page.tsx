'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    FlaskConical,
    Clock,
    Download,
    Eye,
    CheckCircle,
    AlertCircle,
    Loader2,
    Plus,
    Filter
} from 'lucide-react'

type TestStatus = 'pending' | 'processing' | 'completed'

interface LabTest {
    id: string
    name: string
    date: string
    time: string
    collection: 'home' | 'lab'
    status: TestStatus
    price: number
}

const mockTests: LabTest[] = [
    { id: '1', name: 'Complete Blood Count (CBC)', date: '2024-02-06', time: '8:00 AM', collection: 'home', status: 'pending', price: 299 },
    { id: '2', name: 'Lipid Profile', date: '2024-02-04', time: '9:00 AM', collection: 'lab', status: 'processing', price: 399 },
    { id: '3', name: 'Thyroid Profile (T3, T4, TSH)', date: '2024-01-28', time: '7:30 AM', collection: 'home', status: 'completed', price: 599 },
    { id: '4', name: 'HbA1c (Diabetes)', date: '2024-01-15', time: '8:00 AM', collection: 'lab', status: 'completed', price: 349 },
]

const statusConfig = {
    pending: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Sample Pending', animate: false },
    processing: { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', label: 'Processing', animate: true },
    completed: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Report Ready', animate: false },
}

export default function LabTestsListPage() {
    const [filter, setFilter] = useState<string>('all')
    const [tests] = useState<LabTest[]>(mockTests)

    const filteredTests = tests.filter(t => filter === 'all' || t.status === filter)

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
                            <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Lab Tests</h1>
                            <p className="text-[12px] text-[#666] dark:text-[#888]">{tests.length} tests</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/patient/tests/new">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-9 px-4 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[13px] font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Book Test
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
                    {['all', 'pending', 'processing', 'completed'].map((f) => (
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
                            {f === 'all' ? 'All Tests' : statusConfig[f as TestStatus]?.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Tests List */}
                <div className="space-y-4">
                    {filteredTests.map((test, i) => {
                        const config = statusConfig[test.status]
                        const StatusIcon = config.icon
                        return (
                            <motion.div
                                key={test.id}
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
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center"
                                        >
                                            <FlaskConical className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div>
                                            <p className="text-[15px] font-medium text-[#171717] dark:text-white mb-1">{test.name}</p>
                                            <div className="flex items-center gap-4 text-[13px] text-[#999] mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {test.time}
                                                </span>
                                                <span className="capitalize">{test.collection} collection</span>
                                            </div>
                                            <p className="text-[14px] font-medium text-emerald-600 dark:text-emerald-400">₹{test.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 ${config.bg} ${config.color}`}>
                                            <StatusIcon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
                                            {config.label}
                                        </span>
                                    </div>
                                </div>

                                {test.status === 'completed' && (
                                    <div className="mt-4 pt-4 border-t border-[#EAEAEA] dark:border-[#333] flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-8 px-4 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[13px] font-medium flex items-center gap-1.5"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View Report
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-8 px-4 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] flex items-center gap-1.5 hover:border-[#CCC] dark:hover:border-[#555]"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Download PDF
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredTests.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <FlaskConical className="w-12 h-12 text-[#CCC] mx-auto mb-4" />
                        <p className="text-[15px] text-[#666] dark:text-[#888] mb-4">No tests found</p>
                        <Link href="/patient/tests/new">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-10 px-6 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[14px] font-medium inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Book Lab Test
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
