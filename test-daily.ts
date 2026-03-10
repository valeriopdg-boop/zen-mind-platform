// test-daily.ts (cancellalo dopo il test)
import { createDailyRoom } from './lib/daily';

async function test() {
  try {
    const room = await createDailyRoom('test-session-123');
    console.log('✅ Room creata con successo!');
    console.log('URL:', room.url);
    console.log('Name:', room.name);
  } catch (e) {
    console.error('❌ Errore:', e);
  }
}

test();
