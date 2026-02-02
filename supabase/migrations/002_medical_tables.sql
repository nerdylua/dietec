-- =============================================
-- DIETEC Healthcare Database Schema
-- Migration 002: Medical Records Tables
-- =============================================
-- DBMS Concepts: One-to-Many Relationships, Enums via CHECK, JSONB for flexible data

-- =============================================
-- MEDICAL CONDITIONS
-- =============================================
CREATE TABLE public.medical_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  diagnosed_date DATE,
  severity TEXT DEFAULT 'mild' CHECK (severity IN ('mild', 'moderate', 'severe')),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_medical_conditions_patient ON public.medical_conditions(patient_id);
CREATE INDEX idx_medical_conditions_active ON public.medical_conditions(is_active);

-- =============================================
-- ALLERGIES
-- =============================================
CREATE TABLE public.allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  allergen TEXT NOT NULL,
  allergy_type TEXT CHECK (allergy_type IN ('food', 'drug', 'environmental', 'other')),
  severity TEXT DEFAULT 'mild' CHECK (severity IN ('mild', 'moderate', 'severe')),
  symptoms JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_allergies_patient ON public.allergies(patient_id);

-- =============================================
-- SKIN PROBLEMS
-- =============================================
CREATE TABLE public.skin_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  condition TEXT NOT NULL,
  body_part TEXT,
  severity TEXT DEFAULT 'mild' CHECK (severity IN ('mild', 'moderate', 'severe')),
  duration TEXT,
  treatment TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skin_problems_patient ON public.skin_problems(patient_id);

-- =============================================
-- DAILY HEALTH TRACKING
-- =============================================
CREATE TABLE public.daily_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER DEFAULT 0,
  steps_goal INTEGER DEFAULT 10000,
  water_glasses INTEGER DEFAULT 0,
  water_goal INTEGER DEFAULT 8,
  sleep_hours DECIMAL(3,1),
  weight_kg DECIMAL(5,2),
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'bad', 'terrible')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(patient_id, date)
);

CREATE INDEX idx_daily_health_patient ON public.daily_health(patient_id);
CREATE INDEX idx_daily_health_date ON public.daily_health(date);
