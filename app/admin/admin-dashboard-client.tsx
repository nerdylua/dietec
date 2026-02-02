'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/app/(auth)/actions'
import {
    LogOut, Home, Users, Pill, FlaskConical, DollarSign, Settings, ChevronRight,
    Bell, Search, TrendingUp, Package, UserCheck, AlertTriangle, Calendar,
    X, Check, Eye, MoreHorizontal, RefreshCw, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

const navItems = [
    { icon: Home, label: 'Overview', href: '/admin', active: true },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Pill, label: 'Medicines', href: '/admin/medicines' },
    { icon: FlaskConical, label: 'Lab Tests', href: '/admin/tests' },
    { icon: DollarSign, label: 'Billing', href: '/admin/billing' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

// Mock data - in production, this would come from Supabase
const initialStats = {
    totalUsers: 1247, newUsersThisWeek: 23, userGrowth: 12,
    revenue: 420000, revenueGrowth: 8,
    medicineStock: 342, lowStockCount: 12,
    activeDoctors: 18, doctorsOnLeave: 3,
    pendingAppointments: 47, completedToday: 23
}

const recentUsers = [
    { id: 1, name: 'Rajesh Sharma', email: 'rajesh@example.com', role: 'patient', joined: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'active' },
    { id: 2, name: 'Dr. Priya Patel', email: 'priya@hospital.com', role: 'doctor', joined: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'active' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', role: 'patient', joined: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'active' },
    { id: 4, name: 'Dr. Emma Wilson', email: 'emma@hospital.com', role: 'doctor', joined: new Date(Date.now() - 48 * 60 * 60 * 1000), status: 'pending' },
    { id: 5, name: 'Neha Singh', email: 'neha@example.com', role: 'patient', joined: new Date(Date.now() - 72 * 60 * 60 * 1000), status: 'active' },
]

const recentActivity = [
    { id: 1, type: 'user', action: 'New patient registered', user: 'Rajesh Sharma', time: '2 min ago' },
    { id: 2, type: 'appointment', action: 'Appointment completed', user: 'Dr. Priya Patel', time: '15 min ago' },
    { id: 3, type: 'order', action: 'Medicine order placed', user: 'Amit Kumar', time: '1 hour ago' },
    { id: 4, type: 'test', action: 'Lab result uploaded', user: 'System', time: '2 hours ago' },
    { id: 5, type: 'payment', action: 'Payment received ₹4,500', user: 'Neha Singh', time: '3 hours ago' },
]

const lowStockMedicines = [
    { id: 1, name: 'Paracetamol 500mg', stock: 12, minStock: 50 },
    { id: 2, name: 'Amoxicillin 250mg', stock: 8, minStock: 30 },
    { id: 3, name: 'Metformin 500mg', stock: 15, minStock: 40 },
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
        { id: 1, title: 'Low stock alert', message: '12 medicines need restocking', read: false, time: '5 min ago' },
        { id: 2, title: 'New doctor registration', message: 'Dr. Priya Patel awaiting approval', read: false, time: '1 hour ago' },
        { id: 3, title: 'System update', message: 'Scheduled maintenance tonight at 2 AM', read: true, time: '3 hours ago' },
    ])

    const refreshData = async () => {
        setIsRefreshing(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats(prev => ({
            ...prev,
            completedToday: prev.completedToday + Math.floor(Math.random() * 3),
            pendingAppointments: prev.pendingAppointments - Math.floor(Math.random() * 2),
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

            {/* Header */}
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
                                <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2 text-[14px] transition-colors ${item.active ? 'text-[#171717] dark:text-white font-medium' : 'text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white'}`}>
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
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-1">Admin Dashboard</h1>
                        <p className="text-[15px] text-[#666] dark:text-[#888]">Welcome back, {firstName}. Here&apos;s what&apos;s happening today.</p>
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
                        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), desc: `+${stats.newUsersThisWeek} this week`, icon: Users, color: 'from-blue-500 to-cyan-500', trend: stats.userGrowth, up: true },
                        { label: 'Revenue', value: `₹${(stats.revenue / 100000).toFixed(1)}L`, desc: 'This month', icon: DollarSign, color: 'from-emerald-500 to-teal-500', trend: stats.revenueGrowth, up: true },
                        { label: 'Medicine Stock', value: stats.medicineStock.toString(), desc: `${stats.lowStockCount} low stock`, icon: Package, color: 'from-violet-500 to-purple-500', trend: null, up: false },
                        { label: 'Active Doctors', value: stats.activeDoctors.toString(), desc: `${stats.doctorsOnLeave} on leave`, icon: UserCheck, color: 'from-amber-500 to-orange-500', trend: null, up: false },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -2, scale: 1.01 }} className="p-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}><stat.icon className="w-6 h-6 text-white" /></div>
                                {stat.trend !== null && (
                                    <span className={`flex items-center gap-0.5 text-[12px] font-medium ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}+{stat.trend}%
                                    </span>
                                )}
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
                        { label: 'Pending Appointments', value: stats.pendingAppointments, icon: Calendar, color: 'text-blue-500' },
                        { label: 'Completed Today', value: stats.completedToday, icon: Check, color: 'text-emerald-500' },
                        { label: 'Active Sessions', value: 156, icon: Activity, color: 'text-violet-500' },
                        { label: 'Support Tickets', value: 8, icon: AlertTriangle, color: 'text-amber-500' },
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
                            <Link href="/admin/users" className="text-[13px] text-blue-500 hover:underline flex items-center gap-1">View all<ChevronRight className="w-3.5 h-3.5" /></Link>
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
                                        <span className="text-[12px] font-bold text-red-600">{med.stock}/{med.minStock}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/admin/medicines" className="mt-4 block text-center py-2 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors">Update Inventory</Link>
                        </motion.div>

                        {/* Activity Feed */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-5">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-500/20' : activity.type === 'payment' ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-gray-100 dark:bg-gray-500/20'}`}>
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

                        {/* Quick Actions */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-5">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { icon: Users, label: 'Add User', href: '/admin/users/new', color: 'from-blue-500 to-cyan-500' },
                                    { icon: Pill, label: 'Add Medicine', href: '/admin/medicines', color: 'from-violet-500 to-purple-500' },
                                    { icon: FlaskConical, label: 'Add Test', href: '/admin/tests', color: 'from-emerald-500 to-teal-500' },
                                    { icon: DollarSign, label: 'Reports', href: '/admin/billing', color: 'from-amber-500 to-orange-500' },
                                ].map((action, i) => (
                                    <Link key={i} href={action.href} className="p-3 rounded-xl border border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555] transition-all hover:shadow-sm group">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                                            <action.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-[13px] font-medium text-[#171717] dark:text-white">{action.label}</p>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}
