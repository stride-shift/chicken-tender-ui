-- Chicken Tender - Supabase Production Schema (Base)
-- Purpose: Cloud database schema for client-facing tender delivery platform
-- Date: 2026-01-28

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LOOKUP TABLES

-- Provinces
CREATE TABLE public.provinces (
    province_id INTEGER PRIMARY KEY,
    province_name VARCHAR(100) NOT NULL,
    source_system VARCHAR(50) NOT NULL DEFAULT 'etenders_za',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.provinces IS 'South African provinces lookup table';

INSERT INTO public.provinces (province_id, province_name) VALUES
    (1, 'Eastern Cape'),
    (2, 'Free State'),
    (3, 'Gauteng'),
    (4, 'KwaZulu-Natal'),
    (5, 'Limpopo'),
    (6, 'Mpumalanga'),
    (7, 'Northern Cape'),
    (8, 'North West'),
    (9, 'Western Cape');

-- Departments
CREATE TABLE public.departments (
    department_id INTEGER PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    source_system VARCHAR(50) NOT NULL DEFAULT 'etenders_za',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.departments IS 'Government departments lookup table (national and provincial)';

-- Categories
CREATE TABLE public.categories (
    category_id INTEGER PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    source_system VARCHAR(50) NOT NULL DEFAULT 'etenders_za',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.categories IS 'Tender categories lookup table';

-- CORE TENDER TABLE

CREATE TABLE public.tenders (
    tender_pk SERIAL PRIMARY KEY,
    -- Source identification
    source_tender_id VARCHAR(255) NOT NULL UNIQUE,
    source_system VARCHAR(100) NOT NULL DEFAULT 'etenders_za',
    -- Core tender info
    tender_no VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    current_status VARCHAR(50) NOT NULL CHECK (current_status IN ('active', 'awarded', 'closed', 'cancelled')),
    date_published TIMESTAMPTZ,
    closing_date TIMESTAMPTZ,
    -- Classification
    category_id INTEGER REFERENCES public.categories(category_id),
    category_name VARCHAR(255),
    tender_type VARCHAR(100),
    organ_of_state VARCHAR(255),
    -- Contact info
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(100),
    -- Location
    province_id INTEGER REFERENCES public.provinces(province_id),
    province_name VARCHAR(100),
    department_id INTEGER REFERENCES public.departments(department_id),
    department_name VARCHAR(255),
    town VARCHAR(255),
    delivery_address TEXT,
    -- Briefing session
    briefing_datetime TIMESTAMPTZ,
    briefing_venue TEXT,
    is_briefing_compulsory BOOLEAN DEFAULT false,
    has_briefing_session BOOLEAN DEFAULT false,
    -- Submission rules
    allows_esubmission BOOLEAN DEFAULT false,
    -- Full structured data preserved for reference
    structured_data JSONB,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ
);

-- Base indexes for tenders table
CREATE INDEX idx_tenders_status ON public.tenders(current_status);
CREATE INDEX idx_tenders_closing_date ON public.tenders(closing_date);
CREATE INDEX idx_tenders_province ON public.tenders(province_id);
CREATE INDEX idx_tenders_department ON public.tenders(department_id);
CREATE INDEX idx_tenders_category ON public.tenders(category_id);
CREATE INDEX idx_tenders_source_id ON public.tenders(source_tender_id);
CREATE INDEX idx_tenders_briefing ON public.tenders(briefing_datetime) WHERE briefing_datetime IS NOT NULL;
CREATE INDEX idx_tenders_description_fts ON public.tenders USING gin(to_tsvector('english', description));

COMMENT ON TABLE public.tenders IS 'Core tender information synced from source systems';

-- TENDER DOCUMENTS

CREATE TABLE public.tender_documents (
    document_pk SERIAL PRIMARY KEY,
    tender_pk INTEGER NOT NULL REFERENCES public.tenders(tender_pk) ON DELETE CASCADE,
    source_document_id VARCHAR(255),
    file_name VARCHAR(500) NOT NULL,
    file_extension VARCHAR(20),
    file_size BIGINT,
    document_type VARCHAR(50),
    download_url TEXT,
    processing_status VARCHAR(20) DEFAULT 'available'
        CHECK (processing_status IN ('available', 'processing', 'unavailable')),
    date_created TIMESTAMPTZ,
    date_modified TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tender_document UNIQUE (tender_pk, source_document_id)
);

CREATE INDEX idx_documents_tender ON public.tender_documents(tender_pk);
CREATE INDEX idx_documents_type ON public.tender_documents(document_type);
CREATE INDEX idx_documents_status ON public.tender_documents(processing_status);

COMMENT ON TABLE public.tender_documents IS 'Document metadata for tender attachments (files stored locally, not in Supabase)';
COMMENT ON COLUMN public.tender_documents.source_document_id IS 'Unique identifier from source system (e.g., eTenders document ID)';
COMMENT ON COLUMN public.tender_documents.processing_status IS 'Availability status: available (ready to download), processing (being fetched), unavailable (failed or removed)';

-- AI ANALYSIS TABLES

-- Tender Syntheses
CREATE TABLE public.tender_syntheses (
    synthesis_pk SERIAL PRIMARY KEY,
    tender_pk INTEGER NOT NULL REFERENCES public.tenders(tender_pk) ON DELETE CASCADE,
    synthesis_type VARCHAR(50) NOT NULL DEFAULT 'comprehensive'
        CHECK (synthesis_type IN ('comprehensive', 'scope_of_work', 'requirements', 'evaluation_criteria')),
    generated_title TEXT,
    final_report_text TEXT NOT NULL,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
    quality_explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_syntheses_tender ON public.tender_syntheses(tender_pk);
CREATE INDEX idx_syntheses_type ON public.tender_syntheses(synthesis_type);
CREATE UNIQUE INDEX idx_syntheses_tender_type ON public.tender_syntheses(tender_pk, synthesis_type);

COMMENT ON TABLE public.tender_syntheses IS 'AI-generated tender summaries and analyses';

-- CHANGE TRACKING

CREATE TABLE public.tender_changes (
    change_pk SERIAL PRIMARY KEY,
    tender_pk INTEGER NOT NULL REFERENCES public.tenders(tender_pk) ON DELETE CASCADE,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('metadata', 'document')),
    highest_importance VARCHAR(10) NOT NULL CHECK (highest_importance IN ('high', 'medium', 'low')),
    changes_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_changes_tender ON public.tender_changes(tender_pk);
CREATE INDEX idx_changes_observed ON public.tender_changes(observed_at DESC);
CREATE INDEX idx_changes_importance ON public.tender_changes(highest_importance);
CREATE INDEX idx_changes_high_importance ON public.tender_changes(tender_pk, observed_at DESC)
    WHERE highest_importance = 'high';

ALTER TABLE public.tender_changes
ADD CONSTRAINT uq_tender_change UNIQUE (tender_pk, observed_at, change_type);

COMMENT ON TABLE public.tender_changes IS 'Field-level change history for tenders with importance classification';
COMMENT ON CONSTRAINT uq_tender_change ON public.tender_changes IS 'Ensures each change event is recorded only once per tender. Enables idempotent sync operations.';

-- CLIENT & RUBRIC SYSTEM

-- Clients
CREATE TABLE public.clients (
    client_pk SERIAL PRIMARY KEY,
    client_code VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_code ON public.clients(client_code);
CREATE INDEX idx_clients_active ON public.clients(is_active) WHERE is_active = true;

COMMENT ON TABLE public.clients IS 'Client organizations using the tender platform';

-- Client Rubrics
CREATE TABLE public.client_rubrics (
    rubric_pk SERIAL PRIMARY KEY,
    client_pk INTEGER NOT NULL REFERENCES public.clients(client_pk) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    knockouts JSONB NOT NULL,
    criteria JSONB NOT NULL,
    scoring_config JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_client_rubric_version UNIQUE (client_pk, version)
);

CREATE INDEX idx_rubrics_client ON public.client_rubrics(client_pk);
CREATE INDEX idx_rubrics_active ON public.client_rubrics(client_pk, is_active) WHERE is_active = true;

COMMENT ON TABLE public.client_rubrics IS 'Client-specific evaluation rubrics with knockout questions and scoring criteria';

-- EVALUATIONS

CREATE TABLE public.tender_evaluations (
    evaluation_pk SERIAL PRIMARY KEY,
    tender_pk INTEGER NOT NULL REFERENCES public.tenders(tender_pk) ON DELETE CASCADE,
    rubric_pk INTEGER NOT NULL REFERENCES public.client_rubrics(rubric_pk) ON DELETE RESTRICT,
    synthesis_pk INTEGER REFERENCES public.tender_syntheses(synthesis_pk) ON DELETE SET NULL,
    evaluation_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (evaluation_status IN ('pending', 'processing', 'completed', 'failed')),
    evaluation_error TEXT,
    knockout_passed BOOLEAN,
    knockout_results JSONB,
    criteria_results JSONB,
    score_earned INTEGER,
    score_possible INTEGER,
    score_percentage DECIMAL(5,2) CHECK (score_percentage IS NULL OR (score_percentage >= 0 AND score_percentage <= 100)),
    recommendation VARCHAR(30) CHECK (recommendation IN ('not_recommended', 'worth_reviewing', 'good_fit', 'excellent_fit')),
    llm_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tender_rubric_evaluation UNIQUE (tender_pk, rubric_pk)
);

CREATE INDEX idx_evaluations_tender ON public.tender_evaluations(tender_pk);
CREATE INDEX idx_evaluations_rubric ON public.tender_evaluations(rubric_pk);
CREATE INDEX idx_evaluations_status ON public.tender_evaluations(evaluation_status);
CREATE INDEX idx_evaluations_recommendation ON public.tender_evaluations(recommendation) WHERE recommendation IS NOT NULL;
CREATE INDEX idx_evaluations_score ON public.tender_evaluations(score_percentage DESC) WHERE score_percentage IS NOT NULL;
CREATE INDEX idx_evaluations_excellent ON public.tender_evaluations(rubric_pk, score_percentage DESC)
    WHERE recommendation = 'excellent_fit';
CREATE INDEX idx_evaluations_good ON public.tender_evaluations(rubric_pk, score_percentage DESC)
    WHERE recommendation IN ('excellent_fit', 'good_fit');

COMMENT ON TABLE public.tender_evaluations IS 'AI-generated tender relevance assessments against client rubrics';

-- USER AUTHENTICATION

-- User Profiles
CREATE TABLE public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    client_pk INTEGER REFERENCES public.clients(client_pk) ON DELETE SET NULL,
    display_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer')),
    email_notifications BOOLEAN DEFAULT true,
    notification_threshold VARCHAR(30) DEFAULT 'good_fit'
        CHECK (notification_threshold IN ('excellent_fit', 'good_fit', 'worth_reviewing', 'not_recommended')),
    is_strideshift BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_client ON public.user_profiles(client_pk);

COMMENT ON TABLE public.user_profiles IS 'Extended user profiles linking Supabase auth to clients';
COMMENT ON COLUMN public.user_profiles.is_strideshift IS 'Flag indicating StrideShift employees (@strideshift.ai) with super-admin access';

-- HELPER FUNCTIONS

CREATE OR REPLACE FUNCTION public.get_user_client_pk()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT client_pk FROM public.user_profiles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.get_user_client_pk() IS 'Returns the client_pk for the authenticated user';

CREATE OR REPLACE FUNCTION public.is_strideshift_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE((SELECT is_strideshift FROM public.user_profiles WHERE user_id = auth.uid()), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.is_strideshift_user() IS 'Returns true if authenticated user is a StrideShift super-admin';

-- TRIGGERS

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenders_updated_at
    BEFORE UPDATE ON public.tenders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_rubrics_updated_at
    BEFORE UPDATE ON public.client_rubrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tender_evaluations_updated_at
    BEFORE UPDATE ON public.tender_evaluations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tender_syntheses_updated_at
    BEFORE UPDATE ON public.tender_syntheses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_display_name VARCHAR(255);
    v_is_strideshift BOOLEAN;
BEGIN
    -- Parse display name from email (extract part before @)
    v_display_name := SPLIT_PART(NEW.email, '@', 1);

    -- Detect if user is a StrideShift employee
    v_is_strideshift := NEW.email LIKE '%@strideshift.ai';

    -- Create user profile with auto-detected values
    INSERT INTO public.user_profiles (
        user_id,
        display_name,
        is_strideshift,
        email_notifications,
        notification_threshold,
        role
    ) VALUES (
        NEW.id,
        v_display_name,
        v_is_strideshift,
        true,
        'good_fit',
        CASE WHEN v_is_strideshift THEN 'admin' ELSE 'viewer' END
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-creates user_profile when new user signs up, parses name from email, detects StrideShift employees';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ROW LEVEL SECURITY

-- Tenders
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenders are viewable by authenticated users" ON public.tenders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tenders are insertable by service role" ON public.tenders FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Tenders are updatable by service role" ON public.tenders FOR UPDATE TO service_role USING (true);
CREATE POLICY "Tenders are deletable by service role" ON public.tenders FOR DELETE TO service_role USING (true);

-- Syntheses
ALTER TABLE public.tender_syntheses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Syntheses are viewable by authenticated users" ON public.tender_syntheses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Syntheses are insertable by service role" ON public.tender_syntheses FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Syntheses are updatable by service role" ON public.tender_syntheses FOR UPDATE TO service_role USING (true);

-- Changes
ALTER TABLE public.tender_changes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Changes are viewable by authenticated users" ON public.tender_changes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Changes are insertable by service role" ON public.tender_changes FOR INSERT TO service_role WITH CHECK (true);

-- Clients (with client isolation via user_profiles)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own client" ON public.clients FOR SELECT TO authenticated
    USING (client_pk IN (SELECT client_pk FROM public.user_profiles WHERE user_id = auth.uid()));
CREATE POLICY "StrideShift super-admins can view all clients" ON public.clients FOR SELECT TO authenticated
    USING (public.is_strideshift_user());
CREATE POLICY "Clients are manageable by service role" ON public.clients FOR ALL TO service_role USING (true);

-- Rubrics (with client isolation via client_pk join)
ALTER TABLE public.client_rubrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their client rubrics" ON public.client_rubrics FOR SELECT TO authenticated
    USING (client_pk IN (SELECT client_pk FROM public.user_profiles WHERE user_id = auth.uid()));
CREATE POLICY "StrideShift super-admins can view all rubrics" ON public.client_rubrics FOR SELECT TO authenticated
    USING (public.is_strideshift_user());
CREATE POLICY "Rubrics are manageable by service role" ON public.client_rubrics FOR ALL TO service_role USING (true);

-- Evaluations (with client isolation via rubric ownership)
ALTER TABLE public.tender_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view evaluations for their rubrics" ON public.tender_evaluations FOR SELECT TO authenticated
    USING (rubric_pk IN (
        SELECT cr.rubric_pk FROM public.client_rubrics cr
        JOIN public.user_profiles up ON cr.client_pk = up.client_pk
        WHERE up.user_id = auth.uid()
    ));
CREATE POLICY "StrideShift super-admins can view all evaluations" ON public.tender_evaluations FOR SELECT TO authenticated
    USING (public.is_strideshift_user());
CREATE POLICY "Evaluations are manageable by service role" ON public.tender_evaluations FOR ALL TO service_role USING (true);

-- User profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Profiles are manageable by service role" ON public.user_profiles FOR ALL TO service_role USING (true);

-- Lookup tables
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provinces are viewable by all" ON public.provinces FOR SELECT TO authenticated USING (true);
CREATE POLICY "Provinces are manageable by service role" ON public.provinces FOR ALL TO service_role USING (true);
CREATE POLICY "Departments are viewable by all" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Departments are manageable by service role" ON public.departments FOR ALL TO service_role USING (true);
CREATE POLICY "Categories are viewable by all" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Categories are manageable by service role" ON public.categories FOR ALL TO service_role USING (true);

-- Documents
ALTER TABLE public.tender_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Documents viewable by authenticated" ON public.tender_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Documents are manageable by service role" ON public.tender_documents FOR ALL TO service_role USING (true);
