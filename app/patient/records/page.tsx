'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    Plus,
    Trash2,
    Edit2,
    Heart,
    Pill,
    AlertTriangle,
    Stethoscope,
    ChevronDown,
    ChevronUp,
    Calendar,
    FileText,
    Check
} from 'lucide-react'

interface MedicalRecord {
    id: string
    type: 'condition' | 'allergy' | 'medication' | 'surgery'
    name: string
    details: string
    date?: string
    status?: 'active' | 'resolved'
}

const mockRecords: MedicalRecord[] = [
    { id: '1', type: 'condition', name: 'Type 2 Diabetes', details: 'Managed with medication and diet', date: '2023-01-15', status: 'active' },
    { id: '2', type: 'allergy', name: 'Penicillin', details: 'Causes skin rash and swelling', status: 'active' },
    { id: '3', type: 'medication', name: 'Metformin 500mg', details: 'Twice daily with meals', status: 'active' },
    { id: '4', type: 'surgery', name: 'Appendectomy', details: 'Laparoscopic surgery, no complications', date: '2019-06-20', status: 'resolved' },
]

const typeConfig = {
    condition: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Condition' },
    allergy: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Allergy' },
    medication: { icon: Pill, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', label: 'Medication' },
    surgery: { icon: Stethoscope, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', label: 'Surgery' },
}

export default function MedicalHistoryPage() {
    const [records, setRecords] = useState<MedicalRecord[]>(mockRecords)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [filter, setFilter] = useState<string>('all')

    const filteredRecords = records.filter(r => filter === 'all' || r.type === filter)

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
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
                            href="/patient"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Medical History</h1>
                            <p className="text-[12px] text-[#666] dark:text-[#888]">{records.length} records</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-9 px-4 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[13px] font-medium flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Record
                        </motion.button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-2"
                >
                    {['all', 'condition', 'allergy', 'medication', 'surgery'].map((f) => (
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
                            {f === 'all' ? 'All Records' : typeConfig[f as keyof typeof typeConfig]?.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Records List */}
                <div className="space-y-4">
                    {filteredRecords.map((record, i) => {
                        const config = typeConfig[record.type]
                        const isExpanded = expandedId === record.id

                        return (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleExpand(record.id)}
                                    className="w-full p-5 flex items-center justify-between hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}
                                        >
                                            <config.icon className={`w-6 h-6 ${config.color}`} />
                                        </motion.div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-[15px] font-medium text-[#171717] dark:text-white">{record.name}</p>
                                                {record.status === 'active' && (
                                                    <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[13px] text-[#666] dark:text-[#888]">{config.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {record.date && (
                                            <span className="text-[12px] text-[#999] hidden sm:block">
                                                {new Date(record.date).toLocaleDateString()}
                                            </span>
                                        )}
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown className="w-5 h-5 text-[#999]" />
                                        </motion.div>
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                <motion.div
                                    initial={false}
                                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-5 pt-0">
                                        <div className="ml-16 pt-4 border-t border-[#EAEAEA] dark:border-[#333]">
                                            <p className="text-[14px] text-[#666] dark:text-[#888] mb-4">{record.details}</p>

                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="h-8 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] flex items-center gap-1.5 hover:border-[#CCC] dark:hover:border-[#555]"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                    Edit
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="h-8 px-3 rounded-lg border border-red-200 dark:border-red-500/30 text-[13px] text-red-500 flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredRecords.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <FileText className="w-12 h-12 text-[#CCC] mx-auto mb-4" />
                        <p className="text-[15px] text-[#666] dark:text-[#888]">No records found</p>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
