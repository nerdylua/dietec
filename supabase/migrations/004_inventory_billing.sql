-- =============================================
-- DIETEC Healthcare Database Schema
-- Migration 004: Inventory & Billing Tables
-- =============================================
-- DBMS Concepts: JSONB for flexible items, Decimal for currency, Aggregations

-- =============================================
-- MEDICINES CATALOG
-- =============================================
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  generic_name TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  manufacturer TEXT,
  description TEXT,
  prescription_required BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  category TEXT NOT NULL,
  dosage TEXT,
  side_effects TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_medicines_category ON public.medicines(category);
CREATE INDEX idx_medicines_name ON public.medicines(name);
CREATE INDEX idx_medicines_in_stock ON public.medicines(in_stock);
CREATE INDEX idx_medicines_prescription ON public.medicines(prescription_required);

-- =============================================
-- PRESCRIPTION ORDERS
-- =============================================
CREATE TABLE public.prescription_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  prescription_url TEXT,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prescription_orders_patient ON public.prescription_orders(patient_id);
CREATE INDEX idx_prescription_orders_status ON public.prescription_orders(status);

-- =============================================
-- BILLS
-- =============================================
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'partially_paid', 'cancelled', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'upi', 'insurance', 'other')),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  paid_at TIMESTAMPTZ,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bills_patient ON public.bills(patient_id);
CREATE INDEX idx_bills_appointment ON public.bills(appointment_id);
CREATE INDEX idx_bills_status ON public.bills(status);

-- =============================================
-- SEED DATA: Medicines
-- =============================================
INSERT INTO public.medicines (name, generic_name, price, original_price, manufacturer, description, prescription_required, in_stock, stock_quantity, rating, category, dosage) VALUES
('Paracetamol 500mg', 'Acetaminophen', 25.00, 35.00, 'PharmaCo', 'Pain relief and fever reducer.', false, true, 500, 4.5, 'Pain Relief', '1-2 tablets every 4-6 hours'),
('Amoxicillin 250mg', 'Amoxicillin', 120.00, NULL, 'MediLife', 'Antibiotic for bacterial infections.', true, true, 200, 4.7, 'Antibiotics', '1 capsule thrice daily'),
('Cetirizine 10mg', 'Cetirizine', 45.00, 60.00, 'AllergyFree', 'Antihistamine for allergy relief.', false, true, 300, 4.3, 'Allergy', '1 tablet daily'),
('Omeprazole 20mg', 'Omeprazole', 85.00, NULL, 'GastroCare', 'Reduces stomach acid.', true, true, 250, 4.6, 'Digestive', '1 capsule before breakfast'),
('Vitamin D3 1000IU', 'Cholecalciferol', 180.00, 220.00, 'WellnessPlus', 'Essential vitamin D supplement.', false, true, 400, 4.8, 'Supplements', '1 tablet daily'),
('Ibuprofen 400mg', 'Ibuprofen', 40.00, 55.00, 'PainAway', 'Anti-inflammatory and pain reliever.', false, true, 350, 4.6, 'Pain Relief', '1 tablet every 6-8 hours'),
('Metformin 500mg', 'Metformin HCl', 95.00, NULL, 'DiabetCare', 'Diabetes medication.', true, true, 180, 4.5, 'Diabetes', '1 tablet twice daily with meals'),
('Azithromycin 500mg', 'Azithromycin', 150.00, NULL, 'MediLife', 'Broad-spectrum antibiotic.', true, true, 150, 4.7, 'Antibiotics', '1 tablet daily for 3 days'),
('Calcium + Vitamin D', 'Calcium Carbonate', 220.00, 280.00, 'BoneStrong', 'Bone health supplement.', false, true, 320, 4.7, 'Supplements', '1 tablet twice daily'),
('Vitamin B-Complex', 'B Vitamins', 160.00, 200.00, 'WellnessPlus', 'Complete B vitamin complex.', false, true, 280, 4.5, 'Supplements', '1 tablet daily');
