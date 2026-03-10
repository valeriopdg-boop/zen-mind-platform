// app/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const router = useRouter();

  const loginAsPatient = async () => {
    await supabase.auth.signInAnonymously();
    router.push('/test');
  };

  const loginAsTherapist = async () => {
    await supabase.auth.signInAnonymously();
    router.push('/dashboard');
  };

  return (
    <div className="h-screen bg-[#F8FAFC] overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F766E] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">Z</div>
            <span className="text-2xl font-medium text-[#0F766E]">Zen Mind</span>
          </div>
          <Button variant="outline" onClick={() => router.push('/login')}>Accedi</Button>
        </div>
      </nav>

      {/* Hero + scelta paziente/terapeuta */}
      <section className="flex-1 flex items-center pt-32 pb-24 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-6xl font-medium leading-tight mb-6">
            Non cercare uno psicologo.<br />
            <span className="text-[#F8FAFC]">Trova quello giusto per te.</span>
          </h1>
          <p className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            20 domande scientifiche, ti condurranno al terapeuta giusto per te
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <Button 
              onClick={loginAsPatient}
              className="w-full py-7 text-xl bg-[#0F766E] text-white hover:bg-[#0F766E]/90 rounded-2xl font-medium"
            >
              👤 Entra come PAZIENTE
            </Button>
            <Button 
              onClick={loginAsTherapist}
              className="w-full py-7 text-xl bg-[#0F766E] hover:bg-[#0F766E]/90 rounded-2xl font-medium"
            >
              🧠 Entra come TERAPEUTA
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
