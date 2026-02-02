import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './admin-dashboard-client'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is in admins table (use service client to bypass RLS)
    const serviceClient = createServiceClient()
    const { data: adminData } = await serviceClient
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!adminData) {
        redirect('/login')
    }

    const { data: userData } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', user.id)
        .single()

    const firstName = userData?.full_name?.split(' ')[0] || 'Admin'

    return <AdminDashboardClient firstName={firstName} />
}
