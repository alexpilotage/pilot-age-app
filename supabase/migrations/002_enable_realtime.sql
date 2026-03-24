-- ============================================
-- Phase 3: Enable Supabase Realtime
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable Realtime on questionnaire_responses table
-- This allows the dashboard to receive live updates
alter publication supabase_realtime add table questionnaire_responses;

-- Enable Realtime on questionnaire_sessions table (for status changes)
alter publication supabase_realtime add table questionnaire_sessions;
