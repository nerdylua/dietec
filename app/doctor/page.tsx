import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/app/(auth)/actions'
import Link from 'next/link'
import {
    LogOut,
    Home,
    Calendar,
    Users,
    ClipboardList,
    FileText,
    Activity,
    ChevronRight,
    Bell,
    Search,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react'

const navItems = [
    { icon: Home, label: 'Overview', href: '/doctor', active: true },
    { icon: Calendar, label: 'Appointments', href: '/doctor/appointments' },
    { icon: Users, label: 'Patients', href: '/doctor/patients' },
    { icon: ClipboardList, label: 'Prescriptions', href: '/doctor/prescriptions' },
    { icon: FileText, label: 'Reports', href: '/doctor/reports' },
]

export default async function DoctorDashboard() {
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

    const firstName = userData?.full_name?.split(' ')[0] || 'Doctor'

    // Mock data for demonstration
    const todayAppointments = [
        { id: 1, patient: 'Rajesh Sharma', time: '09:00 AM', type: 'Consultation', status: 'upcoming' },
        { id: 2, patient: 'Emma Wilson', time: '10:30 AM', type: 'Follow-up', status: 'upcoming' },
        { id: 3, patient: 'Amit Kumar', time: '02:00 PM', type: 'Check-up', status: 'upcoming' },
    ]

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
                        <Link href="/doctor" className="flex items-center gap-2">
                            <svg
                                height="20"
                                viewBox="0 0 76 65"
                                fill="currentColor"
                                className="text-[#171717] dark:text-white"
                            >
                                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                            </svg>
                            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">DIETEC</span>
                            <span className="ml-2 px-2 py-0.5 text-[11px] font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded">Doctor</span>
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
                            <span>Search patients...</span>
                            <kbd className="ml-2 px-1.5 py-0.5 text-[11px] bg-[#F5F5F5] dark:bg-[#222] rounded">⌘K</kbd>
                        </button>

                        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                        </button>

                        <ThemeToggle />

                        <div className="h-6 w-px bg-[#EAEAEA] dark:bg-[#333] mx-1" />

                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 text-[14px] text-[#666] dark:text-[#888] hover:text-[#171717] dark:hover:text-white transition-colors"
                            >
                                <span className="hidden sm:inline">Dr. {firstName}</span>
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
                        Good morning, Dr. {firstName}
                    </h1>
                    <p className="text-[15px] text-[#666] dark:text-[#888]">
                        You have 3 appointments scheduled for today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Today\'s Appointments', value: '3', desc: 'Next at 09:00 AM', icon: Calendar, iconColor: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
                        { label: 'Total Patients', value: '124', desc: '12 this week', icon: Users, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10' },
                        { label: 'Pending Reports', value: '5', desc: 'Review required', icon: FileText, iconColor: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10' },
                        { label: 'Completed Today', value: '0', desc: 'Start your day', icon: CheckCircle2, iconColor: 'text-violet-500', bgColor: 'bg-violet-50 dark:bg-violet-500/10' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] hover:border-[#CCC] dark:hover:border-[#444] transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-[#171717] dark:text-white mb-1">{stat.value}</p>
                            <p className="text-[13px] text-[#666] dark:text-[#888]">{stat.label}</p>
                            <p className="text-[12px] text-[#999] mt-1">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Schedule */}
                    <div className="lg:col-span-2 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111]">
                        <div className="p-6 border-b border-[#EAEAEA] dark:border-[#333] flex items-center justify-between">
                            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#171717] dark:text-white">Today&apos;s Schedule</h2>
                            <Link href="/doctor/appointments" className="text-[13px] text-[#0070F3] hover:underline flex items-center gap-1">
                                View all <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="divide-y divide-[#EAEAEA] dark:divide-[#333]">
                            {todayAppointments.map((apt) => (
                                <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[14px] font-medium">
                                            {apt.patient.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-medium text-[#171717] dark:text-white">{apt.patient}</p>
                                            <p className="text-[13px] text-[#666] dark:text-[#888]">{apt.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[13px] text-[#666] dark:text-[#888]">
                                            <Clock className="w-4 h-4" />
                                            {apt.time}
                                        </div>
                                        <button className="h-8 px-3 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[13px] font-medium hover:bg-[#333] dark:hover:bg-[#EAEAEA] transition-colors">
                                            Start
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                {[
                                    { icon: ClipboardList, label: 'Write Prescription', href: '/doctor/prescriptions/new' },
                                    { icon: FileText, label: 'Create Report', href: '/doctor/reports/new' },
                                    { icon: Users, label: 'Add Patient', href: '/doctor/patients/new' },
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

                        {/* Recent Activity */}
                        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] p-6">
                            <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: CheckCircle2, text: 'Completed consultation', time: '2h ago', color: 'text-emerald-500' },
                                    { icon: ClipboardList, text: 'Prescription sent', time: '3h ago', color: 'text-blue-500' },
                                    { icon: XCircle, text: 'Appointment cancelled', time: '5h ago', color: 'text-red-500' },
                                ].map((activity, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
                                        <div className="flex-1">
                                            <p className="text-[13px] text-[#171717] dark:text-white">{activity.text}</p>
                                            <p className="text-[12px] text-[#999]">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
