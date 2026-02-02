'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    // Get user role to redirect appropriately
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        revalidatePath('/', 'layout')

        if (userData?.role === 'doctor') {
            redirect('/doctor')
        } else {
            redirect('/patient')
        }
    }

    redirect('/patient')
}

export async function adminLogin(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    // Check if user exists in admins table
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        await supabase.auth.signOut()
        return { error: 'Authentication failed' }
    }

    // Use service client to bypass RLS and check admins table
    const serviceClient = createServiceClient()
    const { data: adminData, error: adminError } = await serviceClient
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (adminError || !adminData) {
        // Not an admin - sign out and return error
        await supabase.auth.signOut()
        return { error: 'Access denied. You are not authorized as an administrator.' }
    }

    // User is a valid admin
    revalidatePath('/', 'layout')
    redirect('/admin')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'patient',
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/patient')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
