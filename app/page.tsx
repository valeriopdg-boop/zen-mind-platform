// app/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#0A0F1C]/90 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#14B8A6] to-[#0F766E] rounded-2xl flex items-center justify-center text-3xl font-bold">Z</div>
            <span className="text-3xl font-semibold tracking-tight">Zen Mind</span>
          </div>
          <Button onClick={() => router.push('/login')} className="button-primary px-8 py-6 text-lg rounded-2xl">
            Inizia ora
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-[#0A0F1C] via-[#0F172A] to-[#0A0F1C]">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-7xl font-medium leading-none mb-8 tracking-tighter">
            Trova il terapeuta<br />giusto per te.
          </h1>
          <Button
            onClick={() => router.push('/login')}
            className="button-primary text-2xl px-16 py-8 rounded-3xl font-medium shadow-2xl shadow-[#14B8A6]/30"
          >
            Inizia il test ora
            <ArrowRight className="ml-4" />
          </Button>
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
