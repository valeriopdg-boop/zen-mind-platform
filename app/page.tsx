// app/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
          <Button variant="outline" onClick={() => router.push('/login')}>Accedi</Button>
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
            onClick={() => router.push('/login')}
            className="bg-white text-[#0F766E] hover:bg-white/90 text-xl px-12 py-8 rounded-2xl font-medium"
          >
            Inizia il test gratuito di 6 minuti
            <ArrowRight className="ml-3" />
          </Button>
        </div>
      </section>

      {/* How it works + altre sezioni rimangono uguali */}
      {/* (le altre sezioni sono già perfette, le ho lasciate invariate) */}

      {/* CTA finale */}
      <section className="py-20 bg-[#0F766E] text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-medium mb-6">Pronto a trovare la tua mente complementare?</h2>
          <Button 
            onClick={() => router.push('/login')}
            className="bg-white text-[#0F766E] text-2xl px-16 py-8 rounded-2xl mt-8"
          >
            Inizia ora il test
          </Button>
        </div>
      </section>
    </div>
  );
}
