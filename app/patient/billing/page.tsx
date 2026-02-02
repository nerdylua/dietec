'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    DollarSign,
    Download,
    Eye,
    CheckCircle,
    AlertCircle,
    Clock,
    CreditCard,
    Filter,
    Receipt
} from 'lucide-react'

type BillStatus = 'paid' | 'pending' | 'overdue'

interface Bill {
    id: string
    description: string
    category: 'appointment' | 'lab_test' | 'medicine' | 'consultation'
    date: string
    amount: number
    status: BillStatus
    invoiceNo: string
}

const mockBills: Bill[] = [
    { id: '1', description: 'Consultation - Dr. Priya Patel', category: 'consultation', date: '2024-02-05', amount: 500, status: 'pending', invoiceNo: 'INV-2024-001' },
    { id: '2', description: 'Lab Test - Complete Blood Count', category: 'lab_test', date: '2024-02-04', amount: 299, status: 'pending', invoiceNo: 'INV-2024-002' },
    { id: '3', description: 'Medicines Order #1234', category: 'medicine', date: '2024-01-30', amount: 1250, status: 'paid', invoiceNo: 'INV-2024-003' },
    { id: '4', description: 'Follow-up - Dr. Arjun Mehta', category: 'appointment', date: '2024-01-28', amount: 300, status: 'paid', invoiceNo: 'INV-2024-004' },
    { id: '5', description: 'Lab Test - Thyroid Profile', category: 'lab_test', date: '2024-01-15', amount: 599, status: 'overdue', invoiceNo: 'INV-2024-005' },
]

const statusConfig = {
    paid: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Paid' },
    pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Pending' },
    overdue: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Overdue' },
}

const categoryLabels = {
    appointment: 'Appointment',
    lab_test: 'Lab Test',
    medicine: 'Medicine',
    consultation: 'Consultation'
}

export default function BillingPage() {
    const [filter, setFilter] = useState<string>('all')
    const [bills] = useState<Bill[]>(mockBills)

    const filteredBills = bills.filter(b => filter === 'all' || b.status === filter)

    const totalPending = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0)
    const totalOverdue = bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0)

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
                            <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Billing & Payments</h1>
                            <p className="text-[12px] text-[#666] dark:text-[#888]">{bills.length} invoices</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
                >
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="p-6 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] text-amber-600 dark:text-amber-400 font-medium">Pending Amount</span>
                            <Clock className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-[28px] font-bold text-amber-700 dark:text-amber-300">₹{totalPending.toLocaleString()}</p>
                    </motion.div>

                    {totalOverdue > 0 && (
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-6 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] text-red-600 dark:text-red-400 font-medium">Overdue Amount</span>
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <p className="text-[28px] font-bold text-red-700 dark:text-red-300">₹{totalOverdue.toLocaleString()}</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
                >
                    <Filter className="w-4 h-4 text-[#999] flex-shrink-0" />
                    {['all', 'pending', 'paid', 'overdue'].map((f) => (
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
                            {f === 'all' ? 'All' : statusConfig[f as BillStatus]?.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Bills List */}
                <div className="space-y-4">
                    {filteredBills.map((bill, i) => {
                        const config = statusConfig[bill.status]
                        return (
                            <motion.div
                                key={bill.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -2 }}
                                className="p-5 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] hover:border-[#CCC] dark:hover:border-[#555] transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                                        >
                                            <Receipt className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div>
                                            <p className="text-[15px] font-medium text-[#171717] dark:text-white mb-1">{bill.description}</p>
                                            <div className="flex items-center gap-3 text-[13px] text-[#999]">
                                                <span>{bill.invoiceNo}</span>
                                                <span>•</span>
                                                <span>{new Date(bill.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[20px] font-bold text-[#171717] dark:text-white mb-1">₹{bill.amount}</p>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${config.bg} ${config.color}`}>
                                            <config.icon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[#EAEAEA] dark:border-[#333] flex items-center justify-between">
                                    <span className="text-[12px] px-2 py-0.5 rounded bg-[#F5F5F5] dark:bg-[#222] text-[#666] dark:text-[#888]">
                                        {categoryLabels[bill.category]}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {bill.status !== 'paid' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="h-8 px-4 rounded-lg bg-emerald-600 text-white text-[13px] font-medium flex items-center gap-1.5"
                                            >
                                                <CreditCard className="w-3.5 h-3.5" />
                                                Pay Now
                                            </motion.button>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-8 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] flex items-center gap-1.5 hover:border-[#CCC] dark:hover:border-[#555]"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-8 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] dark:text-[#888] flex items-center gap-1.5 hover:border-[#CCC] dark:hover:border-[#555]"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            PDF
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
