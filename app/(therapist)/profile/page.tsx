// app/(therapist)/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TherapistProfile() {
  const [therapist, setTherapist] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(55);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('therapists')
      .select('*')
      .eq('profile_id', user?.id)
      .single();

    if (data) {
      setTherapist(data);
      setBio(data.bio || '');
      setHourlyRate(data.hourly_rate || 55);
      setSpecialties(data.specialties || []);
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from('therapists')
      .update({
        bio: bio,
        hourly_rate: hourlyRate,
        specialties: specialties
      })
      .eq('profile_id', user?.id);

    alert("Profilo e disponibilità aggiornati correttamente!");
  };

  if (loading) return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center text-white">Caricamento profilo...</div>;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-medium mb-10">Modifica Profilo e Disponibilità</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Foto e Bio */}
          <div className="bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6">Foto e Descrizione</h2>

            <div className="w-32 h-32 bg-gray-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              📸
            </div>

            <Textarea
              placeholder="Scrivi una breve bio professionale..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="h-40 bg-[#0F172A] border-gray-700"
            />
          </div>

          {/* Prezzo e Specializzazioni */}
          <div className="bg-[#1E2937] rounded-3xl p-8">
            <h2 className="text-2xl font-medium mb-6">Tariffa e Specializzazioni</h2>

            <div className="mb-8">
              <label className="text-sm text-gray-400 block mb-2">Tariffa per seduta</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="bg-[#0F172A] text-3xl font-semibold w-32 border-gray-700 text-white"
                />
                <span className="text-2xl">€</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Range consentito: 50€ – 80€</p>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-3">Specializzazioni</label>
              <div className="flex flex-wrap gap-2">
                {["Ansia", "Depressione", "Traumi", "Relazioni", "Burnout", "Autostima", "Disturbi alimentari", "EMDR"].map(spec => (
                  <button
                    key={spec}
                    onClick={() => {
                      if (specialties.includes(spec)) {
                        setSpecialties(specialties.filter(s => s !== spec));
                      } else {
                        setSpecialties([...specialties, spec]);
                      }
                    }}
                    className={`px-5 py-2 rounded-full text-sm transition-all ${
                      specialties.includes(spec)
                        ? 'bg-[#14B8A6] text-black'
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
          className="w-full mt-12 py-8 text-xl bg-[#14B8A6] hover:bg-[#0F766E]"
        >
          Salva Modifiche
        </Button>
      </div>
    </div>
  );
}
