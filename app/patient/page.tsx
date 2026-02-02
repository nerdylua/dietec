import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PatientDashboardClient } from './patient-dashboard-client'

export default async function PatientDashboard() {
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

    return <PatientDashboardClient user={userData || { email: user.email }} />
}
