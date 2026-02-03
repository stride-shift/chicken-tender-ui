-- Chicken Tender - Supabase Schema Migration 006
-- Purpose: Performance indexes for frontend API functions
-- Date: 2026-01-28

-- INDEX 1: Client-scoped evaluation queries
-- Optimizes get_tenders_paginated and get_dashboard_stats

CREATE INDEX IF NOT EXISTS idx_eval_rubric_status_rec
ON public.tender_evaluations(rubric_pk, evaluation_status, recommendation);

COMMENT ON INDEX public.idx_eval_rubric_status_rec IS
'Composite index for client-scoped evaluation queries filtering by rubric, status, and recommendation';

-- INDEX 2: Relevance filtering (partial index)
-- Optimizes queries that filter for "relevant" tenders only

CREATE INDEX IF NOT EXISTS idx_eval_relevant
ON public.tender_evaluations(rubric_pk)
WHERE evaluation_status = 'completed' AND recommendation != 'not_recommended';

COMMENT ON INDEX public.idx_eval_relevant IS
'Partial index for efficient relevance filtering - only completed evaluations with relevant recommendations';

-- INDEX 3: Closing date range queries on active tenders
-- Optimizes get_tenders_paginated date range filters and get_dashboard_stats closing_next_7_days count

CREATE INDEX IF NOT EXISTS idx_tenders_active_closing
ON public.tenders(closing_date)
WHERE current_status = 'active';

COMMENT ON INDEX public.idx_tenders_active_closing IS
'Partial index for closing date queries on active tenders only';

-- INDEX 4: Compulsory briefing queries
-- Optimizes get_dashboard_stats briefings_next_7_days count and get_tenders_paginated briefing filter

CREATE INDEX IF NOT EXISTS idx_tenders_briefing_compulsory
ON public.tenders(briefing_datetime)
WHERE current_status = 'active' AND is_briefing_compulsory = true;

COMMENT ON INDEX public.idx_tenders_briefing_compulsory IS
'Partial index for compulsory briefing queries on active tenders';

-- INDEX 5: Activity feed (changes by tender, recent first)
-- Optimizes get_activity_feed and get_tender_detail (recent_changes)

CREATE INDEX IF NOT EXISTS idx_changes_tender_recent
ON public.tender_changes(tender_pk, observed_at DESC);

COMMENT ON INDEX public.idx_changes_tender_recent IS
'Composite index for activity feed queries - changes by tender ordered by most recent';

-- INDEX 6: Evaluation by tender for detail lookups
-- Optimizes get_tender_detail join on evaluations

CREATE INDEX IF NOT EXISTS idx_eval_tender_completed
ON public.tender_evaluations(tender_pk, rubric_pk)
WHERE evaluation_status = 'completed';

COMMENT ON INDEX public.idx_eval_tender_completed IS
'Partial index for tender detail lookups - completed evaluations only';

-- INDEX 7: Client rubrics by client for fast lookup
-- Optimizes the client_pk lookup used in all functions

CREATE INDEX IF NOT EXISTS idx_rubrics_client_active
ON public.client_rubrics(client_pk)
WHERE is_active = true;

COMMENT ON INDEX public.idx_rubrics_client_active IS
'Partial index for active rubric lookups by client';
