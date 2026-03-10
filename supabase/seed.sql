-- NOTA: Crea prima 3 utenti in Supabase Auth (Dashboard) e i profili in profiles,
-- oppure usa questi UUID se hai creato utenti con ID specifici.
insert into therapists (profile_id, orientations, style_scores, specialties, hourly_rate)
values 
  ('00000000-0000-0000-0000-000000000001', ARRAY['CBT', 'Schema Therapy'], '{"directive": 8, "exploratory": 3}', ARRAY['Ansia', 'Autostima'], 49),
  ('00000000-0000-0000-0000-000000000002', ARRAY['EMDR', 'Mindfulness'], '{"directive": 4, "exploratory": 9}', ARRAY['Traumi'], 52),
  ('00000000-0000-0000-0000-000000000003', ARRAY['Psicodinamica'], '{"directive": 3, "exploratory": 9}', ARRAY['Relazioni'], 47)
on conflict (profile_id) do nothing;
