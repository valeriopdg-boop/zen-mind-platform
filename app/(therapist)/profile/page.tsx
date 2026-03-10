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
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(55);
  const [specialties, setSpecialties] = useState<string[]>(["Ansia", "Depressione", "Relazioni"]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('therapists')
      .select('*')
      .eq('profile_id', user?.id)
      .single();

    if (data) {
      setBio(data.bio || '');
      setHourlyRate(data.hourly_rate || 55);
      setSpecialties(data.specialties || []);
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    const updateData: Record<string, unknown> = {
      bio: bio,
      hourly_rate: hourlyRate,
      specialties: specialties,
    };
    const { error } = await supabase
      .from('therapists')
      .update(updateData)
      .eq('profile_id', user?.id);

    if (error) alert("Errore durante il salvataggio");
    else alert("✅ Profilo e disponibilità salvati con successo!");

    setSaving(false);
  };

  const toggleSpecialty = (spec: string) => {
    if (specialties.includes(spec)) {
      setSpecialties(specialties.filter(s => s !== spec));
    } else {
      setSpecialties([...specialties, spec]);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center text-white text-2xl">Caricamento profilo...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-medium mb-10">Modifica Profilo e Disponibilità</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Foto + Bio */}
          <div className="bg-[#1E2937] rounded-3xl p-10">
            <h2 className="text-2xl font-medium mb-6">Foto Profilo e Bio</h2>

            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#14B8A6] to-[#0F766E] rounded-3xl flex items-center justify-center text-7xl mb-8 cursor-pointer hover:scale-105 transition">
              👩‍⚕️
            </div>

            <Textarea
              placeholder="Scrivi una bio professionale che descriva il tuo approccio..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="h-52 bg-[#0F172A] border-none text-white placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Tariffa e Specializzazioni */}
          <div className="bg-[#1E2937] rounded-3xl p-10">
            <h2 className="text-2xl font-medium mb-6">Tariffa e Specializzazioni</h2>

            <div className="mb-10">
              <label className="text-sm text-gray-400 block mb-3">Tariffa per seduta (50€ - 80€)</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={50}
                  max={80}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="bg-[#0F172A] text-5xl font-semibold w-40 text-center border-gray-700 text-white"
                />
                <span className="text-5xl text-[#14B8A6]">€</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-4">Specializzazioni (seleziona quelle in cui sei esperto)</label>
              <div className="flex flex-wrap gap-3">
                {["Ansia", "Depressione", "Traumi", "Relazioni di coppia", "Burnout", "Autostima", "Disturbi alimentari", "EMDR", "Mindfulness", "Schema Therapy"].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => toggleSpecialty(spec)}
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
          disabled={saving}
          className="w-full mt-12 py-8 text-xl bg-[#14B8A6] hover:bg-[#0F766E] disabled:bg-gray-600"
        >
          {saving ? "Salvataggio in corso..." : "Salva tutte le modifiche"}
        </Button>
      </div>
    </div>
  );
}
