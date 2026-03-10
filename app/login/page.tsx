// app/(auth)/login/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();

  const loginAsPatient = async () => {
    await supabase.auth.signInAnonymously();
    router.push('/test'); // ← OK
  };

  const loginAsTherapist = async () => {
    await supabase.auth.signInAnonymously();
    router.push('/dashboard'); // ← CAMBIATO QUI (senza /therapist)
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-medium text-[#0F766E] mb-8">Zen Mind</h1>
        
        <p className="text-xl text-gray-600 mb-10">Scegli come entrare (modalità test)</p>

        <div className="space-y-4">
          <Button 
            onClick={loginAsPatient}
            className="w-full py-7 text-xl bg-[#14B8A6] hover:bg-[#0F766E]"
          >
            👤 Entra come PAZIENTE
          </Button>

          <Button 
            onClick={loginAsTherapist}
            className="w-full py-7 text-xl bg-[#0F766E] hover:bg-[#0F766E]/90"
          >
            🧠 Entra come TERAPEUTA
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-12">
          (Questo è il login rapido per far partire subito la piattaforma)
        </p>
      </div>
    </div>
  );
}

