# Tender Lifecycle Management — Implementation Context

## Purpose

This document captures the design and context for implementing the tender lifecycle management feature. It serves as a reference for future agents implementing this feature.

## User Journey

1. User logs in, sees dashboard with featured tenders (sorted by highest score)
2. Navigates to Tenders tab (defaults to relevant tenders only)
3. Clicks through tenders in the detail panel
4. **Wants to take action**: flag for review, shortlist, decline, or watch a tender
5. Actions are client-specific — each client has their own lifecycle state per tender

## Current State (Skeleton)

- **UI buttons exist** in `TenderDetailHeader.tsx` (Row 4: Shortlist, Review, Watch, Decline)
- Buttons show a "Coming Soon" info toast when clicked
- `LifecycleStatus` type defined in `src/lib/types.ts`
- No database table, no RPC functions, no persistence yet

## Lifecycle Stages (Medium 5-State)

| Stage | Meaning | UI Color |
|-------|---------|----------|
| `new` | Not yet reviewed by user | — (default, no indicator) |
| `under_review` | Being evaluated by the team | Blue |
| `shortlisted` | Marked for bid preparation | Green |
| `declined` | Decided not to pursue | Gray |
| `watching` | Monitoring but not actively pursuing | Amber |

## Database Design

### New Table: `tender_client_status`

```sql
CREATE TABLE public.tender_client_status (
    status_pk SERIAL PRIMARY KEY,
    tender_pk INTEGER NOT NULL REFERENCES public.tenders(tender_pk) ON DELETE CASCADE,
    client_pk INTEGER NOT NULL REFERENCES public.clients(client_pk) ON DELETE CASCADE,
    lifecycle_status VARCHAR(50) NOT NULL DEFAULT 'new'
        CHECK (lifecycle_status IN ('new', 'under_review', 'shortlisted', 'declined', 'watching')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,
    notes TEXT,
    internal_priority VARCHAR(20) CHECK (internal_priority IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status_changed_by UUID REFERENCES auth.users(id),
    CONSTRAINT uq_tender_client_status UNIQUE (tender_pk, client_pk)
);
```

### Indexes
```sql
CREATE INDEX idx_status_client ON public.tender_client_status(client_pk);
CREATE INDEX idx_status_tender ON public.tender_client_status(tender_pk);
CREATE INDEX idx_status_lifecycle ON public.tender_client_status(lifecycle_status);
CREATE INDEX idx_status_assigned ON public.tender_client_status(assigned_to) WHERE assigned_to IS NOT NULL;
```

### RLS Policies

Follow existing pattern from `tender_evaluations`:
- **SELECT**: All authenticated users of a client can view via `user_profiles.client_pk`
- **INSERT/UPDATE**: Role-based (manager/admin only)
- **StrideShift bypass**: `public.is_strideshift_user()` for super-admin access

### RPC Functions Needed

1. **`update_tender_status(p_tender_pk, p_client_code, p_lifecycle_status, ...)`**
   - UPSERT into `tender_client_status`
   - Uses `ON CONFLICT (tender_pk, client_pk) DO UPDATE`

2. **Modify `get_tenders_paginated()`**
   - LEFT JOIN `tender_client_status` on `tender_pk` + client's `client_pk`
   - Add `lifecycle_status`, `assigned_to`, `assigned_user_name` to SELECT
   - Add optional filter params: `p_lifecycle_status`, `p_assigned_to`

3. **Modify `get_tender_detail()`**
   - Same LEFT JOIN
   - Include full lifecycle fields (notes, priority, timestamps, changed_by)

### TypeScript Types to Extend

```typescript
// Already exists in types.ts:
export type LifecycleStatus = 'new' | 'under_review' | 'shortlisted' | 'declined' | 'watching'

// Add to TenderListItem:
lifecycle_status: LifecycleStatus | null
assigned_to: string | null
assigned_user_name: string | null

// Add to TenderDetail:
lifecycle_status: LifecycleStatus | null
assigned_to: string | null
assigned_user_name: string | null
lifecycle_notes: string | null
internal_priority: 'low' | 'medium' | 'high' | 'critical' | null
status_changed_at: string | null
status_changed_by_name: string | null
```

## Frontend Implementation Steps

1. **Create `useTenderLifecycle` hook** — mutation hook calling `update_tender_status` RPC
2. **Wire up header buttons** — replace toast handler with actual mutation calls
3. **Add lifecycle badge to `TenderListItem`** — colored dot/icon showing current stage
4. **Add lifecycle filter to `FilterPopup`** — dropdown for lifecycle_status
5. **Add lifecycle section to `TenderOpportunityTab`** — show notes, assignment, history
6. **Dashboard integration** — add lifecycle counts to `get_dashboard_stats`

## Multi-Tenant Isolation

- `tender_client_status` has `client_pk` column
- Same tender can have different statuses for different clients
- RLS policies enforce isolation at the database level
- Frontend passes `clientCode` through existing auth context

## Future Extensions

- Lifecycle history/audit trail table
- Bulk lifecycle actions (multi-select in tender list)
- Assignment to specific team members
- Bid value tracking and pipeline analytics
- Integration with proposal generation
