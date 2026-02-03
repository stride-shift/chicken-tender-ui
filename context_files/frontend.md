# Frontend Context

Reference documentation for building the tender management frontend.

**SQL Files:** Copy `infrastructure/sql/*.sql` to frontend project for full schemas.

## Tables

| Table | Purpose |
|-------|---------|
| `tenders` | Core tender info synced from eTenders ZA |
| `tender_documents` | Document metadata (download from source URLs) |
| `tender_syntheses` | AI-generated tender summaries |
| `tender_changes` | Field-level change history with importance |
| `tender_evaluations` | Scored assessments against client rubrics |
| `clients` | Client organizations |
| `client_rubrics` | Evaluation criteria per client |
| `user_profiles` | Links Supabase auth to clients (preliminary - may change) |
| `provinces` / `departments` / `categories` | Lookup tables |

## Views (004_frontend_views.sql)

| View | Purpose |
|------|---------|
| `v_tender_with_evaluation` | Active tenders joined with synthesis + evaluation + client info |
| `v_tender_changes_with_context` | Changes with tender and client evaluation context |

## Functions (005_frontend_functions.sql)

| Function | Purpose | Key Params |
|----------|---------|------------|
| `get_dashboard_stats(client_code)` | Dashboard counts and metrics | client_code |
| `get_tenders_paginated(...)` | Main tender list with filters | client_code, is_relevant, province_id, department_id, category_id, closing_from/to, has_compulsory_briefing, search_text, sort_by, limit, offset |
| `get_tender_detail(tender_pk, client_code)` | Single tender with documents and changes | tender_pk, client_code |
| `get_activity_feed(client_code, ...)` | Recent changes for evaluated tenders | client_code, min_importance, limit, offset |
| `get_filter_options(client_code)` | Dynamic dropdown options with counts | client_code |
| `get_tender_change_summary(tender_pk)` | Aggregated change stats for a tender | tender_pk |
| `get_client_rubric(rubric_pk)` | Client rubric with knockouts and criteria | rubric_pk |

**Pagination:** `get_tenders_paginated` returns `total_count` on each row for pagination UI.

## Enums

**recommendation** (ordered best to worst):
- `excellent_fit` - Strong match, high priority
- `good_fit` - Good match, worth pursuing
- `worth_reviewing` - Potential fit, needs review
- `not_recommended` - Does not match client criteria

**"Relevant"** = any recommendation except `not_recommended`

**current_status:** `active`, `awarded`, `closed`, `cancelled`

**evaluation_status:** `pending`, `processing`, `completed`, `failed`

**highest_importance** (change severity):
- `high` - Affects bid strategy (closing_date, status, compulsory briefing)
- `medium` - Logistics impact (location, contact, submission rules)
- `low` - Informational (description edits, minor updates)

**change_type:** `metadata` (tender fields), `document` (files added/removed/modified)

## JSONB Structures

### changes_json (tender_changes)

Each change event is stored as a separate row with its own `observed_at` timestamp.

```json
{
  "changes": [
    {
      "field": "closing_date",
      "category": "core",
      "previous": "2026-02-01T16:00:00",
      "current": "2026-02-15T16:00:00",
      "importance": "high"
    }
  ],
  "documents": {
    "added": [
      {"file_name": "addendum_1.pdf", "source_document_id": "12345"}
    ],
    "removed": [
      {"file_name": "old_specs.pdf", "source_document_id": "11111"}
    ],
    "modified": [
      {"file_name": "updated_terms.pdf", "source_document_id": "22222"}
    ]
  },
  "summary": {
    "total_changes": 1,
    "high_count": 1,
    "medium_count": 0,
    "low_count": 0
  }
}
```

**Document change object:** `{file_name: string, source_document_id?: string}`

### knockout_results (tender_evaluations)
```json
[
  {
    "id": "ko_1",
    "question": "Does this tender require services in our capability areas?",
    "answer": "YES",
    "explanation": "Tender requires software development services."
  }
]
```
Answers: `YES`, `NO`, `UNSURE`

### criteria_results (tender_evaluations)
```json
[
  {
    "id": "cr_1",
    "question": "How well does the scope align with our expertise?",
    "answer": "FULLY",
    "weight": 3,
    "points_earned": 3,
    "points_possible": 3,
    "explanation": "Direct match to core competencies."
  }
]
```
Answers: `FULLY` (100%), `PARTIALLY` (50%), `MINIMALLY` (25%), `NO` (0%), `UNSURE` (depends on config)

### scoring_config (client_rubrics)
```json
{
  "max_points_per_criterion": 3,
  "unsure_handling": "neutral",
  "thresholds": {
    "excellent_fit": 80,
    "good_fit": 60,
    "worth_reviewing": 40
  }
}
```

### knockouts (client_rubrics)
```json
[
  {
    "id": "ko_1",
    "question": "Does this tender require services in our capability areas?",
    "fail_message": "Tender is outside our service offerings."
  }
]
```

### criteria (client_rubrics)
```json
[
  {
    "id": "cr_1",
    "question": "How well does the scope align with our expertise?",
    "weight": 3,
    "category": "relevance",
    "unsure_handling": "neutral"
  }
]
```

## Notes

**Client isolation:** Each client only sees their own evaluations. RLS policies enforce this.

**Data retention:** Tenders are removed ~7 days after closing. Evaluated tenders may be retained longer for historical stats (configurable).

**Document downloads:** Documents link to source URLs (eTenders). Note: source documents may change between syncs - the displayed metadata reflects the last sync state.

**Timezones:** All users and tenders are South African. No timezone conversion needed.

**Data source:** Pipeline syncs from eTenders ZA API. Tenders refresh periodically; changes are tracked automatically.
