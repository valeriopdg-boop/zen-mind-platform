// lib/create-session.ts
'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createSessionAndRoom(therapistIndex: number) {
  let {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const { data } = await supabase.auth.signInAnonymously();
    user = data.user;
  }

  const testTherapists = [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
  ];

  const therapistId = testTherapists[therapistIndex];

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      patient_id: user?.id,
      therapist_id: therapistId,
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return session.id; // ← NESSUN fetch Daily
}

