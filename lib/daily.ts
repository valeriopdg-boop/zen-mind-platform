// lib/daily.ts
const DAILY_API_KEY = process.env.DAILY_API_KEY;

export async function createDailyRoom(sessionId: string) {
  if (!DAILY_API_KEY) {
    throw new Error('DAILY_API_KEY non trovata in .env.local');
  }

  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DAILY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `zenmind-${sessionId}-${Date.now()}`,
      privacy: 'public',
      properties: {
        enable_chat: true,
        enable_screenshare: true,
        exp: Math.floor(Date.now() / 1000) + 7200, // 2 ore
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ Daily.co Error:', errorData);
    throw new Error(`Daily.co error: ${errorData.error}`);
  }

  const room = await response.json();

  console.log('✅ Room creata:', room.name);
  console.log('✅ URL completo (da usare):', room.url);

  return {
    name: room.name,
    url: room.url,
  };
}
