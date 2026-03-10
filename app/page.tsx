// app/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Users, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F766E] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">Z</div>
            <span className="text-2xl font-medium text-[#0F766E]">Zen Mind</span>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/login')}>Accedi</Button>
            <Button onClick={() => router.push('/login')}>Inizia ora</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-6xl font-medium leading-tight mb-6">
            Non cercare uno psicologo.<br />
            <span className="text-[#F8FAFC]">Trova quello giusto per te.</span>
          </h1>
          <p className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            20 domande scientifiche • Matching al 90%+ • Solo 10€ a Zen Mind
          </p>
          <Button 
            size="lg"
            onClick={() => router.push('/login')}
            className="bg-white text-[#0F766E] hover:bg-white/90 text-xl px-12 py-8 rounded-2xl font-medium"
          >
            Inizia il test gratuito di 6 minuti
            <ArrowRight className="ml-3" />
          </Button>
          <p className="text-sm mt-6 text-white/70">Più di 3.200 persone hanno già trovato il loro terapeuta</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-medium text-center mb-12">Come funziona</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Fai il test</h3>
              <p className="text-gray-600">20 domande su problema, scuola di pensiero, stile e personalità</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Ricevi i match</h3>
              <p className="text-gray-600">Ti mostriamo i 3 terapeuti più compatibili con spiegazione chiara</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Inizia la terapia</h3>
              <p className="text-gray-600">Prenota la prima sessione. Solo 10€ a Zen Mind, il resto al terapeuta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Differenziali */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium mb-12">Perché scegliere Zen Mind</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow">
              <Award className="w-12 h-12 text-[#14B8A6] mx-auto mb-6" />
              <h3 className="text-2xl font-medium mb-3">Matching scientifico</h3>
              <p className="text-gray-600">Non ti diamo lo psicologo disponibile. Ti diamo quello più compatibile al 90%+</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow">
              <Users className="w-12 h-12 text-[#14B8A6] mx-auto mb-6" />
              <h3 className="text-2xl font-medium mb-3">Solo 10€</h3>
              <p className="text-gray-600">Tratteniamo sempre e solo 10€ a seduta. Il resto va interamente al terapeuta</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow">
              <Check className="w-12 h-12 text-[#14B8A6] mx-auto mb-6" />
              <h3 className="text-2xl font-medium mb-3">Video integrata</h3>
              <p className="text-gray-600">Tutto dentro la piattaforma. Nessun Zoom, nessuna app esterna</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="py-20 bg-[#0F766E] text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-medium mb-6">Pronto a trovare la tua mente complementare?</h2>
          <Button 
            size="lg"
            onClick={() => router.push('/login')}
            className="bg-white text-[#0F766E] text-2xl px-16 py-8 rounded-2xl mt-8"
          >
            Inizia ora il test
          </Button>
        </div>
      </section>

      <footer className="py-12 bg-white text-center text-gray-500 text-sm">
        © 2026 Zen Mind • Piattaforma Psicologia Italiana
      </footer>
    </div>
  );
}

