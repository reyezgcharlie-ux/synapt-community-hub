'use client';

import { useEffect, useRef, useState } from 'react';

export default function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTrack, setCurrentTrack] = useState('Cargando...');

  const streamUrl = 'https://live.synfm.online/public/synapt_radio';

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error('Error playing stream:', err));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Simple metadata simulation (in real app use Icecast metadata)
  useEffect(() => {
    const interval = setInterval(() => {
      // Here you can fetch metadata if available
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900 border border-purple-500/30 rounded-3xl p-8 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 neon-glow">
          <span className="text-6xl">📻</span>
        </div>

        <h2 className="text-3xl font-bold mb-2 tracking-tight">SYNAPT RADIO</h2>
        <p className="text-purple-400 text-sm mb-6">EN VIVO • Stream the Future</p>

        <audio ref={audioRef} src={streamUrl} preload="none" />

        <button
          onClick={togglePlay}
          className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-4xl hover:scale-110 transition-all active:scale-95 mb-8"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="w-full max-w-xs">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>Vol</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {currentTrack}
        </div>
      </div>
    </div>
  );
}
