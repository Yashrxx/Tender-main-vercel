-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → your project → SQL Editor)
-- This creates all 4 tables needed for the Tender app

-- 1. Users table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(255),
  website VARCHAR(255),
  industry VARCHAR(255),
  description TEXT,
  address VARCHAR(255),
  logo VARCHAR(500),
  "coverImage" VARCHAR(500),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tenders table
CREATE TABLE IF NOT EXISTS public.tenders (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  budget INTEGER NOT NULL,
  category VARCHAR(255) DEFAULT 'General',
  location VARCHAR(255) DEFAULT 'Not Specified',
  status VARCHAR(255) DEFAULT 'Open',
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES public.companies(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id SERIAL PRIMARY KEY,
  tender_id INTEGER NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  message TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS so serverless functions with service_role key can access freely
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies that allow the service_role key full access
CREATE POLICY "Service role full access" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.tenders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.applications FOR ALL USING (true) WITH CHECK (true);
