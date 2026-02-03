# User Management Plan

## Overview

TenderRender is a multi-tenant SaaS where StrideShift provides tender evaluation services to client companies. Each client sees only their own evaluated tenders.

**Key Principle:** StrideShift employees are super-admins who manage all users. Client users can only view their own company's data.

---

## Email Domains

| Domain | Role | Permissions |
|--------|------|-------------|
| `@strideshift.ai` | Super Admin | Create/remove users for ANY client, full system access |
| `@pragmaworld.net` | Client User (Pragma) | View own client's tender data only |
| `@<future-client>.com` | Client User | View own client's tender data only |

---

## User Types

### Super Admin (@strideshift.ai)
- Create users for any client
- Remove users from any client
- View all clients' data (for support purposes)
- Change user roles within clients
- **Cannot** create/delete clients (backend only)

### Client Admin
- View users in their company
- Future: may manage their own team
- Full read access to company's tender data

### Client Viewer
- Read-only access to company's tender data
- Can update own profile (display name, password)
- Cannot manage other users

---

## User Creation Flow

**No invite system.** Manual creation by StrideShift employees.

```
StrideShift admin creates user in admin UI
    → Enter: email, select client
    → System parses name from email (name.surname@domain → "Name Surname")
    → Default password: "changeme123"
    → User receives email with login instructions (manual or future automation)
    → User logs in, changes password
```

### Name Parsing
```
johannes.backer@strideshift.ai → "Johannes Backer"
jane.doe@pragmaworld.net → "Jane Doe"
```

### Default Password
- All new users get password: `changeme123`
- No automated "must change password" check
- Users told to change it (their responsibility)

---

## Security Model

### Why This Is Secure

Supabase uses **JWT tokens** signed by the server. Security is enforced at the database level via **Row Level Security (RLS)**.

```
User logs in
    → Supabase validates credentials
    → Returns signed JWT containing user_id
    → All API requests include this JWT
    → Database extracts user_id via auth.uid()
    → RLS policies filter data based on user's client_pk
```

**Cannot be bypassed because:**
1. JWT is cryptographically signed - can't forge a different user_id
2. RLS runs inside Postgres - client code can't skip it
3. Even crafting raw HTTP requests won't help - the JWT determines identity
4. `auth.uid()` is the single source of truth, not any client-provided parameter

### Client Isolation via RLS

```sql
-- Example: User can only see their client's evaluations
CREATE POLICY "Users see own client evaluations"
  ON tender_evaluations FOR SELECT TO authenticated
  USING (
    rubric_pk IN (
      SELECT rubric_pk FROM client_rubrics
      WHERE client_pk = (
        SELECT client_pk FROM user_profiles WHERE user_id = auth.uid()
      )
    )
  );
```

The `auth.uid()` comes from the JWT - users can't change it.

---

## Multi-Tenant Data Model

```
StrideShift (the company) manages:
    └── clients (table)
            ├── Pragma Holdings (client_pk=1, client_code='pragma')
            ├── Future Client A (client_pk=2, client_code='clienta')
            └── Future Client B (client_pk=3, client_code='clientb')

Each client has:
    └── user_profiles (linked via client_pk)
    └── client_rubrics (evaluation criteria)
    └── tender_evaluations (via rubric_pk → client_pk)
```

### What Each User Sees

| User Type | Sees |
|-----------|------|
| @strideshift.ai | All clients, all data (admin view) |
| @pragmaworld.net | Only Pragma's evaluated tenders |
| @clienta.com | Only Client A's evaluated tenders |

---

## Current State (2026-02-03)

### Database
- `user_profiles` table exists with `client_pk`, `role` columns
- `clients` table has 1 client: "pragma"
- RLS partially implemented (profiles isolated, tenders NOT isolated)
- 0 users registered

### Frontend
- Mock auth only - no real Supabase Auth
- `getClientCode()` reads from env var (bypasses auth entirely)
- LoginCard UI complete

### First Admin
- Email: `johannes.backer@strideshift.ai`
- Role: Super Admin
- To be created in Phase 1

---

## Implementation Phases

### Phase 1: Backend Security (Supabase MCP)

**Goal:** Secure database, create first admin, fix RLS.

| Task | Description | Tool |
|------|-------------|------|
| 1.1 | Add `is_strideshift` column to user_profiles | Supabase MCP |
| 1.2 | Create `handle_new_user()` trigger | Supabase MCP |
| 1.3 | Create first admin (johannes.backer@strideshift.ai) | Supabase MCP |
| 1.4 | Fix tender RLS (client isolation) | Supabase MCP |
| 1.5 | Fix related table RLS (syntheses, docs, changes) | Supabase MCP |
| 1.6 | Add admin management RLS policies | Supabase MCP |
| 1.7 | Create helper function `get_user_client_pk()` | Supabase MCP |
| 1.8 | Test isolation (verify user can't see other clients) | Supabase MCP |

### Phase 2: Frontend Auth (Sonnet Agent)

**Goal:** Replace mock auth with real Supabase Auth.

| Task | Description | Agent |
|------|-------------|-------|
| 2.1 | Implement real login (`signInWithPassword`) | Sonnet |
| 2.2 | Add session management (`onAuthStateChange`) | Sonnet |
| 2.3 | Fetch user profile + client_code on auth | Sonnet |
| 2.4 | Remove `getClientCode()`, use AuthContext | Sonnet |
| 2.5 | Remove dev bypass from ProtectedRoute | Sonnet |
| 2.6 | Add password change UI | Sonnet |
| 2.7 | Add logout functionality (already exists, verify) | Sonnet |
| 2.8 | Handle auth errors (wrong password, etc.) | Sonnet |

### Phase 3: Admin UI (Sonnet Agent)

**Goal:** StrideShift admins can manage users.

| Task | Description | Agent |
|------|-------------|-------|
| 3.1 | Create /admin route (StrideShift only) | Sonnet |
| 3.2 | List all clients | Sonnet |
| 3.3 | List users per client | Sonnet |
| 3.4 | Create user form (email → name parsing, client select) | Sonnet |
| 3.5 | Remove user functionality | Sonnet |
| 3.6 | Change user role dropdown | Sonnet |

### Phase 4: User Settings (Sonnet Agent)

**Goal:** Users can manage their own profile.

| Task | Description | Agent |
|------|-------------|-------|
| 4.1 | Profile settings page | Sonnet |
| 4.2 | Change password form | Sonnet |
| 4.3 | Update display name | Sonnet |
| 4.4 | Notification preferences (future) | Sonnet |

---

## Database Changes

### Schema Updates

```sql
-- Add StrideShift flag to user_profiles
ALTER TABLE user_profiles
ADD COLUMN is_strideshift BOOLEAN DEFAULT false;

-- Add display_name if not exists
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);
```

### Trigger: Auto-create Profile on Signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_display_name TEXT;
  v_is_strideshift BOOLEAN;
BEGIN
  v_email := NEW.email;

  -- Parse display name from email (name.surname@domain → "Name Surname")
  v_display_name := initcap(replace(split_part(v_email, '@', 1), '.', ' '));

  -- Check if StrideShift employee
  v_is_strideshift := v_email LIKE '%@strideshift.ai';

  INSERT INTO public.user_profiles (
    user_id,
    client_pk,
    display_name,
    role,
    is_strideshift
  )
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'client_pk')::integer,
    COALESCE(NEW.raw_user_meta_data->>'display_name', v_display_name),
    CASE WHEN v_is_strideshift THEN 'admin' ELSE 'viewer' END,
    v_is_strideshift
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### RLS Policies

```sql
-- Helper function
CREATE OR REPLACE FUNCTION get_user_client_pk()
RETURNS INTEGER AS $$
  SELECT client_pk FROM user_profiles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_strideshift_user()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_strideshift FROM user_profiles WHERE user_id = auth.uid()),
    false
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Tenders: Users see only their client's evaluated tenders (or all if StrideShift)
DROP POLICY IF EXISTS "Tenders are viewable by authenticated users" ON tenders;
CREATE POLICY "Users view client tenders"
  ON tenders FOR SELECT TO authenticated
  USING (
    is_strideshift_user()
    OR tender_pk IN (
      SELECT te.tender_pk FROM tender_evaluations te
      JOIN client_rubrics cr ON te.rubric_pk = cr.rubric_pk
      WHERE cr.client_pk = get_user_client_pk()
    )
  );

-- User profiles: See own profile, or all if StrideShift admin
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users view profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()  -- Own profile
    OR is_strideshift_user()  -- StrideShift sees all
    OR client_pk = get_user_client_pk()  -- Same company (for team view)
  );

-- Evaluations: Client isolation
DROP POLICY IF EXISTS "Users can view evaluations for their rubrics" ON tender_evaluations;
CREATE POLICY "Users view client evaluations"
  ON tender_evaluations FOR SELECT TO authenticated
  USING (
    is_strideshift_user()
    OR rubric_pk IN (
      SELECT rubric_pk FROM client_rubrics
      WHERE client_pk = get_user_client_pk()
    )
  );
```

---

## Frontend Changes

### Files to Modify

| File | Changes |
|------|---------|
| `AuthContext.tsx` | Real Supabase Auth, profile lookup, remove dev bypass |
| `supabase.ts` | Remove `getClientCode()` |
| `App.tsx` | Remove dev bypass in ProtectedRoute |
| All hooks | Use `useAuth().clientCode` instead of `getClientCode()` |

### New Files

| File | Purpose |
|------|---------|
| `src/features/admin/` | Admin user management UI |
| `src/features/settings/` | User profile settings, change password |
| `src/pages/AdminPage.tsx` | Admin route |
| `src/pages/SettingsPage.tsx` | User settings route |

---

## API Functions Needed

### User Management (for Admin UI)

```sql
-- Create user (StrideShift only)
CREATE OR REPLACE FUNCTION create_user(
  p_email TEXT,
  p_client_pk INTEGER,
  p_role TEXT DEFAULT 'viewer'
)
RETURNS JSON AS $$
  -- Uses Supabase Admin API via Edge Function
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- List users for a client (StrideShift sees all, others see own company)
CREATE OR REPLACE FUNCTION get_users(p_client_pk INTEGER DEFAULT NULL)
RETURNS TABLE(...) AS $$
  -- Returns users filtered by permissions
$$ LANGUAGE sql SECURITY DEFINER;

-- Remove user (StrideShift only)
CREATE OR REPLACE FUNCTION remove_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
  -- Deletes from auth.users (cascades to profile)
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Environment Variables

### Development
```
VITE_SUPABASE_URL=https://weylrgoywbqgkvpndzra.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_DEV_CLIENT_CODE=pragma  # Only for local dev, remove for prod
```

### Production
```
VITE_SUPABASE_URL=https://weylrgoywbqgkvpndzra.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
# NO dev bypass - forces real auth
```

---

## Testing Checklist

### Phase 1 Verification
- [ ] First admin can log in
- [ ] RLS blocks cross-client data access
- [ ] StrideShift user sees all clients
- [ ] Client user sees only their data
- [ ] Raw API requests with forged params still blocked

### Phase 2 Verification
- [ ] Login works with real credentials
- [ ] Session persists on page refresh
- [ ] Logout clears session
- [ ] Wrong password shows error
- [ ] Password change works

### Phase 3 Verification
- [ ] Admin UI only visible to @strideshift.ai
- [ ] Can create user with default password
- [ ] Can remove user
- [ ] Can change user role
- [ ] Name parsed correctly from email

---

## Notes

- **No client creation/deletion** in UI - handled in backend
- **No invite emails** - manual process, tell user their temp password
- **Password security** is user's responsibility after initial login
- **Future:** Could add automated password reset emails via Supabase
