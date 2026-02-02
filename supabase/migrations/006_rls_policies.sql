-- =============================================
-- DIETEC Healthcare Database Schema
-- Migration 006: Row Level Security (RLS) Policies
-- =============================================
-- DBMS Concepts: Access Control, Role-based permissions

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================
-- Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can see all users
CREATE POLICY "users_admin_select_all" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- PATIENTS TABLE POLICIES
-- =============================================
-- Patients can see their own record
CREATE POLICY "patients_select_own" ON public.patients
  FOR SELECT USING (user_id = auth.uid());

-- Patients can update their own record
CREATE POLICY "patients_update_own" ON public.patients
  FOR UPDATE USING (user_id = auth.uid());

-- Doctors can see patients they have appointments with
CREATE POLICY "patients_doctor_select" ON public.patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.doctors d ON a.doctor_id = d.id
      WHERE d.user_id = auth.uid() AND a.patient_id = patients.id
    )
  );

-- Admins can see all patients
CREATE POLICY "patients_admin_select" ON public.patients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- DOCTORS TABLE POLICIES
-- =============================================
-- Anyone authenticated can see doctors (for booking)
CREATE POLICY "doctors_select_all" ON public.doctors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Doctors can update their own record
CREATE POLICY "doctors_update_own" ON public.doctors
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- ADMINS TABLE POLICIES
-- =============================================
-- Admins can see other admins
CREATE POLICY "admins_select_all" ON public.admins
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- MEDICAL CONDITIONS POLICIES
-- =============================================
-- Patients can CRUD their own conditions
CREATE POLICY "conditions_patient_all" ON public.medical_conditions
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

-- Doctors can view conditions of their patients
CREATE POLICY "conditions_doctor_select" ON public.medical_conditions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.doctors d ON a.doctor_id = d.id
      WHERE d.user_id = auth.uid() AND a.patient_id = medical_conditions.patient_id
    )
  );

-- =============================================
-- ALLERGIES POLICIES
-- =============================================
CREATE POLICY "allergies_patient_all" ON public.allergies
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

CREATE POLICY "allergies_doctor_select" ON public.allergies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.doctors d ON a.doctor_id = d.id
      WHERE d.user_id = auth.uid() AND a.patient_id = allergies.patient_id
    )
  );

-- =============================================
-- SKIN PROBLEMS POLICIES
-- =============================================
CREATE POLICY "skin_patient_all" ON public.skin_problems
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

-- =============================================
-- DAILY HEALTH POLICIES
-- =============================================
CREATE POLICY "daily_health_patient_all" ON public.daily_health
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

-- =============================================
-- APPOINTMENTS POLICIES
-- =============================================
-- Patients can see their appointments
CREATE POLICY "appointments_patient_select" ON public.appointments
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

-- Patients can create appointments
CREATE POLICY "appointments_patient_insert" ON public.appointments
  FOR INSERT WITH CHECK (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

-- Patients can cancel their own appointments
CREATE POLICY "appointments_patient_update" ON public.appointments
  FOR UPDATE USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

-- Doctors can see their appointments
CREATE POLICY "appointments_doctor_select" ON public.appointments
  FOR SELECT USING (
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

-- Doctors can update appointments (confirm, complete)
CREATE POLICY "appointments_doctor_update" ON public.appointments
  FOR UPDATE USING (
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

-- Admins can see all appointments
CREATE POLICY "appointments_admin_all" ON public.appointments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- LAB TESTS POLICIES (Catalog - public read)
-- =============================================
CREATE POLICY "lab_tests_select_all" ON public.lab_tests
  FOR SELECT USING (is_active = true);

-- Admins can manage lab tests
CREATE POLICY "lab_tests_admin_all" ON public.lab_tests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- TEST BOOKINGS POLICIES
-- =============================================
CREATE POLICY "test_bookings_patient_all" ON public.test_bookings
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

CREATE POLICY "test_bookings_admin_all" ON public.test_bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- MEDICINES POLICIES (Catalog - public read)
-- =============================================
CREATE POLICY "medicines_select_all" ON public.medicines
  FOR SELECT USING (true);

CREATE POLICY "medicines_admin_all" ON public.medicines
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- PRESCRIPTION ORDERS POLICIES
-- =============================================
CREATE POLICY "orders_patient_all" ON public.prescription_orders
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

CREATE POLICY "orders_admin_all" ON public.prescription_orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- BILLS POLICIES
-- =============================================
CREATE POLICY "bills_patient_select" ON public.bills
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

CREATE POLICY "bills_admin_all" ON public.bills
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- =============================================
-- CHAT HISTORY POLICIES
-- =============================================
CREATE POLICY "chat_patient_all" ON public.chat_history
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );
