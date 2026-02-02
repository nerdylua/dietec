-- =============================================
-- DIETEC Healthcare Database Schema
-- Migration 003: Appointments & Tests Tables
-- =============================================
-- DBMS Concepts: Many-to-Many via Junction, Date/Time handling, Status workflows

-- =============================================
-- APPOINTMENTS
-- =============================================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  reason TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- Composite index for doctor's daily schedule
CREATE INDEX idx_appointments_doctor_date ON public.appointments(doctor_id, appointment_date);

-- =============================================
-- LAB TESTS CATALOG
-- =============================================
CREATE TABLE public.lab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  category TEXT NOT NULL,
  preparation_required BOOLEAN DEFAULT FALSE,
  preparation_instructions TEXT,
  fasting_required BOOLEAN DEFAULT FALSE,
  fasting_hours INTEGER,
  sample_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lab_tests_category ON public.lab_tests(category);
CREATE INDEX idx_lab_tests_active ON public.lab_tests(is_active);

-- =============================================
-- TEST BOOKINGS
-- =============================================
CREATE TABLE public.test_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.lab_tests(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  collection_type TEXT NOT NULL CHECK (collection_type IN ('home', 'lab')),
  collection_address TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sample_collected', 'processing', 'completed', 'cancelled')),
  result_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_test_bookings_patient ON public.test_bookings(patient_id);
CREATE INDEX idx_test_bookings_test ON public.test_bookings(test_id);
CREATE INDEX idx_test_bookings_date ON public.test_bookings(booking_date);
CREATE INDEX idx_test_bookings_status ON public.test_bookings(status);

-- =============================================
-- SEED DATA: Lab Tests
-- =============================================
INSERT INTO public.lab_tests (name, description, price, duration, category, preparation_required, preparation_instructions, fasting_required, fasting_hours, sample_type) VALUES
('Complete Blood Count (CBC)', 'Comprehensive blood test measuring red blood cells, white blood cells, and platelets.', 500.00, '24 hours', 'Blood Tests', false, NULL, false, NULL, 'Blood'),
('Lipid Profile', 'Measures cholesterol levels including HDL, LDL, and triglycerides.', 800.00, '24 hours', 'Blood Tests', true, 'Fast for 9-12 hours before test. Water is allowed.', true, 12, 'Blood'),
('Thyroid Function Test (TSH)', 'Measures thyroid-stimulating hormone levels.', 600.00, '48 hours', 'Hormone Tests', false, NULL, false, NULL, 'Blood'),
('Blood Glucose (Fasting)', 'Measures blood sugar levels after fasting.', 300.00, '12 hours', 'Blood Tests', true, 'Fast for 8-10 hours. Only water allowed.', true, 10, 'Blood'),
('HbA1c', 'Shows average blood sugar over 2-3 months.', 700.00, '24 hours', 'Blood Tests', false, NULL, false, NULL, 'Blood'),
('Liver Function Test (LFT)', 'Assesses liver health with ALT, AST, bilirubin.', 900.00, '24 hours', 'Blood Tests', true, 'Fast for 8-12 hours.', true, 10, 'Blood'),
('Kidney Function Test (KFT)', 'Measures creatinine and urea levels.', 850.00, '24 hours', 'Blood Tests', false, NULL, false, NULL, 'Blood'),
('Vitamin D Test', 'Measures vitamin D levels for bone health.', 1200.00, '48 hours', 'Vitamin Tests', false, NULL, false, NULL, 'Blood'),
('Vitamin B12 Test', 'Checks B12 levels for nerve health.', 1000.00, '48 hours', 'Vitamin Tests', false, NULL, false, NULL, 'Blood'),
('Urine Routine', 'Comprehensive urine analysis.', 250.00, '12 hours', 'Urine Tests', false, 'Collect first morning sample.', false, NULL, 'Urine'),
('ECG', 'Records heart electrical activity.', 400.00, '30 minutes', 'Cardiac Tests', false, NULL, false, NULL, 'N/A'),
('Chest X-Ray', 'Imaging for lungs and heart.', 600.00, '2 hours', 'Imaging', false, 'Remove metal objects.', false, NULL, 'N/A');
