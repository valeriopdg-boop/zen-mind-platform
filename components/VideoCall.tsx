'use client';

export default function VideoCall({ roomUrl, sessionId }: { roomUrl: string; sessionId: string }) {
  return (
    <div className="fixed inset-0 bg-[#0F766E] flex flex-col z-50">
      <div className="bg-black/40 p-4 flex justify-between items-center text-white">
        <div>
          <h2 className="text-xl font-medium">Zen Mind • Sessione in corso</h2>
          <p className="text-sm opacity-75">ID: {sessionId}</p>
        </div>
        <button
          onClick={() => (window.location.href = '/results')}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-sm font-medium"
        >
          Esci dalla chiamata
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-6">📹</div>
          <h3 className="text-3xl font-medium mb-4">Videochiamata in corso</h3>
          <p className="text-xl opacity-80">Room pronta • In attesa del terapeuta</p>
          <p className="text-sm mt-8 opacity-60">URL room: {roomUrl}</p>
          <p className="text-xs mt-12 opacity-50">MVP completato – Video simulata per test</p>
        </div>
      </div>
    </div>
  );
}


