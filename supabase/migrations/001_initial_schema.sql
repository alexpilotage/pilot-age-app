-- ===================================================
-- Pilot-Âge SaaS — Initial Database Schema
-- Run this in Supabase SQL Editor
-- ===================================================

-- === ORGANIZATIONS ===
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  size_range TEXT CHECK (size_range IN ('1-50', '51-200', '201-500', '501-1000', '1001+')) NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired')) NOT NULL,
  subscription_start DATE,
  subscription_end DATE,
  settings JSONB DEFAULT '{}'::jsonb
);

-- === PROFILES ===
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'admin_entreprise', 'salarie')) NOT NULL DEFAULT 'salarie',
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT
);

-- === QUESTIONNAIRE SESSIONS ===
CREATE TABLE public.questionnaire_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')) NOT NULL,
  started_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  participant_count INTEGER DEFAULT 0 NOT NULL
);

-- === QUESTIONS ===
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  type TEXT CHECK (type IN ('yes_no', 'scale', 'multiple_choice', 'single_choice')) NOT NULL,
  options JSONB,
  weight NUMERIC DEFAULT 1 NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- === QUESTIONNAIRE RESPONSES (ANONYMOUS) ===
CREATE TABLE public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  session_id UUID NOT NULL REFERENCES public.questionnaire_sessions(id) ON DELETE CASCADE,
  respondent_token TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC DEFAULT 0 NOT NULL,
  profile_type TEXT CHECK (profile_type IN ('aidant_probable', 'aidant_possible', 'non_aidant')) NOT NULL
);

-- === FORMATIONS ===
CREATE TABLE public.formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT CHECK (type IN ('video', 'guide', 'outil', 'simulateur')) NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  video_url TEXT,
  pdf_url TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT '',
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  access_level TEXT DEFAULT 'registered' CHECK (access_level IN ('free', 'registered', 'premium')) NOT NULL
);

-- === AI CONVERSATIONS ===
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nouvelle conversation',
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL
);

-- ===================================================
-- INDEXES
-- ===================================================
CREATE INDEX idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_sessions_org ON public.questionnaire_sessions(organization_id);
CREATE INDEX idx_sessions_code ON public.questionnaire_sessions(code);
CREATE INDEX idx_responses_session ON public.questionnaire_responses(session_id);
CREATE INDEX idx_formations_type ON public.formations(type);
CREATE INDEX idx_formations_published ON public.formations(is_published);
CREATE INDEX idx_ai_conversations_user ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation ON public.ai_messages(conversation_id);

-- ===================================================
-- ROW LEVEL SECURITY
-- ===================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: get user's organization_id
CREATE OR REPLACE FUNCTION public.user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles
  WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- === PROFILES POLICIES ===
CREATE POLICY "Super admin full access" ON public.profiles
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- === ORGANIZATIONS POLICIES ===
CREATE POLICY "Super admin full access" ON public.organizations
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Members can read own org" ON public.organizations
  FOR SELECT USING (id = public.user_org_id());

-- === QUESTIONNAIRE SESSIONS POLICIES ===
CREATE POLICY "Super admin full access" ON public.questionnaire_sessions
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Admin can manage own org sessions" ON public.questionnaire_sessions
  FOR ALL USING (organization_id = public.user_org_id());

-- === QUESTIONS POLICIES ===
CREATE POLICY "Super admin full access" ON public.questions
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Anyone can read active questions" ON public.questions
  FOR SELECT USING (is_active = true);

-- === QUESTIONNAIRE RESPONSES POLICIES ===
-- Responses are inserted via service role key (server-side)
-- No direct user access to responses (anonymity)
CREATE POLICY "Super admin can read responses" ON public.questionnaire_responses
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Admin can read own org responses" ON public.questionnaire_responses
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM public.questionnaire_sessions
      WHERE organization_id = public.user_org_id()
    )
  );

-- === FORMATIONS POLICIES ===
CREATE POLICY "Super admin full access" ON public.formations
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Published formations readable by authenticated" ON public.formations
  FOR SELECT USING (is_published = true AND auth.uid() IS NOT NULL);

-- === AI CONVERSATIONS POLICIES ===
CREATE POLICY "Users own their conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Super admin can read all" ON public.ai_conversations
  FOR SELECT USING (public.is_super_admin());

-- === AI MESSAGES POLICIES ===
CREATE POLICY "Users own their messages" ON public.ai_messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admin can read all" ON public.ai_messages
  FOR SELECT USING (public.is_super_admin());

-- ===================================================
-- TRIGGERS
-- ===================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-increment participant count on new response
CREATE OR REPLACE FUNCTION public.increment_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.questionnaire_sessions
  SET participant_count = participant_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_response_created
  AFTER INSERT ON public.questionnaire_responses
  FOR EACH ROW EXECUTE FUNCTION public.increment_participant_count();

-- Update ai_conversations.updated_at on new message
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_created
  AFTER INSERT ON public.ai_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();

-- ===================================================
-- ENABLE REALTIME for questionnaire responses
-- ===================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.questionnaire_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.questionnaire_sessions;
