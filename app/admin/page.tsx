import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/app/(auth)/actions'
import Link from 'next/link'
import {
    LogOut,
    Home,
    Users,
    Pill,
    FlaskConical,
    DollarSign,
    Settings,
    ChevronRight,
    Bell,
    Search,
    TrendingUp,
    Package,
    UserCheck,
    AlertTriangle
} from 'lucide-react'

const navItems = [
    { icon: Home, label: 'Overview', href: '/admin', active: true },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Pill, label: 'Medicines', href: '/admin/medicines' },
    { icon: FlaskConical, label: 'Lab Tests', href: '/admin/tests' },
    { icon: DollarSign, label: 'Billing', href: '/admin/billing' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: userData } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', user.id)
        .single()

    const firstName = userData?.full_name?.split(' ')[0] || 'Admin'

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

            {/* Navbar */}
            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="flex items-center gap-2">
                            <svg
                                height="20"
                                viewBox="0 0 76 65"
                                fill="currentColor"
                                className="text-[#171717] dark:text-white"
                            >
                                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                            </svg>
                            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">DIETEC</span>
                            <span className="ml-2 px-2 py-0.5 text-[11px] font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">Admin</span>
                        </Link>

                        <nav className="hidden lg:flex items-center">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-3 py-2 text-[14px] transition-colors ${item.active
                                            ? 'text-[#171717] dark:text-white font-medium'
                                            : 'text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-[#EAEAEA] dark:border-[#333] text-[#666] dark:text-[#888] text-[13px] hover:border-[#CCC] dark:hover:border-[#555] transition-colors">
                            <Search className="w-4 h-4" />
                            <span>Search...</span>
                            <kbd className="ml-2 px-1.5 py-0.5 text-[11px] bg-[#F5F5F5] dark:bg-[#222] rounded">⌘K</kbd>
                        </button>

                        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        <ThemeToggle />

                        <div className="h-6 w-px bg-[#EAEAEA] dark:bg-[#333] mx-1" />

                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 text-[14px] text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white transition-colors"
                            >
                                <span className="hidden sm:inline">{firstName}</span>
                                <LogOut className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Welcome */}
                <div className="mb-10">
                    <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#171717] dark:text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-[15px] text-[#666] dark:text-[#888]">
                        Manage your healthcare system from here.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Users', value: '1,247', desc: '+23 this week', icon: Users, iconColor: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10', trend: '+12%' },
                        { label: 'Revenue', value: '₹4.2L', desc: 'This month', icon: DollarSign, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '+8%' },
                        { label: 'Medicine Stock', value: '342', desc: '12 low stock', icon: Package, iconColor: 'text-violet-500', bgColor: 'bg-violet-50 dark:bg-violet-500/10', trend: null },
                        { label: 'Active Doctors', value: '18', desc: '3 on leave', icon: UserCheck, iconColor: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10', trend: null },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] hover:border-[#CCC] dark:hover:border-[#444] transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                {stat.trend && (
                                    <span className="flex items-center gap-0.5 text-[12px] text-emerald-500 font-medium">
                                        <TrendingUp className="w-3 h-3" />
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-[#171717] dark:text-white mb-1">{stat.value}</p>
                            <p className="text-[13px] text-[#666] dark:text-[#888]">{stat.label}</p>
                            <p className="text-[12px] text-[#999] mt-1">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Users */}
                    <div className="lg:col-span-2 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111]">
                        <div className="p-6 border-b border-[#EAEAEA] dark:border-[#333] flex items-center justify-between">
                            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">Recent Users</h2>
                            <Link href="/admin/users" className="text-[13px] text-[#0070F3] hover:underline flex items-center gap-1">
                                View all <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="divide-y divide-[#EAEAEA] dark:divide-[#333]">
                            {[
                                { name: 'Rajesh Sharma', email: 'rajesh@example.com', role: 'Patient', joined: '2 hours ago' },
                                { name: 'Dr. Emma Wilson', email: 'emma@hospital.com', role: 'Doctor', joined: '5 hours ago' },
                                { name: 'Amit Kumar', email: 'amit@example.com', role: 'Patient', joined: '1 day ago' },
                            ].map((user, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[14px] font-medium">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-medium text-[#171717] dark:text-white">{user.name}</p>
                                            <p className="text-[13px] text-[#666] dark:text-[#888]">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-0.5 text-[11px] font-medium rounded ${user.role === 'Doctor'
                                                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                                : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <span className="text-[13px] text-[#999]">{user.joined}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts & Quick Actions */}
                    <div className="space-y-4">
                        {/* Alerts */}
                        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-[14px] font-medium text-amber-800 dark:text-amber-400 mb-1">Low Stock Alert</h3>
                                    <p className="text-[13px] text-amber-700 dark:text-amber-300/80">12 medicines are running low. Review inventory soon.</p>
                                    <Link href="/admin/medicines" className="text-[13px] text-amber-600 dark:text-amber-400 font-medium hover:underline mt-2 inline-block">
                                        View Inventory →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                {[
                                    { icon: Users, label: 'Add New User', href: '/admin/users/new' },
                                    { icon: Pill, label: 'Update Stock', href: '/admin/medicines' },
                                    { icon: FlaskConical, label: 'Manage Tests', href: '/admin/tests' },
                                    { icon: DollarSign, label: 'View Reports', href: '/admin/billing' },
                                ].map((action, i) => (
                                    <Link
                                        key={i}
                                        href={action.href}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors group"
                                    >
                                        <action.icon className="w-4 h-4 text-[#666] dark:text-[#888]" />
                                        <span className="text-[14px] text-[#171717] dark:text-white">{action.label}</span>
                                        <ChevronRight className="w-4 h-4 ml-auto text-[#999] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
