-- Chicken Tender - Supabase Schema Migration 005
-- Purpose: Frontend API functions for React tender management application
-- Date: 2026-01-28

-- Drop existing functions to allow return type changes
DROP FUNCTION IF EXISTS public.get_dashboard_stats(VARCHAR);
DROP FUNCTION IF EXISTS public.get_tenders_paginated(VARCHAR, BOOLEAN, INTEGER, INTEGER, INTEGER, DATE, DATE, BOOLEAN, TEXT, VARCHAR, BOOLEAN, INTEGER, INTEGER, VARCHAR, INTEGER);
DROP FUNCTION IF EXISTS public.get_tender_detail(INTEGER, VARCHAR);
DROP FUNCTION IF EXISTS public.get_activity_feed(VARCHAR, VARCHAR, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.get_filter_options(VARCHAR);
DROP FUNCTION IF EXISTS public.get_tender_change_summary(INTEGER);
DROP FUNCTION IF EXISTS public.get_client_rubric(INTEGER);
DROP FUNCTION IF EXISTS public.get_active_client_rubric(VARCHAR);

-- FUNCTION 1: get_dashboard_stats
-- Returns summary statistics for a client's dashboard

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_client_code VARCHAR)
RETURNS TABLE (
    total_active INTEGER,
    total_relevant INTEGER,
    total_not_relevant INTEGER,
    excellent_count INTEGER,
    good_count INTEGER,
    worth_reviewing_count INTEGER,
    briefings_next_7_days INTEGER,
    closing_next_7_days INTEGER,
    high_importance_changes_24h INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_pk INTEGER;
BEGIN
    SELECT c.client_pk INTO v_client_pk
    FROM public.clients c
    WHERE c.client_code = p_client_code AND c.is_active = true;

    IF v_client_pk IS NULL THEN
        RAISE EXCEPTION 'Client not found or inactive: %', p_client_code;
    END IF;

    RETURN QUERY
    SELECT
        COUNT(DISTINCT t.tender_pk)::INTEGER AS total_active,
        COUNT(DISTINCT t.tender_pk) FILTER (
            WHERE e.recommendation IN ('excellent_fit', 'good_fit', 'worth_reviewing')
        )::INTEGER AS total_relevant,
        COUNT(DISTINCT t.tender_pk) FILTER (
            WHERE e.recommendation = 'not_recommended'
        )::INTEGER AS total_not_relevant,
        COUNT(DISTINCT t.tender_pk) FILTER (
            WHERE e.recommendation = 'excellent_fit'
        )::INTEGER AS excellent_count,
        COUNT(DISTINCT t.tender_pk) FILTER (
            WHERE e.recommendation = 'good_fit'
        )::INTEGER AS good_count,
        COUNT(DISTINCT t.tender_pk) FILTER (
            WHERE e.recommendation = 'worth_reviewing'
        )::INTEGER AS worth_reviewing_count,
        COUNT(DISTINCT t.tender_pk) FILTER (
            WHERE t.is_briefing_compulsory = true
            AND t.briefing_datetime >= NOW()
            AND t.briefing_datetime <= NOW() + INTERVAL '7 days'
        )::INTEGER AS briefings_next_7_days,
        COUNT(DISTINCT t.tender_pk) FILTER (
            WHERE t.closing_date >= NOW()
            AND t.closing_date <= NOW() + INTERVAL '7 days'
        )::INTEGER AS closing_next_7_days,
        (
            SELECT COUNT(DISTINCT tc.change_pk)::INTEGER
            FROM public.tender_changes tc
            JOIN public.tenders t2 ON tc.tender_pk = t2.tender_pk
            JOIN public.tender_evaluations e2 ON t2.tender_pk = e2.tender_pk
            JOIN public.client_rubrics cr2 ON e2.rubric_pk = cr2.rubric_pk
            WHERE cr2.client_pk = v_client_pk
            AND e2.evaluation_status = 'completed'
            AND t2.current_status = 'active'
            AND tc.highest_importance = 'high'
            AND tc.observed_at >= NOW() - INTERVAL '24 hours'
        ) AS high_importance_changes_24h
    FROM public.tenders t
    JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
    JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk
    WHERE cr.client_pk = v_client_pk
    AND e.evaluation_status = 'completed'
    AND t.current_status = 'active';
END;
$$;

COMMENT ON FUNCTION public.get_dashboard_stats IS
'Returns dashboard statistics for a client including tender counts by recommendation, upcoming briefings, closing dates, and recent high-importance changes.';

-- FUNCTION 2: get_tenders_paginated
-- Paginated tender listing with comprehensive filters

CREATE OR REPLACE FUNCTION public.get_tenders_paginated(
    p_client_code VARCHAR,
    p_is_relevant BOOLEAN DEFAULT NULL,
    p_province_id INTEGER DEFAULT NULL,
    p_department_id INTEGER DEFAULT NULL,
    p_category_id INTEGER DEFAULT NULL,
    p_closing_from DATE DEFAULT NULL,
    p_closing_to DATE DEFAULT NULL,
    p_has_compulsory_briefing BOOLEAN DEFAULT NULL,
    p_search_text TEXT DEFAULT NULL,
    p_sort_by VARCHAR DEFAULT 'published_date',
    p_sort_desc BOOLEAN DEFAULT TRUE,
    p_limit INTEGER DEFAULT 25,
    p_offset INTEGER DEFAULT 0,
    p_status VARCHAR DEFAULT 'active',
    p_min_days_until_close INTEGER DEFAULT NULL
)
RETURNS TABLE (
    tender_pk INTEGER,
    tender_no VARCHAR,
    description TEXT,
    generated_title TEXT,
    current_status VARCHAR,
    date_published TIMESTAMPTZ,
    closing_date TIMESTAMPTZ,
    days_until_close INTEGER,
    category_id INTEGER,
    category_name VARCHAR,
    province_id INTEGER,
    province_name VARCHAR,
    department_id INTEGER,
    department_name VARCHAR,
    briefing_datetime TIMESTAMPTZ,
    is_briefing_compulsory BOOLEAN,
    allows_esubmission BOOLEAN,
    contact_person VARCHAR,
    contact_email VARCHAR,
    evaluation_pk INTEGER,
    recommendation VARCHAR,
    score_percentage DECIMAL,
    knockout_passed BOOLEAN,
    llm_notes TEXT,
    quality_score INTEGER,
    is_relevant BOOLEAN,
    total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_pk INTEGER;
    v_total BIGINT;
BEGIN
    SELECT c.client_pk INTO v_client_pk
    FROM public.clients c
    WHERE c.client_code = p_client_code AND c.is_active = true;

    IF v_client_pk IS NULL THEN
        RAISE EXCEPTION 'Client not found or inactive: %', p_client_code;
    END IF;

    SELECT COUNT(DISTINCT t.tender_pk) INTO v_total
    FROM public.tenders t
    JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
    JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk
    LEFT JOIN public.tender_syntheses ts ON t.tender_pk = ts.tender_pk AND ts.synthesis_type = 'comprehensive'
    WHERE cr.client_pk = v_client_pk
    AND e.evaluation_status = 'completed'
    AND (p_status IS NULL OR t.current_status = p_status)
    AND (p_min_days_until_close IS NULL OR EXTRACT(DAY FROM (t.closing_date - NOW()))::INTEGER >= p_min_days_until_close)
    AND (p_is_relevant IS NULL
         OR (p_is_relevant = TRUE AND e.recommendation IN ('excellent_fit', 'good_fit', 'worth_reviewing'))
         OR (p_is_relevant = FALSE AND e.recommendation = 'not_recommended'))
    AND (p_province_id IS NULL OR t.province_id = p_province_id)
    AND (p_department_id IS NULL OR t.department_id = p_department_id)
    AND (p_category_id IS NULL OR t.category_id = p_category_id)
    AND (p_closing_from IS NULL OR t.closing_date >= p_closing_from)
    AND (p_closing_to IS NULL OR t.closing_date <= p_closing_to)
    AND (p_has_compulsory_briefing IS NULL OR t.is_briefing_compulsory = p_has_compulsory_briefing)
    AND (p_search_text IS NULL
         OR t.tender_no ILIKE '%' || p_search_text || '%'
         OR ts.generated_title ILIKE '%' || p_search_text || '%'
         OR to_tsvector('english', t.description) @@ plainto_tsquery('english', p_search_text));

    RETURN QUERY
    SELECT
        t.tender_pk,
        t.tender_no,
        t.description,
        ts.generated_title,
        t.current_status,
        t.date_published,
        t.closing_date,
        EXTRACT(DAY FROM (t.closing_date - NOW()))::INTEGER AS days_until_close,
        t.category_id,
        t.category_name,
        t.province_id,
        t.province_name,
        t.department_id,
        t.department_name,
        t.briefing_datetime,
        t.is_briefing_compulsory,
        t.allows_esubmission,
        t.contact_person,
        t.contact_email,
        e.evaluation_pk,
        e.recommendation,
        e.score_percentage,
        e.knockout_passed,
        e.llm_notes,
        ts.quality_score,
        CASE
            WHEN e.recommendation IN ('excellent_fit', 'good_fit', 'worth_reviewing')
            THEN TRUE
            ELSE FALSE
        END AS is_relevant,
        v_total AS total_count
    FROM public.tenders t
    JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
    JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk
    LEFT JOIN public.tender_syntheses ts ON t.tender_pk = ts.tender_pk AND ts.synthesis_type = 'comprehensive'
    WHERE cr.client_pk = v_client_pk
    AND e.evaluation_status = 'completed'
    AND (p_status IS NULL OR t.current_status = p_status)
    AND (p_min_days_until_close IS NULL OR EXTRACT(DAY FROM (t.closing_date - NOW()))::INTEGER >= p_min_days_until_close)
    AND (p_is_relevant IS NULL
         OR (p_is_relevant = TRUE AND e.recommendation IN ('excellent_fit', 'good_fit', 'worth_reviewing'))
         OR (p_is_relevant = FALSE AND e.recommendation = 'not_recommended'))
    AND (p_province_id IS NULL OR t.province_id = p_province_id)
    AND (p_department_id IS NULL OR t.department_id = p_department_id)
    AND (p_category_id IS NULL OR t.category_id = p_category_id)
    AND (p_closing_from IS NULL OR t.closing_date >= p_closing_from)
    AND (p_closing_to IS NULL OR t.closing_date <= p_closing_to)
    AND (p_has_compulsory_briefing IS NULL OR t.is_briefing_compulsory = p_has_compulsory_briefing)
    AND (p_search_text IS NULL
         OR t.tender_no ILIKE '%' || p_search_text || '%'
         OR ts.generated_title ILIKE '%' || p_search_text || '%'
         OR to_tsvector('english', t.description) @@ plainto_tsquery('english', p_search_text))
    ORDER BY
        CASE WHEN p_sort_by = 'recommendation' AND NOT p_sort_desc THEN
            CASE e.recommendation
                WHEN 'excellent_fit' THEN 1
                WHEN 'good_fit' THEN 2
                WHEN 'worth_reviewing' THEN 3
                WHEN 'not_recommended' THEN 4
                ELSE 5
            END
        END ASC,
        CASE WHEN p_sort_by = 'recommendation' AND p_sort_desc THEN
            CASE e.recommendation
                WHEN 'excellent_fit' THEN 1
                WHEN 'good_fit' THEN 2
                WHEN 'worth_reviewing' THEN 3
                WHEN 'not_recommended' THEN 4
                ELSE 5
            END
        END DESC,
        CASE WHEN p_sort_by = 'recommendation' THEN t.closing_date END ASC,
        CASE WHEN p_sort_by = 'closing_date' AND NOT p_sort_desc THEN t.closing_date END ASC,
        CASE WHEN p_sort_by = 'closing_date' AND p_sort_desc THEN t.closing_date END DESC,
        CASE WHEN p_sort_by = 'score' AND NOT p_sort_desc THEN e.score_percentage END ASC,
        CASE WHEN p_sort_by = 'score' AND p_sort_desc THEN e.score_percentage END DESC,
        CASE WHEN p_sort_by = 'published_date' AND NOT p_sort_desc THEN t.date_published END ASC,
        CASE WHEN p_sort_by = 'published_date' AND p_sort_desc THEN t.date_published END DESC,
        t.tender_pk ASC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

COMMENT ON FUNCTION public.get_tenders_paginated IS
'Paginated tender listing with filters for relevance, location, category, dates, briefings, status, days until close, and full-text search. Default sort is by published_date descending (newest first). Default status filter is active only.';

-- FUNCTION 3: get_tender_detail
-- Full tender detail for single tender view

CREATE OR REPLACE FUNCTION public.get_tender_detail(p_tender_pk INTEGER, p_client_code VARCHAR)
RETURNS TABLE (
    tender_pk INTEGER,
    source_tender_id VARCHAR,
    tender_no VARCHAR,
    description TEXT,
    current_status VARCHAR,
    date_published TIMESTAMPTZ,
    closing_date TIMESTAMPTZ,
    days_until_close INTEGER,
    category_id INTEGER,
    category_name VARCHAR,
    tender_type VARCHAR,
    organ_of_state VARCHAR,
    contact_person VARCHAR,
    contact_email VARCHAR,
    contact_phone VARCHAR,
    province_id INTEGER,
    province_name VARCHAR,
    department_id INTEGER,
    department_name VARCHAR,
    town VARCHAR,
    delivery_address TEXT,
    briefing_datetime TIMESTAMPTZ,
    briefing_venue TEXT,
    is_briefing_compulsory BOOLEAN,
    has_briefing_session BOOLEAN,
    allows_esubmission BOOLEAN,
    structured_data JSONB,
    synthesis_pk INTEGER,
    generated_title TEXT,
    final_report_text TEXT,
    quality_score INTEGER,
    quality_explanation TEXT,
    evaluation_pk INTEGER,
    rubric_pk INTEGER,
    recommendation VARCHAR,
    score_percentage DECIMAL,
    score_earned INTEGER,
    score_possible INTEGER,
    knockout_passed BOOLEAN,
    knockout_results JSONB,
    criteria_results JSONB,
    llm_notes TEXT,
    documents JSONB,
    recent_changes JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_pk INTEGER;
    v_documents JSONB;
    v_changes JSONB;
BEGIN
    SELECT c.client_pk INTO v_client_pk
    FROM public.clients c
    WHERE c.client_code = p_client_code AND c.is_active = true;

    IF v_client_pk IS NULL THEN
        RAISE EXCEPTION 'Client not found or inactive: %', p_client_code;
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'document_pk', d.document_pk,
            'file_name', d.file_name,
            'file_extension', d.file_extension,
            'file_size', d.file_size,
            'document_type', d.document_type,
            'download_url', d.download_url,
            'processing_status', d.processing_status,
            'date_created', d.date_created,
            'date_modified', d.date_modified
        ) ORDER BY d.date_created DESC
    ), '[]'::jsonb) INTO v_documents
    FROM public.tender_documents d
    WHERE d.tender_pk = p_tender_pk;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'change_pk', tc.change_pk,
            'observed_at', tc.observed_at,
            'change_type', tc.change_type,
            'highest_importance', tc.highest_importance,
            'changes_json', tc.changes_json
        ) ORDER BY tc.observed_at DESC
    ), '[]'::jsonb) INTO v_changes
    FROM (
        SELECT * FROM public.tender_changes
        WHERE public.tender_changes.tender_pk = p_tender_pk
        ORDER BY observed_at DESC
        LIMIT 10
    ) tc;

    RETURN QUERY
    SELECT
        t.tender_pk,
        t.source_tender_id,
        t.tender_no,
        t.description,
        t.current_status,
        t.date_published,
        t.closing_date,
        EXTRACT(DAY FROM (t.closing_date - NOW()))::INTEGER AS days_until_close,
        t.category_id,
        t.category_name,
        t.tender_type,
        t.organ_of_state,
        t.contact_person,
        t.contact_email,
        t.contact_phone,
        t.province_id,
        t.province_name,
        t.department_id,
        t.department_name,
        t.town,
        t.delivery_address,
        t.briefing_datetime,
        t.briefing_venue,
        t.is_briefing_compulsory,
        t.has_briefing_session,
        t.allows_esubmission,
        t.structured_data,
        ts.synthesis_pk,
        ts.generated_title,
        ts.final_report_text,
        ts.quality_score,
        ts.quality_explanation,
        e.evaluation_pk,
        e.rubric_pk,
        e.recommendation,
        e.score_percentage,
        e.score_earned,
        e.score_possible,
        e.knockout_passed,
        e.knockout_results,
        e.criteria_results,
        e.llm_notes,
        v_documents AS documents,
        v_changes AS recent_changes
    FROM public.tenders t
    LEFT JOIN public.tender_syntheses ts ON t.tender_pk = ts.tender_pk AND ts.synthesis_type = 'comprehensive'
    LEFT JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
    LEFT JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk AND cr.client_pk = v_client_pk
    WHERE t.tender_pk = p_tender_pk
    AND (e.evaluation_status = 'completed' OR e.evaluation_pk IS NULL);
END;
$$;

COMMENT ON FUNCTION public.get_tender_detail IS
'Returns complete tender detail including synthesis, evaluation with rubric_pk, documents array, and recent changes array for single tender view.';

-- FUNCTION 4: get_activity_feed
-- Recent changes for client's evaluated tenders

CREATE OR REPLACE FUNCTION public.get_activity_feed(
    p_client_code VARCHAR,
    p_min_importance VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    change_pk INTEGER,
    tender_pk INTEGER,
    tender_no VARCHAR,
    description_preview TEXT,
    change_type VARCHAR,
    highest_importance VARCHAR,
    changes_json JSONB,
    observed_at TIMESTAMPTZ,
    recommendation VARCHAR,
    score_percentage DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_pk INTEGER;
BEGIN
    SELECT c.client_pk INTO v_client_pk
    FROM public.clients c
    WHERE c.client_code = p_client_code AND c.is_active = true;

    IF v_client_pk IS NULL THEN
        RAISE EXCEPTION 'Client not found or inactive: %', p_client_code;
    END IF;

    RETURN QUERY
    SELECT
        tc.change_pk,
        tc.tender_pk,
        t.tender_no,
        LEFT(t.description, 200) AS description_preview,
        tc.change_type,
        tc.highest_importance,
        tc.changes_json,
        tc.observed_at,
        e.recommendation,
        e.score_percentage
    FROM public.tender_changes tc
    JOIN public.tenders t ON tc.tender_pk = t.tender_pk
    JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
    JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk
    WHERE cr.client_pk = v_client_pk
    AND e.evaluation_status = 'completed'
    AND t.current_status = 'active'
    AND (p_min_importance IS NULL
         OR (p_min_importance = 'high' AND tc.highest_importance = 'high')
         OR (p_min_importance = 'medium' AND tc.highest_importance IN ('high', 'medium'))
         OR (p_min_importance = 'low' AND tc.highest_importance IN ('high', 'medium', 'low')))
    ORDER BY tc.observed_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

COMMENT ON FUNCTION public.get_activity_feed IS
'Returns recent tender changes for tenders that have been evaluated for the specified client. Supports filtering by minimum importance level.';

-- FUNCTION 5: get_filter_options
-- Dynamic filter options based on available data

CREATE OR REPLACE FUNCTION public.get_filter_options(p_client_code VARCHAR)
RETURNS TABLE (
    provinces JSONB,
    departments JSONB,
    categories JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_pk INTEGER;
    v_provinces JSONB;
    v_departments JSONB;
    v_categories JSONB;
BEGIN
    SELECT c.client_pk INTO v_client_pk
    FROM public.clients c
    WHERE c.client_code = p_client_code AND c.is_active = true;

    IF v_client_pk IS NULL THEN
        RAISE EXCEPTION 'Client not found or inactive: %', p_client_code;
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', p.province_id,
            'name', p.province_name,
            'count', p.tender_count
        ) ORDER BY p.province_name
    ), '[]'::jsonb) INTO v_provinces
    FROM (
        SELECT
            t.province_id,
            pr.province_name,
            COUNT(DISTINCT t.tender_pk) AS tender_count
        FROM public.tenders t
        JOIN public.provinces pr ON t.province_id = pr.province_id
        JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
        JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk
        WHERE cr.client_pk = v_client_pk
        AND e.evaluation_status = 'completed'
        AND t.current_status = 'active'
        AND t.province_id IS NOT NULL
        GROUP BY t.province_id, pr.province_name
        HAVING COUNT(DISTINCT t.tender_pk) > 0
    ) p;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', d.department_id,
            'name', d.department_name,
            'count', d.tender_count
        ) ORDER BY d.department_name
    ), '[]'::jsonb) INTO v_departments
    FROM (
        SELECT
            t.department_id,
            dp.department_name,
            COUNT(DISTINCT t.tender_pk) AS tender_count
        FROM public.tenders t
        JOIN public.departments dp ON t.department_id = dp.department_id
        JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
        JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk
        WHERE cr.client_pk = v_client_pk
        AND e.evaluation_status = 'completed'
        AND t.current_status = 'active'
        AND t.department_id IS NOT NULL
        GROUP BY t.department_id, dp.department_name
        HAVING COUNT(DISTINCT t.tender_pk) > 0
    ) d;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', c.category_id,
            'name', c.category_name,
            'count', c.tender_count
        ) ORDER BY c.category_name
    ), '[]'::jsonb) INTO v_categories
    FROM (
        SELECT
            t.category_id,
            cat.category_name,
            COUNT(DISTINCT t.tender_pk) AS tender_count
        FROM public.tenders t
        JOIN public.categories cat ON t.category_id = cat.category_id
        JOIN public.tender_evaluations e ON t.tender_pk = e.tender_pk
        JOIN public.client_rubrics cr ON e.rubric_pk = cr.rubric_pk
        WHERE cr.client_pk = v_client_pk
        AND e.evaluation_status = 'completed'
        AND t.current_status = 'active'
        AND t.category_id IS NOT NULL
        GROUP BY t.category_id, cat.category_name
        HAVING COUNT(DISTINCT t.tender_pk) > 0
    ) c;

    RETURN QUERY SELECT v_provinces, v_departments, v_categories;
END;
$$;

COMMENT ON FUNCTION public.get_filter_options IS
'Returns available filter options (provinces, departments, categories) with counts based on active, evaluated tenders for the specified client.';

-- FUNCTION 6: get_tender_change_summary
-- Aggregated change statistics for a single tender

CREATE OR REPLACE FUNCTION public.get_tender_change_summary(p_tender_pk INTEGER)
RETURNS TABLE (
    total_changes INTEGER,
    high_importance_count INTEGER,
    medium_importance_count INTEGER,
    low_importance_count INTEGER,
    last_change_at TIMESTAMPTZ,
    documents_added INTEGER,
    documents_removed INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_changes,
        COUNT(*) FILTER (WHERE tc.highest_importance = 'high')::INTEGER,
        COUNT(*) FILTER (WHERE tc.highest_importance = 'medium')::INTEGER,
        COUNT(*) FILTER (WHERE tc.highest_importance = 'low')::INTEGER,
        MAX(tc.observed_at),
        COALESCE(SUM(jsonb_array_length(tc.changes_json->'documents'->'added'))::INTEGER, 0),
        COALESCE(SUM(jsonb_array_length(tc.changes_json->'documents'->'removed'))::INTEGER, 0)
    FROM public.tender_changes tc
    WHERE tc.tender_pk = p_tender_pk;
END;
$$;

COMMENT ON FUNCTION public.get_tender_change_summary IS
'Returns aggregated change statistics for a tender including counts by importance level and document changes.';

-- FUNCTION 7: get_client_rubric
-- Get client rubric details for displaying in the Rubric tab

CREATE OR REPLACE FUNCTION public.get_client_rubric(p_rubric_pk INTEGER)
RETURNS TABLE (
    rubric_pk INTEGER,
    client_pk INTEGER,
    client_name VARCHAR,
    version INTEGER,
    is_active BOOLEAN,
    description TEXT,
    knockouts JSONB,
    criteria JSONB,
    scoring_config JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        cr.rubric_pk,
        cr.client_pk,
        c.client_name,
        cr.version,
        cr.is_active,
        cr.description,
        cr.knockouts,
        cr.criteria,
        cr.scoring_config,
        cr.created_at,
        cr.updated_at
    FROM public.client_rubrics cr
    JOIN public.clients c ON cr.client_pk = c.client_pk
    WHERE cr.rubric_pk = p_rubric_pk;
END;
$$;

COMMENT ON FUNCTION public.get_client_rubric IS
'Returns client rubric details including description, knockout questions and scoring criteria.';

-- FUNCTION 8: get_active_client_rubric
-- Get the active rubric for a client by client code

CREATE OR REPLACE FUNCTION public.get_active_client_rubric(p_client_code VARCHAR)
RETURNS TABLE (
    rubric_pk INTEGER,
    client_pk INTEGER,
    client_name VARCHAR,
    version INTEGER,
    is_active BOOLEAN,
    description TEXT,
    knockouts JSONB,
    criteria JSONB,
    scoring_config JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_pk INTEGER;
BEGIN
    SELECT c.client_pk INTO v_client_pk
    FROM public.clients c
    WHERE c.client_code = p_client_code AND c.is_active = true;

    IF v_client_pk IS NULL THEN
        RAISE EXCEPTION 'Client not found or inactive: %', p_client_code;
    END IF;

    RETURN QUERY
    SELECT
        cr.rubric_pk,
        cr.client_pk,
        c.client_name,
        cr.version,
        cr.is_active,
        cr.description,
        cr.knockouts,
        cr.criteria,
        cr.scoring_config,
        cr.created_at,
        cr.updated_at
    FROM public.client_rubrics cr
    JOIN public.clients c ON cr.client_pk = c.client_pk
    WHERE cr.client_pk = v_client_pk
    AND cr.is_active = true
    ORDER BY cr.version DESC
    LIMIT 1;
END;
$$;

COMMENT ON FUNCTION public.get_active_client_rubric IS
'Returns the active rubric for a client by client code. Used on the Rubric page to display the client base rubric definition.';
