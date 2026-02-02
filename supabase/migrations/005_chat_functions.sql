-- =============================================
-- DIETEC Healthcare Database Schema
-- Migration 005: AI Chat & Functions
-- =============================================
-- DBMS Concepts: Chat history storage, Triggers for automation

-- =============================================
-- CHAT HISTORY (for AI Medical Advisor)
-- =============================================
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  chat_type TEXT DEFAULT 'general' CHECK (chat_type IN ('medical', 'nutrition', 'general', 'voice')),
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_patient ON public.chat_history(patient_id);
CREATE INDEX idx_chat_history_type ON public.chat_history(chat_type);
CREATE INDEX idx_chat_history_created ON public.chat_history(created_at DESC);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to generate booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number(prefix TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 6));
END;
$$ LANGUAGE plpgsql;

-- Function to generate bill numbers
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BILL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 6));
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_patients_timestamp BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_doctors_timestamp BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_admins_timestamp BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_medical_conditions_timestamp BEFORE UPDATE ON public.medical_conditions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_allergies_timestamp BEFORE UPDATE ON public.allergies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_skin_problems_timestamp BEFORE UPDATE ON public.skin_problems FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_daily_health_timestamp BEFORE UPDATE ON public.daily_health FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_appointments_timestamp BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lab_tests_timestamp BEFORE UPDATE ON public.lab_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_test_bookings_timestamp BEFORE UPDATE ON public.test_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_medicines_timestamp BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_prescription_orders_timestamp BEFORE UPDATE ON public.prescription_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bills_timestamp BEFORE UPDATE ON public.bills FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user record
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  
  -- Create patient record for patient role
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'patient') = 'patient' THEN
    INSERT INTO public.patients (user_id) VALUES (NEW.id);
  ELSIF NEW.raw_user_meta_data->>'role' = 'doctor' THEN
    INSERT INTO public.doctors (user_id, specialization, qualification) 
    VALUES (NEW.id, 'General', 'MBBS');
  ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    INSERT INTO public.admins (user_id) VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- AUTO-GENERATE BOOKING NUMBERS
-- =============================================
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number = generate_booking_number('TB');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_test_booking_number
  BEFORE INSERT ON public.test_bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_number();

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number = generate_booking_number('ORD');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_prescription_order_number
  BEFORE INSERT ON public.prescription_orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

CREATE OR REPLACE FUNCTION set_bill_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.bill_number IS NULL THEN
    NEW.bill_number = generate_bill_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bill_number_trigger
  BEFORE INSERT ON public.bills
  FOR EACH ROW EXECUTE FUNCTION set_bill_number();
