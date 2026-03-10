// app/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const router = useRouter();

  const loginAsPatient = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } catch (e: any) {
      console.error('Auth error:', e);
      const msg = e?.message ?? String(e);
      if (msg.includes('fetch') || msg.includes('Anonymous') || msg.includes('network')) {
        alert('Auth non disponibile. Verifica .env e Supabase → Auth → abilita "Anonymous sign-ins".');
      }
    }
    router.push('/test');
  };

  const loginAsTherapist = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } catch (e: any) {
      console.error('Auth error:', e);
      const msg = e?.message ?? String(e);
      if (msg.includes('fetch') || msg.includes('Anonymous') || msg.includes('network')) {
        alert('Auth non disponibile. Verifica .env e Supabase → Auth → abilita "Anonymous sign-ins".');
      }
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#0A0F1C]/90 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#14B8A6] to-[#0F766E] rounded-2xl flex items-center justify-center text-3xl font-bold">Z</div>
            <span className="text-3xl font-semibold tracking-tight">Zen Mind</span>
          </div>
          <a href="#hero" className="button-primary px-8 py-6 text-lg rounded-2xl inline-block">
            Inizia ora
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-24 bg-gradient-to-br from-[#0A0F1C] via-[#0F172A] to-[#0A0F1C]">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-7xl font-medium leading-none mb-8 tracking-tighter">
            Trova il terapeuta<br />giusto per te.
          </h1>
          <p className="text-xl text-white/70 mb-10">Scegli come entrare</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={loginAsPatient}
              className="button-primary text-xl px-12 py-7 rounded-2xl font-medium shadow-xl shadow-[#14B8A6]/20"
            >
              👤 Entra come PAZIENTE
            </Button>
            <Button
              onClick={loginAsTherapist}
              className="button-primary text-xl px-12 py-7 rounded-2xl font-medium shadow-xl shadow-[#14B8A6]/20 border border-[#14B8A6]/50"
            >
              🧠 Entra come TERAPEUTA
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#14B8A6]/10 rounded-3xl flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-[#14B8A6]" />
            </div>
            <h3 className="text-2xl font-medium mb-3">Matching Scientifico</h3>
            <p className="text-white/70">Non ti diamo il primo disponibile. Ti diamo il più compatibile.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#14B8A6]/10 rounded-3xl flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-[#14B8A6]" />
            </div>
            <h3 className="text-2xl font-medium mb-3">Trasparenza Totale</h3>
            <p className="text-white/70">Paga solo il prezzo del terapeuta.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#14B8A6]/10 rounded-3xl flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-[#14B8A6]" />
            </div>
            <h3 className="text-2xl font-medium mb-3">Video Integrata</h3>
            <p className="text-white/70">Tutto dentro Zen Mind. Qualità alta, zero app esterne.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-white/40 text-sm">
        © 2026 Zen Mind • Piattaforma di Psicologia Italiana
      </footer>
    </div>
  );
}
