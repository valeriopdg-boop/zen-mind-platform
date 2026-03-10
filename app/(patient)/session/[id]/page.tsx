// app/(patient)/session/[id]/page.tsx
'use client';
import { use } from 'react';
import VideoCall from '@/components/VideoCall';

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const testRoomUrl = 'https://zenmind.daily.co/zenmind-test-2026';

  return <VideoCall roomUrl={testRoomUrl} sessionId={id} />;
}


