# Auto Email-Domain-to-Client Mapping

**Status:** Open
**Date:** 2026-02-20
**Priority:** Medium

## Problem

When new users are created in Supabase Auth, the `handle_new_user()` trigger only checks for `@strideshift.ai` emails to set `is_strideshift = true`. All other users get `client_pk = NULL`, meaning they can't see any client data until an admin manually updates their `user_profiles.client_pk`.

## Current Behavior

1. User created with email `jane@pragmaworld.net`
2. Trigger fires, sets `is_strideshift = false`, `role = 'viewer'`, `client_pk = NULL`
3. User logs in — AuthContext finds no client — user sees nothing
4. Admin must manually run: `UPDATE user_profiles SET client_pk = 1 WHERE user_id = '...'`

## Proposed Fix

### 1. Add `email_domain` column to `clients` table

```sql
ALTER TABLE public.clients ADD COLUMN email_domain VARCHAR(255);
UPDATE public.clients SET email_domain = 'pragmaworld.net' WHERE client_code = 'pragma';
```

### 2. Update `handle_new_user()` trigger

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_domain TEXT;
  v_display_name TEXT;
  v_is_strideshift BOOLEAN;
  v_client_pk INTEGER;
BEGIN
  v_email := NEW.email;
  v_domain := split_part(v_email, '@', 2);
  v_display_name := initcap(replace(split_part(v_email, '@', 1), '.', ' '));
  v_is_strideshift := v_email LIKE '%@strideshift.ai';

  -- Auto-match email domain to client
  IF NOT v_is_strideshift THEN
    SELECT c.client_pk INTO v_client_pk
    FROM public.clients c
    WHERE c.email_domain = v_domain AND c.is_active = true
    LIMIT 1;
  END IF;

  -- Allow override from raw_user_meta_data if provided
  IF (NEW.raw_user_meta_data->>'client_pk') IS NOT NULL THEN
    v_client_pk := (NEW.raw_user_meta_data->>'client_pk')::integer;
  END IF;

  INSERT INTO public.user_profiles (
    user_id, client_pk, display_name, role, is_strideshift
  ) VALUES (
    NEW.id,
    v_client_pk,
    COALESCE(NEW.raw_user_meta_data->>'display_name', v_display_name),
    CASE WHEN v_is_strideshift THEN 'admin'
         ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
    END,
    v_is_strideshift
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### 3. Populate existing clients

When onboarding a new client, set their `email_domain`:

```sql
INSERT INTO public.clients (client_code, client_name, email_domain, is_active)
VALUES ('newclient', 'New Client Ltd', 'newclient.co.za', true);
```

## Edge Cases to Consider

- **Multiple domains per client:** If a client has multiple email domains (e.g. `pragma.co.za` and `pragmaworld.net`), consider making `email_domain` a text array or a separate `client_domains` table.
- **Unknown domains:** If no domain match is found, `client_pk` stays NULL. The frontend should show a clear "no client assigned" message rather than an empty dashboard.
- **Manual override:** The `raw_user_meta_data.client_pk` override is preserved so admins can still assign users manually when creating them.

## Files Affected

- Database: `handle_new_user()` function
- Database: `clients` table (new column)
- Optional frontend: error state for users with no assigned client
