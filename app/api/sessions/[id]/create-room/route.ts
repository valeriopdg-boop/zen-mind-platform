// app/api/sessions/[id]/create-room/route.ts
import { createClient } from '@supabase/supabase-js';
import { createDailyRoom } from '@/lib/daily';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) {
    return Response.json({ error: 'Sessione non trovata' }, { status: 404 });
  }

  const room = await createDailyRoom(id);

  await supabase
    .from('sessions')
    .update({
      daily_room_name: room.name,
      daily_room_url: room.url,
    })
    .eq('id', id);

  return Response.json({ url: room.url });
}
