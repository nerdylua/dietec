'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/app/(auth)/actions'
import {
    LogOut, Home, Users, Pill, FlaskConical, DollarSign, Settings, ChevronRight,
    Bell, TrendingUp, Package, UserCheck, AlertTriangle, Calendar,
    X, Check, Eye, MoreHorizontal, RefreshCw, Activity, ArrowUpRight
} from 'lucide-react'

// Only show Overview as active since other pages don't exist
const navItems = [
    { icon: Home, label: 'Overview', href: '/admin', active: true },
]

// Realistic stats for a small-medium healthcare clinic
const initialStats = {
    totalUsers: 156, newUsersThisWeek: 8, userGrowth: 5.2,
    revenue: 187500, revenueGrowth: 12.4,
    medicineStock: 89, lowStockCount: 4,
    activeDoctors: 6, doctorsOnLeave: 1,
    pendingAppointments: 12, completedToday: 7
}

const recentUsers = [
    { id: 1, name: 'Rajesh Sharma', email: 'rajesh.s@gmail.com', role: 'patient', joined: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'active' },
    { id: 2, name: 'Dr. Priya Patel', email: 'dr.priya@dietec.in', role: 'doctor', joined: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'active' },
    { id: 3, name: 'Amit Kumar', email: 'amit.kumar@yahoo.com', role: 'patient', joined: new Date(Date.now() - 18 * 60 * 60 * 1000), status: 'active' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.r99@gmail.com', role: 'patient', joined: new Date(Date.now() - 36 * 60 * 60 * 1000), status: 'active' },
    { id: 5, name: 'Dr. Arjun Mehta', email: 'dr.arjun@dietec.in', role: 'doctor', joined: new Date(Date.now() - 72 * 60 * 60 * 1000), status: 'pending' },
]

const recentActivity = [
    { id: 1, type: 'user', action: 'Patient registered', user: 'Rajesh Sharma', time: '2 min ago' },
    { id: 2, type: 'appointment', action: 'Consultation completed', user: 'Dr. Priya Patel', time: '18 min ago' },
    { id: 3, type: 'order', action: 'Medicine order ₹450', user: 'Amit Kumar', time: '45 min ago' },
    { id: 4, type: 'test', action: 'CBC report uploaded', user: 'Lab Team', time: '1 hour ago' },
    { id: 5, type: 'payment', action: 'Payment ₹1,200', user: 'Sneha Reddy', time: '2 hours ago' },
]

const lowStockMedicines = [
    { id: 1, name: 'Paracetamol 500mg', stock: 8, minStock: 25 },
    { id: 2, name: 'Amoxicillin 250mg', stock: 5, minStock: 20 },
    { id: 3, name: 'Cetirizine 10mg', stock: 12, minStock: 30 },
    { id: 4, name: 'Omeprazole 20mg', stock: 6, minStock: 15 },
]

interface AdminDashboardClientProps {
    firstName: string
}

export default function AdminDashboardClient({ firstName }: AdminDashboardClientProps) {
    const [stats, setStats] = useState(initialStats)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month'>('week')
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Low stock alert', message: '4 medicines need restocking', read: false, time: '5 min ago' },
        { id: 2, title: 'Doctor pending', message: 'Dr. Arjun Mehta needs approval', read: false, time: '1 hour ago' },
        { id: 3, title: 'Daily backup', message: 'Database backup completed', read: true, time: '6 hours ago' },
    ])

    const refreshData = async () => {
        setIsRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats(prev => ({
            ...prev,
            completedToday: Math.min(prev.completedToday + 1, prev.pendingAppointments + prev.completedToday),
            pendingAppointments: Math.max(prev.pendingAppointments - 1, 0),
        }))
        setIsRefreshing(false)
    }

    const markNotificationRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
        return `${Math.floor(seconds / 86400)} days ago`
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
            <div className="fixed inset-0 -z-10" style={{ backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="flex items-center gap-2">
                            <svg height="20" viewBox="0 0 76 65" fill="currentColor" className="text-[#171717] dark:text-white"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" /></svg>
                            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">DIETEC</span>
                            <span className="ml-2 px-2 py-0.5 text-[11px] font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded">Admin</span>
                        </Link>
                        <nav className="hidden lg:flex items-center">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#171717] dark:text-white font-medium">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNotifications(!showNotifications)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors relative">
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
                            </motion.button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 w-80 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] shadow-xl overflow-hidden">
                                        <div className="p-4 border-b border-[#EAEAEA] dark:border-[#333] flex items-center justify-between">
                                            <h3 className="text-[14px] font-semibold text-[#171717] dark:text-white">Notifications</h3>
                                            <button onClick={() => setShowNotifications(false)} className="text-[#666]"><X className="w-4 h-4" /></button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-4 border-b border-[#EAEAEA] dark:border-[#333] cursor-pointer hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] ${!n.read ? 'bg-blue-50 dark:bg-blue-500/5' : ''}`}>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className={`text-[13px] ${!n.read ? 'font-semibold text-[#171717] dark:text-white' : 'text-[#666] dark:text-[#888]'}`}>{n.title}</p>
                                                            <p className="text-[12px] text-[#999] mt-0.5">{n.message}</p>
                                                        </div>
                                                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                                                    </div>
                                                    <p className="text-[11px] text-[#999] mt-1">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <ThemeToggle />
                        <div className="h-6 w-px bg-[#EAEAEA] dark:bg-[#333] mx-1" />
                        <form action={logout}>
                            <button type="submit" className="flex items-center gap-2 text-[14px] text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white transition-colors">
                                <span className="hidden sm:inline">{firstName}</span><LogOut className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-1">Admin Dashboard</h1>
                        <p className="text-[15px] text-[#666] dark:text-[#888]">Welcome back, {firstName}. Here&apos;s your clinic overview.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex rounded-lg border border-[#EAEAEA] dark:border-[#333] overflow-hidden">
                            {(['today', 'week', 'month'] as const).map(range => (
                                <button key={range} onClick={() => setSelectedTimeRange(range)} className={`px-3 py-1.5 text-[13px] capitalize transition-colors ${selectedTimeRange === range ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717]' : 'text-[#666] hover:bg-[#F5F5F5] dark:hover:bg-[#222]'}`}>{range}</button>
                            ))}
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refreshData} disabled={isRefreshing} className="h-9 px-4 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[13px] text-[#666] flex items-center gap-2 hover:border-[#CCC] disabled:opacity-50">
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh
                        </motion.button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Patients', value: stats.totalUsers.toString(), desc: `+${stats.newUsersThisWeek} this week`, icon: Users, color: 'from-blue-500 to-cyan-500', trend: stats.userGrowth },
                        { label: 'Monthly Revenue', value: `₹${(stats.revenue / 1000).toFixed(0)}K`, desc: 'This month', icon: DollarSign, color: 'from-emerald-500 to-teal-500', trend: stats.revenueGrowth },
                        { label: 'Medicine Stock', value: stats.medicineStock.toString(), desc: `${stats.lowStockCount} need restock`, icon: Package, color: 'from-violet-500 to-purple-500', trend: null },
                        { label: 'Active Doctors', value: stats.activeDoctors.toString(), desc: `${stats.doctorsOnLeave} on leave`, icon: UserCheck, color: 'from-amber-500 to-orange-500', trend: null },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -2, scale: 1.01 }} className="p-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}><stat.icon className="w-6 h-6 text-white" /></div>
                                {stat.trend !== null && <span className="flex items-center gap-0.5 text-[12px] font-medium text-emerald-500"><ArrowUpRight className="w-3 h-3" />+{stat.trend}%</span>}
                            </div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-[#171717] dark:text-white mb-1">{stat.value}</p>
                            <p className="text-[13px] text-[#666] dark:text-[#888]">{stat.label}</p>
                            <p className="text-[12px] text-[#999] mt-1">{stat.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Pending Today', value: stats.pendingAppointments, icon: Calendar, color: 'text-blue-500' },
                        { label: 'Completed', value: stats.completedToday, icon: Check, color: 'text-emerald-500' },
                        { label: 'Active Now', value: 3, icon: Activity, color: 'text-violet-500' },
                        { label: 'Low Stock Items', value: stats.lowStockCount, icon: AlertTriangle, color: 'text-amber-500' },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} className="p-4 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] flex items-center gap-4">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <div>
                                <p className="text-[20px] font-bold text-[#171717] dark:text-white">{stat.value}</p>
                                <p className="text-[12px] text-[#999]">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Users */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] overflow-hidden">
                        <div className="p-5 border-b border-[#EAEAEA] dark:border-[#333] flex items-center justify-between">
                            <h2 className="text-[16px] font-semibold text-[#171717] dark:text-white">Recent Users</h2>
                            <span className="text-[13px] text-[#999]">{recentUsers.length} new this week</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                                    <tr>
                                        <th className="text-left text-[12px] font-medium text-[#666] dark:text-[#888] px-5 py-3">User</th>
                                        <th className="text-left text-[12px] font-medium text-[#666] dark:text-[#888] px-5 py-3">Role</th>
                                        <th className="text-left text-[12px] font-medium text-[#666] dark:text-[#888] px-5 py-3">Status</th>
                                        <th className="text-left text-[12px] font-medium text-[#666] dark:text-[#888] px-5 py-3">Joined</th>
                                        <th className="text-right text-[12px] font-medium text-[#666] dark:text-[#888] px-5 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EAEAEA] dark:divide-[#333]">
                                    {recentUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-medium ${user.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-violet-500 to-purple-500'}`}>
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-medium text-[#171717] dark:text-white">{user.name}</p>
                                                        <p className="text-[12px] text-[#999]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-0.5 text-[11px] font-medium rounded capitalize ${user.role === 'doctor' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'}`}>{user.role}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-0.5 text-[11px] font-medium rounded capitalize ${user.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>{user.status}</span>
                                            </td>
                                            <td className="px-5 py-3 text-[13px] text-[#666] dark:text-[#888]">{formatTimeAgo(user.joined)}</td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:bg-[#F5F5F5] dark:hover:bg-[#222]"><Eye className="w-4 h-4" /></button>
                                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:bg-[#F5F5F5] dark:hover:bg-[#222]"><MoreHorizontal className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Low Stock Alert */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/5 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <h3 className="text-[14px] font-semibold text-red-700 dark:text-red-400">Low Stock Alert</h3>
                            </div>
                            <div className="space-y-3">
                                {lowStockMedicines.map(med => (
                                    <div key={med.id} className="flex items-center justify-between">
                                        <span className="text-[13px] text-red-700 dark:text-red-300">{med.name}</span>
                                        <span className="text-[12px] font-bold text-red-600">{med.stock} left</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full py-2 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors">Restock Now</button>
                        </motion.div>

                        {/* Activity Feed */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-5">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-500/20' : activity.type === 'payment' ? 'bg-emerald-100 dark:bg-emerald-500/20' : activity.type === 'appointment' ? 'bg-violet-100 dark:bg-violet-500/20' : activity.type === 'order' ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-gray-100 dark:bg-gray-500/20'}`}>
                                            {activity.type === 'user' && <Users className="w-4 h-4 text-blue-500" />}
                                            {activity.type === 'appointment' && <Calendar className="w-4 h-4 text-violet-500" />}
                                            {activity.type === 'order' && <Package className="w-4 h-4 text-amber-500" />}
                                            {activity.type === 'test' && <FlaskConical className="w-4 h-4 text-cyan-500" />}
                                            {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-emerald-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] text-[#171717] dark:text-white truncate">{activity.action}</p>
                                            <p className="text-[12px] text-[#999]">{activity.user} • {activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-5">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Today&apos;s Summary</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#666] dark:text-[#888]">Appointments</span>
                                    <span className="text-[14px] font-semibold text-[#171717] dark:text-white">{stats.completedToday}/{stats.pendingAppointments + stats.completedToday}</span>
                                </div>
                                <div className="h-2 bg-[#E5E5E5] dark:bg-[#333] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.completedToday / (stats.pendingAppointments + stats.completedToday)) * 100}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-[13px] text-[#666] dark:text-[#888]">Lab Tests</span>
                                    <span className="text-[14px] font-semibold text-[#171717] dark:text-white">5/8</span>
                                </div>
                                <div className="h-2 bg-[#E5E5E5] dark:bg-[#333] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}
