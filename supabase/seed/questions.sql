-- ===================================================
-- Pilot-Âge SaaS — Seed: Questionnaire Aidants
-- Run this in Supabase SQL Editor after initial migration
-- ===================================================

INSERT INTO public.questions (order_index, text, type, options, weight, category, is_active) VALUES
(
  1,
  'Apportez-vous une aide régulière à un proche (parent, conjoint, enfant, ami) en situation de dépendance, de handicap ou de maladie ?',
  'yes_no',
  NULL,
  2,
  'identification',
  true
),
(
  2,
  'Cette aide concerne-t-elle des activités de la vie quotidienne (repas, toilette, déplacements, courses, gestion administrative) ?',
  'yes_no',
  NULL,
  1.5,
  'identification',
  true
),
(
  3,
  'Combien d''heures par semaine consacrez-vous en moyenne à cette aide ?',
  'single_choice',
  '["Moins de 5h", "5 à 10h", "10 à 20h", "Plus de 20h"]',
  1.5,
  'charge',
  true
),
(
  4,
  'Depuis combien de temps apportez-vous cette aide ?',
  'single_choice',
  '["Moins de 6 mois", "6 mois à 2 ans", "2 à 5 ans", "Plus de 5 ans"]',
  1,
  'charge',
  true
),
(
  5,
  'Ressentez-vous de la fatigue physique ou émotionnelle liée à votre rôle d''aidant ?',
  'scale',
  NULL,
  1.5,
  'impact',
  true
),
(
  6,
  'Votre rôle d''aidant a-t-il un impact sur votre travail (absences, retards, difficulté de concentration) ?',
  'scale',
  NULL,
  1.5,
  'impact_pro',
  true
),
(
  7,
  'Avez-vous déjà renoncé à des activités personnelles ou professionnelles à cause de votre rôle d''aidant ?',
  'yes_no',
  NULL,
  1,
  'impact',
  true
),
(
  8,
  'Connaissez-vous les dispositifs d''aide aux aidants (congé de proche aidant, aides financières, plateformes de répit) ?',
  'yes_no',
  NULL,
  0.5,
  'connaissance',
  true
),
(
  9,
  'Vous sentez-vous suffisamment soutenu(e) par votre entourage et/ou votre employeur dans votre rôle d''aidant ?',
  'scale',
  NULL,
  1,
  'soutien',
  true
),
(
  10,
  'Seriez-vous intéressé(e) par des ressources ou un accompagnement proposé par votre entreprise ?',
  'yes_no',
  NULL,
  0.5,
  'interet',
  true
);
