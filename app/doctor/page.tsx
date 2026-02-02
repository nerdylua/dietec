import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DoctorDashboardClient from './doctor-dashboard-client'

export default async function DoctorDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is in doctors table (use service client to bypass RLS)
    const serviceClient = createServiceClient()
    const { data: doctorData } = await serviceClient
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!doctorData) {
        redirect('/login')
    }

    const { data: userData } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', user.id)
        .single()

    const fullName = userData?.full_name || 'Doctor'
    const firstName = fullName.split(' ')[0]

    return <DoctorDashboardClient firstName={firstName} fullName={fullName} />
}
