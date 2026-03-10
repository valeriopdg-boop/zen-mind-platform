// app/(therapist)/profile/page.tsx
'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TherapistProfile() {
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(55);
  const [specialties, setSpecialties] = useState<string[]>([
    "Ansia", "Depressione", "Relazioni", "Autostima"
  ]);
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from('therapists')
      .update({
        bio: bio,
        hourly_rate: hourlyRate,
        specialties: specialties
      })
      .eq('profile_id', user?.id);

    alert("✅ Profilo e disponibilità salvati correttamente!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-medium mb-10">Modifica Profilo e Disponibilità</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Sezione Foto + Bio */}
          <div className="bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6">Foto Profilo e Bio</h2>

            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#14B8A6] to-[#0F766E] rounded-3xl flex items-center justify-center text-6xl mb-8">
              👩‍⚕️
            </div>

            <Textarea
              placeholder="Scrivi qui la tua bio professionale (massimo 800 caratteri)..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="h-48 bg-[#0F172A] border-none text-white placeholder:text-gray-400"
            />
          </div>

          {/* Sezione Prezzo e Specializzazioni */}
          <div className="bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6">Tariffa e Specializzazioni</h2>

            <div className="mb-10">
              <label className="block text-sm text-gray-400 mb-3">Tariffa per seduta</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={50}
                  max={80}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="bg-[#0F172A] text-4xl font-semibold w-40 text-center border-gray-700 text-white"
                />
                <span className="text-4xl text-[#14B8A6]">€</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Range consentito: 50€ — 80€</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-4">Specializzazioni (clicca per selezionare)</label>
              <div className="flex flex-wrap gap-3">
                {["Ansia", "Depressione", "Traumi", "Relazioni di coppia", "Burnout", "Autostima", "Disturbi alimentari", "EMDR", "Mindfulness"].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      if (specialties.includes(spec)) {
                        setSpecialties(specialties.filter(s => s !== spec));
                      } else {
                        setSpecialties([...specialties, spec]);
                      }
                    }}
                    className={`px-6 py-3 rounded-2xl text-sm transition-all ${
                      specialties.includes(spec)
                        ? 'bg-[#14B8A6] text-black font-medium'
                        : 'bg-[#0F172A] hover:bg-[#1E2937]'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={saveProfile}
          disabled={loading}
          className="w-full mt-12 py-8 text-xl bg-[#14B8A6] hover:bg-[#0F766E]"
        >
          {loading ? "Salvataggio..." : "Salva tutte le modifiche"}
        </Button>
      </div>
    </div>
  );
}
