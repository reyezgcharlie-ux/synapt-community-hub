'use client';

import { useState, useRef, useEffect } from 'react';

export default function SynaptHub() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [messages, setMessages] = useState([
    { user: 'NeonGhost42', msg: 'Este track está brutal 🔥', time: 'ahora' },
    { user: 'Lun4rW0lf', msg: 'Siente la vibración?', time: '1m' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineCount, setOnlineCount] = useState(247);
  const [timeDisplay, setTimeDisplay] = useState('00:00');
  const [status, setStatus] = useState('LISTO • PRESIONA PLAY');

  const audioRef = useRef<HTMLAudioElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const streamUrl = 'https://live.synfm.online/public/synapt_radio';

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.src = streamUrl;
      try {
        await audio.play();
        setIsPlaying(true);
        setStatus('● EN VIVO');
        
        const start = Date.now();
        const int = setInterval(() => {
          const elapsed = Math.floor((Date.now() - start) / 1000);
          const m = Math.floor(elapsed / 60);
          const s = elapsed % 60;
          setTimeDisplay(`${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
        }, 1000);
        
        (window as any).playerInterval = int;
      } catch {
        setStatus('ERROR DE CONEXIÓN');
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      setStatus('PAUSADO');
      if ((window as any).playerInterval) clearInterval((window as any).playerInterval);
    }
  };

  const adjustVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { user: 'Tú', msg: newMessage.trim(), time: 'ahora' }]);
    setNewMessage('');
    
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);

    setTimeout(() => {
      if (Math.random() > 0.5) {
        const replies = ['Totalmente', 'Jajaja sí', 'Esto es arte', 'Synapt siempre entrega'];
        const users = ['NeonGhost42', 'Lun4rW0lf', 'VoidWalker'];
        setMessages(prev => [...prev, {
          user: users[Math.floor(Math.random()*users.length)],
          msg: replies[Math.floor(Math.random()*replies.length)],
          time: 'ahora'
        }]);
        setOnlineCount(p => p + 1);
      }
    }, 1100);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-purple-900/50 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-2xl font-bold tracking-tighter">SYNAPT HUB</div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#radio" className="hover:text-purple-400">Radio</a>
            <a href="#chat" className="hover:text-purple-400">Chat</a>
            <div className="bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              LIVE
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-950/60 px-4 py-1 rounded-full mb-4 border border-purple-500/40">
            <span className="text-purple-400 text-xs font-bold tracking-[2px]">CONEXIÓN NEURONAL</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4 neon">SYNAPT<br />COMMUNITY HUB</h1>
          <p className="text-xl text-zinc-400">Radio + Chat + Comunidad</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* RADIO */}
          <div id="radio" className="lg:col-span-3">
            <div className="glass border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-purple-950/70 px-4 py-1 rounded-full mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span className="text-purple-400 text-xs font-bold tracking-[2px]">24/7 EN VIVO</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tighter mb-1">SYNAPT RADIO</h2>
                <p className="text-purple-400 text-sm">San José, CA</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className={`flex items-center justify-center gap-2 ${isPlaying ? 'playing' : 'paused'}`}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-black/70 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center">
                      <span className="text-5xl">📻</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-4xl shadow-xl active:scale-95 transition-all"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="font-mono text-sm text-emerald-400 tracking-widest mb-1">{status}</div>
                <div className="font-mono text-xs text-zinc-500">{timeDisplay}</div>
              </div>

              <div className="flex items-center gap-3 px-4">
                <span className="text-lg text-zinc-400">🔈</span>
                <input 
                  type="range" 
                  min="0" max="1" step="0.01" 
                  value={volume}
                  onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-purple-500" 
                />
                <div className="font-mono text-xs text-purple-400 w-8 text-right">{Math.round(volume * 100)}</div>
              </div>
            </div>
          </div>

          {/* CHAT */}
          <div id="chat" className="lg:col-span-2">
            <div className="glass border border-purple-500/30 rounded-3xl h-full flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-purple-500/30 flex items-center justify-between bg-zinc-950/60">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <div>
                    <div className="font-semibold">Chat en Vivo</div>
                    <div className="text-xs text-emerald-400">{onlineCount} conectados</div>
                  </div>
                </div>
                <div className="text-xs px-3 py-1 bg-purple-950 rounded-full text-purple-400 font-mono">#live</div>
              </div>

              <div ref={chatRef} className="flex-1 p-5 overflow-y-auto space-y-4 text-sm bg-zinc-950/40" style={{ maxHeight: '340px' }}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.user === 'Tú' ? 'justify-end' : ''}`}>
                    {m.user !== 'Tú' ? (
                      <div className="max-w-[80%]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-purple-400 text-xs">{m.user}</span>
                          <span className="text-[10px] text-zinc-600">{m.time}</span>
                        </div>
                        <div className="bg-zinc-900 border border-purple-500/30 px-4 py-2 rounded-2xl rounded-tl-none text-sm">{m.msg}</div>
                      </div>
                    ) : (
                      <div className="max-w-[80%]">
                        <div className="flex justify-end mb-1"><span className="text-xs text-purple-400 font-mono">tú</span></div>
                        <div className="bg-purple-600 px-4 py-2 rounded-2xl rounded-tr-none text-sm">{m.msg}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-purple-500/30 bg-zinc-950/80">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe un mensaje..." 
                    className="flex-1 bg-zinc-900 border border-purple-500/40 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                  <button onClick={sendMessage} className="px-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-sm font-semibold active:scale-95">Enviar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-purple-900/50 py-6 text-center text-xs text-zinc-600">
        Stream: live.synfm.online • Synapt Network © 2026
      </footer>

      <audio ref={audioRef} />
    </div>
  );
}
