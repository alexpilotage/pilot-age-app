/* ===================================================
 * Pilot-Âge SaaS — TypeScript Types
 * Source of truth: CdC technique app.pilot-age.fr
 * =================================================== */

// === Roles ===
export type UserRole = "super_admin" | "admin_entreprise" | "salarie";

// === Organizations ===
export type SizeRange = "1-50" | "51-200" | "201-500" | "501-1000" | "1001+";
export type SubscriptionStatus = "trial" | "active" | "expired";

export interface Organization {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  size_range: SizeRange;
  contact_email: string;
  contact_name: string;
  subscription_status: SubscriptionStatus;
  subscription_start: string | null;
  subscription_end: string | null;
  settings: Record<string, unknown>;
}

// === Profiles ===
export interface Profile {
  id: string;
  created_at: string;
  role: UserRole;
  organization_id: string | null;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

// === Questionnaire ===
export type SessionStatus = "draft" | "active" | "closed";
export type QuestionType = "yes_no" | "scale" | "multiple_choice" | "single_choice";
export type ProfileType = "aidant_probable" | "aidant_possible" | "non_aidant";

export interface QuestionnaireSession {
  id: string;
  created_at: string;
  organization_id: string;
  code: string;
  status: SessionStatus;
  started_at: string | null;
  closed_at: string | null;
  participant_count: number;
}

export interface Question {
  id: string;
  order_index: number;
  text: string;
  type: QuestionType;
  options: Record<string, unknown> | null;
  weight: number;
  category: string;
  is_active: boolean;
}

export interface QuestionnaireResponse {
  id: string;
  created_at: string;
  session_id: string;
  respondent_token: string;
  answers: Record<string, unknown>;
  score: number;
  profile_type: ProfileType;
}

// === Formations ===
export type FormationType = "video" | "guide" | "outil" | "simulateur";
export type AccessLevel = "free" | "registered" | "premium";

export interface Formation {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  description: string;
  type: FormationType;
  content: Record<string, unknown>;
  video_url: string | null;
  pdf_url: string | null;
  thumbnail_url: string | null;
  category: string;
  order_index: number;
  is_published: boolean;
  access_level: AccessLevel;
}

// === AI Conversations ===
export type MessageRole = "user" | "assistant";

export interface AIConversation {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  created_at: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
}

// === Dashboard Aggregation ===
export interface SessionStats {
  totalParticipants: number;
  aidantProbable: number;
  aidantPossible: number;
  nonAidant: number;
  participationRate: number;
  avgScore: number;
  profileDistribution: Record<string, number>;
  difficultyTop5: { label: string; count: number }[];
}
