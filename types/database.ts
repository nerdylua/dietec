export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            admins: {
                Row: {
                    id: string
                    user_id: string | null
                    department: string | null
                    permissions: Json | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    department?: string | null
                    permissions?: Json | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    department?: string | null
                    permissions?: Json | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "admins_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            allergies: {
                Row: {
                    id: string
                    patient_id: string
                    allergen: string
                    allergy_type: "food" | "drug" | "environmental" | "other" | null
                    severity: "mild" | "moderate" | "severe"
                    symptoms: Json | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    patient_id: string
                    allergen: string
                    allergy_type?: "food" | "drug" | "environmental" | "other" | null
                    severity?: "mild" | "moderate" | "severe"
                    symptoms?: Json | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    patient_id?: string
                    allergen?: string
                    allergy_type?: "food" | "drug" | "environmental" | "other" | null
                    severity?: "mild" | "moderate" | "severe"
                    symptoms?: Json | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "allergies_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            appointments: {
                Row: {
                    id: string
                    patient_id: string
                    doctor_id: string
                    appointment_date: string
                    appointment_time: string
                    duration_minutes: number | null
                    reason: string | null
                    status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
                    notes: string | null
                    cancelled_at: string | null
                    cancelled_reason: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    patient_id: string
                    doctor_id: string
                    appointment_date: string
                    appointment_time: string
                    duration_minutes?: number | null
                    reason?: string | null
                    status?: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
                    notes?: string | null
                    cancelled_at?: string | null
                    cancelled_reason?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    patient_id?: string
                    doctor_id?: string
                    appointment_date?: string
                    appointment_time?: string
                    duration_minutes?: number | null
                    reason?: string | null
                    status?: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
                    notes?: string | null
                    cancelled_at?: string | null
                    cancelled_reason?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "appointments_doctor_id_fkey"
                        columns: ["doctor_id"]
                        isOneToOne: false
                        referencedRelation: "doctors"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "appointments_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            bills: {
                Row: {
                    id: string
                    bill_number: string
                    patient_id: string
                    appointment_id: string | null
                    items: Json
                    subtotal: number
                    tax: number | null
                    discount: number | null
                    total: number
                    status: "pending" | "paid" | "partially_paid" | "cancelled" | "refunded"
                    payment_method: "cash" | "card" | "upi" | "insurance" | "other" | null
                    paid_amount: number | null
                    paid_at: string | null
                    due_date: string | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    bill_number?: string
                    patient_id: string
                    appointment_id?: string | null
                    items?: Json
                    subtotal: number
                    tax?: number | null
                    discount?: number | null
                    total: number
                    status?: "pending" | "paid" | "partially_paid" | "cancelled" | "refunded"
                    payment_method?: "cash" | "card" | "upi" | "insurance" | "other" | null
                    paid_amount?: number | null
                    paid_at?: string | null
                    due_date?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    bill_number?: string
                    patient_id?: string
                    appointment_id?: string | null
                    items?: Json
                    subtotal?: number
                    tax?: number | null
                    discount?: number | null
                    total?: number
                    status?: "pending" | "paid" | "partially_paid" | "cancelled" | "refunded"
                    payment_method?: "cash" | "card" | "upi" | "insurance" | "other" | null
                    paid_amount?: number | null
                    paid_at?: string | null
                    due_date?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "bills_appointment_id_fkey"
                        columns: ["appointment_id"]
                        isOneToOne: false
                        referencedRelation: "appointments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "bills_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            chat_history: {
                Row: {
                    id: string
                    patient_id: string
                    message: string
                    response: string
                    chat_type: "medical" | "nutrition" | "general" | "voice" | null
                    tokens_used: number | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    patient_id: string
                    message: string
                    response: string
                    chat_type?: "medical" | "nutrition" | "general" | "voice" | null
                    tokens_used?: number | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    patient_id?: string
                    message?: string
                    response?: string
                    chat_type?: "medical" | "nutrition" | "general" | "voice" | null
                    tokens_used?: number | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "chat_history_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            daily_health: {
                Row: {
                    id: string
                    patient_id: string
                    date: string
                    steps: number | null
                    steps_goal: number | null
                    water_glasses: number | null
                    water_goal: number | null
                    sleep_hours: number | null
                    weight_kg: number | null
                    mood: "great" | "good" | "okay" | "bad" | "terrible" | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    patient_id: string
                    date?: string
                    steps?: number | null
                    steps_goal?: number | null
                    water_glasses?: number | null
                    water_goal?: number | null
                    sleep_hours?: number | null
                    weight_kg?: number | null
                    mood?: "great" | "good" | "okay" | "bad" | "terrible" | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    patient_id?: string
                    date?: string
                    steps?: number | null
                    steps_goal?: number | null
                    water_glasses?: number | null
                    water_goal?: number | null
                    sleep_hours?: number | null
                    weight_kg?: number | null
                    mood?: "great" | "good" | "okay" | "bad" | "terrible" | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "daily_health_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            doctors: {
                Row: {
                    id: string
                    user_id: string | null
                    specialization: string
                    qualification: string
                    experience_years: number | null
                    consultation_fee: number | null
                    bio: string | null
                    available_days: string[] | null
                    available_from: string | null
                    available_to: string | null
                    max_appointments_per_day: number | null
                    status: "active" | "inactive" | "on_leave"
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    specialization: string
                    qualification: string
                    experience_years?: number | null
                    consultation_fee?: number | null
                    bio?: string | null
                    available_days?: string[] | null
                    available_from?: string | null
                    available_to?: string | null
                    max_appointments_per_day?: number | null
                    status?: "active" | "inactive" | "on_leave"
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    specialization?: string
                    qualification?: string
                    experience_years?: number | null
                    consultation_fee?: number | null
                    bio?: string | null
                    available_days?: string[] | null
                    available_from?: string | null
                    available_to?: string | null
                    max_appointments_per_day?: number | null
                    status?: "active" | "inactive" | "on_leave"
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "doctors_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            lab_tests: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    duration: string | null
                    category: string
                    preparation_required: boolean | null
                    preparation_instructions: string | null
                    fasting_required: boolean | null
                    fasting_hours: number | null
                    sample_type: string | null
                    is_active: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    duration?: string | null
                    category: string
                    preparation_required?: boolean | null
                    preparation_instructions?: string | null
                    fasting_required?: boolean | null
                    fasting_hours?: number | null
                    sample_type?: string | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    duration?: string | null
                    category?: string
                    preparation_required?: boolean | null
                    preparation_instructions?: string | null
                    fasting_required?: boolean | null
                    fasting_hours?: number | null
                    sample_type?: string | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            medical_conditions: {
                Row: {
                    id: string
                    patient_id: string
                    name: string
                    diagnosed_date: string | null
                    severity: "mild" | "moderate" | "severe"
                    is_active: boolean | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    patient_id: string
                    name: string
                    diagnosed_date?: string | null
                    severity?: "mild" | "moderate" | "severe"
                    is_active?: boolean | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    patient_id?: string
                    name?: string
                    diagnosed_date?: string | null
                    severity?: "mild" | "moderate" | "severe"
                    is_active?: boolean | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "medical_conditions_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            medicines: {
                Row: {
                    id: string
                    name: string
                    generic_name: string | null
                    price: number
                    original_price: number | null
                    manufacturer: string | null
                    description: string | null
                    prescription_required: boolean | null
                    in_stock: boolean | null
                    stock_quantity: number | null
                    rating: number | null
                    category: string
                    dosage: string | null
                    side_effects: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    generic_name?: string | null
                    price: number
                    original_price?: number | null
                    manufacturer?: string | null
                    description?: string | null
                    prescription_required?: boolean | null
                    in_stock?: boolean | null
                    stock_quantity?: number | null
                    rating?: number | null
                    category: string
                    dosage?: string | null
                    side_effects?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    generic_name?: string | null
                    price?: number
                    original_price?: number | null
                    manufacturer?: string | null
                    description?: string | null
                    prescription_required?: boolean | null
                    in_stock?: boolean | null
                    stock_quantity?: number | null
                    rating?: number | null
                    category?: string
                    dosage?: string | null
                    side_effects?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            patients: {
                Row: {
                    id: string
                    user_id: string | null
                    blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null
                    height_cm: number | null
                    weight_kg: number | null
                    emergency_contact_name: string | null
                    emergency_contact_phone: string | null
                    emergency_contact_relation: string | null
                    insurance_provider: string | null
                    insurance_id: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null
                    height_cm?: number | null
                    weight_kg?: number | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    emergency_contact_relation?: string | null
                    insurance_provider?: string | null
                    insurance_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null
                    height_cm?: number | null
                    weight_kg?: number | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    emergency_contact_relation?: string | null
                    insurance_provider?: string | null
                    insurance_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "patients_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            prescription_orders: {
                Row: {
                    id: string
                    order_number: string
                    patient_id: string
                    items: Json
                    subtotal: number
                    tax: number | null
                    discount: number | null
                    total: number
                    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
                    prescription_url: string | null
                    delivery_address: string | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    order_number?: string
                    patient_id: string
                    items?: Json
                    subtotal: number
                    tax?: number | null
                    discount?: number | null
                    total: number
                    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
                    prescription_url?: string | null
                    delivery_address?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    order_number?: string
                    patient_id?: string
                    items?: Json
                    subtotal?: number
                    tax?: number | null
                    discount?: number | null
                    total?: number
                    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
                    prescription_url?: string | null
                    delivery_address?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "prescription_orders_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            skin_problems: {
                Row: {
                    id: string
                    patient_id: string
                    condition: string
                    body_part: string | null
                    severity: "mild" | "moderate" | "severe"
                    duration: string | null
                    treatment: string | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    patient_id: string
                    condition: string
                    body_part?: string | null
                    severity?: "mild" | "moderate" | "severe"
                    duration?: string | null
                    treatment?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    patient_id?: string
                    condition?: string
                    body_part?: string | null
                    severity?: "mild" | "moderate" | "severe"
                    duration?: string | null
                    treatment?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "skin_problems_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            test_bookings: {
                Row: {
                    id: string
                    booking_number: string
                    patient_id: string
                    test_id: string
                    booking_date: string
                    booking_time: string
                    collection_type: "home" | "lab"
                    collection_address: string | null
                    status: "scheduled" | "sample_collected" | "processing" | "completed" | "cancelled"
                    result_url: string | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    booking_number?: string
                    patient_id: string
                    test_id: string
                    booking_date: string
                    booking_time: string
                    collection_type: "home" | "lab"
                    collection_address?: string | null
                    status?: "scheduled" | "sample_collected" | "processing" | "completed" | "cancelled"
                    result_url?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    booking_number?: string
                    patient_id?: string
                    test_id?: string
                    booking_date?: string
                    booking_time?: string
                    collection_type?: "home" | "lab"
                    collection_address?: string | null
                    status?: "scheduled" | "sample_collected" | "processing" | "completed" | "cancelled"
                    result_url?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "test_bookings_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "patients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "test_bookings_test_id_fkey"
                        columns: ["test_id"]
                        isOneToOne: false
                        referencedRelation: "lab_tests"
                        referencedColumns: ["id"]
                    }
                ]
            }
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: "patient" | "doctor" | "admin"
                    phone: string | null
                    date_of_birth: string | null
                    gender: "male" | "female" | "other" | null
                    address: string | null
                    is_profile_complete: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: "patient" | "doctor" | "admin"
                    phone?: string | null
                    date_of_birth?: string | null
                    gender?: "male" | "female" | "other" | null
                    address?: string | null
                    is_profile_complete?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: "patient" | "doctor" | "admin"
                    phone?: string | null
                    date_of_birth?: string | null
                    gender?: "male" | "female" | "other" | null
                    address?: string | null
                    is_profile_complete?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            generate_bill_number: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
            generate_booking_number: {
                Args: { prefix: string }
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Helper types for common use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience type aliases
export type User = Tables<'users'>
export type Patient = Tables<'patients'>
export type Doctor = Tables<'doctors'>
export type Admin = Tables<'admins'>
export type Appointment = Tables<'appointments'>
export type Bill = Tables<'bills'>
export type LabTest = Tables<'lab_tests'>
export type TestBooking = Tables<'test_bookings'>
export type Medicine = Tables<'medicines'>
export type PrescriptionOrder = Tables<'prescription_orders'>
export type MedicalCondition = Tables<'medical_conditions'>
export type Allergy = Tables<'allergies'>
export type SkinProblem = Tables<'skin_problems'>
export type DailyHealth = Tables<'daily_health'>
export type ChatHistory = Tables<'chat_history'>

// Role type
export type UserRole = 'patient' | 'doctor' | 'admin'
