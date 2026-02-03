-- Chicken Tender - Supabase Schema Migration 004
-- Purpose: Frontend views for React tender management application
-- Date: 2026-01-28

-- VIEW 1: v_tender_with_evaluation
-- Base view joining tender + synthesis + evaluation + client info

CREATE OR REPLACE VIEW public.v_tender_with_evaluation AS
SELECT
    -- Tender core fields
    t.tender_pk,
    t.source_tender_id,
    t.tender_no,
    t.description,
    t.current_status,
    t.date_published,
    t.closing_date,
    -- Classification
    t.category_id,
    t.category_name,
    t.tender_type,
    t.organ_of_state,
    -- Contact info
    t.contact_person,
    t.contact_email,
    t.contact_phone,
    -- Location
    t.province_id,
    t.province_name,
    t.department_id,
    t.department_name,
    t.town,
    t.delivery_address,
    -- Briefing session
    t.briefing_datetime,
    t.briefing_venue,
    t.is_briefing_compulsory,
    t.has_briefing_session,
    -- Submission
    t.allows_esubmission,
    -- Synthesis fields
    ts.synthesis_pk,
    ts.generated_title,
    ts.final_report_text,
    ts.quality_score,
    ts.quality_explanation,
    -- Evaluation fields
    e.evaluation_pk,
    e.rubric_pk,
    e.evaluation_status,
    e.knockout_passed,
    e.knockout_results,
    e.criteria_results,
    e.score_earned,
    e.score_possible,
    e.score_percentage,
    e.recommendation,
    e.llm_notes,
    -- Client fields
    cr.client_pk,
    c.client_code,
    c.client_name,
    -- Computed fields
    EXTRACT(DAY FROM (t.closing_date - NOW()))::INTEGER AS days_until_close,
    CASE
        WHEN e.recommendation IS NOT NULL AND e.recommendation != 'not_recommended'
        THEN TRUE
        ELSE FALSE
    END AS is_relevant,
    -- Timestamps
    t.created_at AS tender_created_at,
    t.updated_at AS tender_updated_at,
    e.created_at AS evaluation_created_at,
    e.updated_at AS evaluation_updated_at
FROM public.tenders t
LEFT JOIN public.tender_syntheses ts
    ON t.tender_pk = ts.tender_pk
    AND ts.synthesis_type = 'comprehensive'
LEFT JOIN public.tender_evaluations e
    ON t.tender_pk = e.tender_pk
    AND e.evaluation_status = 'completed'
LEFT JOIN public.client_rubrics cr
    ON e.rubric_pk = cr.rubric_pk
LEFT JOIN public.clients c
    ON cr.client_pk = c.client_pk
WHERE t.current_status = 'active';

COMMENT ON VIEW public.v_tender_with_evaluation IS
'Base view for frontend tender listings. Joins active tenders with comprehensive syntheses, completed evaluations, and client info. Includes computed fields: days_until_close, is_relevant.';

-- VIEW 2: v_tender_changes_with_context
-- Changes with tender and client context for activity feeds

CREATE OR REPLACE VIEW public.v_tender_changes_with_context AS
SELECT
    -- Change fields
    tc.change_pk,
    tc.tender_pk,
    tc.observed_at,
    tc.change_type,
    tc.highest_importance,
    tc.changes_json,
    tc.created_at AS change_created_at,
    -- Tender context
    t.tender_no,
    t.current_status,
    t.closing_date,
    LEFT(t.description, 200) AS description_preview,
    -- Evaluation context
    e.evaluation_pk,
    e.rubric_pk,
    e.recommendation,
    e.score_percentage,
    e.knockout_passed,
    -- Client context
    c.client_pk,
    c.client_code,
    c.client_name
FROM public.tender_changes tc
JOIN public.tenders t
    ON tc.tender_pk = t.tender_pk
LEFT JOIN public.tender_evaluations e
    ON t.tender_pk = e.tender_pk
    AND e.evaluation_status = 'completed'
LEFT JOIN public.client_rubrics cr
    ON e.rubric_pk = cr.rubric_pk
LEFT JOIN public.clients c
    ON cr.client_pk = c.client_pk;

COMMENT ON VIEW public.v_tender_changes_with_context IS
'Tender changes with full context including tender info, evaluation status, and client details. Used for activity feeds filtered by client.';
