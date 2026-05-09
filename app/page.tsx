'use client';

import { useState, useRef, useEffect } from 'react';

export default function SynaptHub() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [messages, setMessages] = useState([
    { user: 'NeonGhost42', msg: 'Este track está brutal 🔥', time: 'ahora' },
    { user: 'Lun4rW0lf', msg: 'Alguien más siente la vibración neuronal?', time: 'ahora' },
    { user: 'CyberNaranja', msg: 'Pepinin estaría orgulloso de esta noche', time: '1m' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineCount, setOnlineCount] = useState(247);
  const [timeDisplay, setTimeDisplay] = useState('00:00');
  const [status, setStatus] = useState('LISTO • PRESIONA PLAY');

  const audioRef = useRef<HTMLAudioElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const streamUrl = 'https://live.synfm.online/public/synapt_radio';

  const createParticles = (count: number) => {
    const container = visualizerRef.current;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle absolute';
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      
      particle.style.left = `calc(50% + ${startX}px)`;
      particle.style.top = `calc(50% + ${startY}px)`;
      
      const tx = (Math.random() - 0.5) * 120;
      const ty = (Math.random() - 0.5) * 120 - 40;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      const colors = ['#a855f7', '#ec4899', '#c084fc', '#e0e7ff'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      container.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1800);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.src = streamUrl;
      try {
        await audio.play();
        setIsPlaying(true);
        setStatus('● TRANSMITIENDO EN VIVO');
        
        const startTime = Date.now();
        intervalRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const min = Math.floor(elapsed / 60);
          const sec = elapsed % 60;
          setTimeDisplay(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);
        }, 1000);

        particleIntervalRef.current = setInterval(() => {
          if (isPlaying) createParticles(6);
        }, 420);

        createParticles(14);
      } catch (err) {
        setStatus('⚠️ ERROR DE CONEXIÓN');
        alert('No se pudo conectar al stream. Intenta de nuevo.');
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      setStatus('TRANSMISIÓN PAUSADA');
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (particleIntervalRef.current) clearInterval(particleIntervalRef.current);
    }
  };

  const adjustVolume = (val: number) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, {
      user: 'Tú',
      msg: newMessage.trim(),
      time: 'ahora'
    }]);
    setNewMessage('');

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);

    setTimeout(() => {
      if (Math.random() > 0.4) {
        const replies = ['Totalmente de acuerdo 🔥', 'Jajaja exacto', 'Esto es arte puro', 'La mejor transmisión de la semana', 'Siente la energía?', 'Synapt siempre entregando'];
        const users = ['NeonGhost42', 'Lun4rW0lf', 'VoidWalker', 'PixelVamp', 'NaranjitaX'];
        
        setMessages(prev => [...prev, {
          user: users[Math.floor(Math.random() * users.length)],
          msg: replies[Math.floor(Math.random() * replies.length)],
          time: 'ahora'
        }]);

        setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : 2));
      }
    }, 1200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key.toLowerCase() === 'c' && document.activeElement?.tagName === 'BODY') {
        const input = document.getElementById('chat-input');
        if (input) (input as HTMLInputElement).focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.75) {
        setOnlineCount(prev => Math.max(180, Math.min(320, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <nav className="border-b border-purple-900/50 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tighter">SYNAPT</div>
              <div className="text-[10px] text-purple-400 -mt-1 tracking-[3px]">COMMUNITY HUB</div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <a href="#radio" className="hover:text-purple-400 transition-colors">Radio</a>
            <a href="#chat" className="hover:text-purple-400 transition-colors">Chat</a>
            <a href="#community" className="hover:text-purple-400 transition-colors">Comunidad</a>
            <div className="flex items-center gap-2 bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              24/7 LIVE
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-950/60 px-4 py-1 rounded-full mb-6 border border-purple-500/40">
            <span className="text-purple-400 text-xs font-bold tracking-[2px]">CONEXIÓN NEURONAL • CREATIVIDAD • FUTURO</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter mb-4 neon">
            SYNAPT<br />COMMUNITY HUB
          </h1>
          <p className="text-xl text-zinc-400 max-w-lg mx-auto">
            Radio en vivo + Chat + Comunidad. Todo en un solo lugar.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div id="radio" className="lg:col-span-3">
            <div className="glass border border-purple-500/30 rounded-3xl p-10 shadow-2xl synapt-glow">
              <div className="flex justify-center mb-10">
                <div ref={visualizerRef} className="relative w-[220px] h-[220px] cursor-pointer" onClick={() => createParticles(18)}>
                  <div className={`visualizer absolute inset-0 flex items-center justify-center gap-3 ${isPlaying ? 'playing' : 'paused'}`}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="bar" style={{ animationDelay: `${i * 0.08}s` }}></div>
                    ))}
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-28 h-28 bg-black/70 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-1">📻</div>
                        <div className="text-[9px] text-purple-400 font-mono tracking-widest">LIVE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-purple-950/70 px-5 py-1 rounded-full mb-4 border border-purple-500/40">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span className="text-purple-400 text-xs font-bold tracking-[2px]">STREAM THE FUTURE</span>
                </div>
                
                <h2 className="text-5xl font-bold tracking-tighter mb-2">SYNAPT RADIO</h2>
                <p className="text-purple-400">San José, CA • 24/7</p>
              </div>

              <div className="max-w-xs mx-auto space-y-6">
                <div className="flex justify-center">
                  <button 
                    onClick={togglePlay}
                    className="neon-button w-24 h-24 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black rounded-full flex items-center justify-center text-5xl shadow-2xl active:scale-[0.92] transition-all"
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                </div>

                <div className="text-center">
                  <div className="font-mono text-sm text-emerald-400 tracking-widest mb-1">{status}</div>
                  <div className="font-mono text-xs text-zinc-500">{timeDisplay}</div>
                </div>

                <div className="flex items-center gap-4 px-2">
                  <span className="text-xl text-zinc-400">🔈</span>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.01" 
                    value={volume}
                    onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                    className="flex-1 accent-purple-500 cursor-pointer" 
                  />
                  <div className="font-mono text-xs text-purple-400 w-9 text-right">{Math.round(volume * 100)}</div>
                </div>
              </div>
            </div>
          </div>

          <div id="chat" className="lg:col-span-2">
            <div className="glass border border-purple-500/30 rounded-3xl h-full flex flex-col shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-purple-500/30 flex items-center justify-between bg-zinc-950/60">
                <div className="flex items-center gap-3">
                  <div className="text-xl">💬</div>
                  <div>
                    <div className="font-semibold">Chat en Vivo</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span>{onlineCount}</span> conectados
                    </div>
                  </div>
                </div>
                <div className="text-xs px-3 py-1 bg-purple-950 rounded-full text-purple-400 font-mono">#synapt-live</div>
              </div>

              <div ref={chatRef} className="flex-1 p-5 overflow-y-auto space-y-4 text-sm bg-zinc-950/40" style={{ maxHeight: '380px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-message flex gap-3 ${msg.user === 'Tú' ? 'justify-end' : ''}`}>
                    {msg.user !== 'Tú' ? (
                      <div className="max-w-[75%]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-purple-400 text-xs">{msg.user}</span>
                          <span className="text-[10px] text-zinc-600">{msg.time}</span>
                        </div>
                        <div className="bg-zinc-900 border border-purple-500/30 px-4 py-2 rounded-2xl rounded-tl-none text-sm">
                          {msg.msg}
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-[75%]">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-xs text-purple-400 font-mono">tú</span>
                        </div>
                        <div className="bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm">
                          {msg.msg}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-purple-500/30 bg-zinc-950/80">
                <div className="flex gap-2">
                  <input 
                    id="chat-input"
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe un mensaje..." 
                    className="flex-1 bg-zinc-900 border border-purple-500/40 text-white placeholder:text-zinc-500 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                  />
                  <button 
                    onClick={sendMessage}
                    className="px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                  >
                    ENVIAR
                  </button>
                </div>
                <div className="text-[10px] text-center text-zinc-600 mt-2">Demo local • Presiona C para enfocar</div>
              </div>
            </div>
          </div>
        </div>

        <div id="community" className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-bold tracking-tighter mb-3">Comunidad Synapt</h3>
            <p className="text-zinc-400">Comparte, vota y conecta con otros fans</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="glass border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/50 transition-all">
                <div className="text-4xl mb-4">🌌</div>
                <div className="font-semibold text-xl mb-2">Historia #{i}</div>
                <div className="text-zinc-400 text-sm mb-4 line-clamp-3">
                  {i === 1 && "La noche que Pepinin conoció a Naranjita en el metro de San José..."}
                  {i === 2 && "Un mensaje del más allá llegó a través de la radio a las 3:33am..."}
                  {i === 3 && "El día que el visualizer cobró vida propia durante la transmisión..."}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-purple-400">+{Math.floor(Math.random()*80)+20} votos</div>
                  <button className="text-purple-400 hover:text-purple-300">Votar ↑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-purple-900/50 py-8 text-center text-xs text-zinc-600">
        Stream: live.synfm.online • Synapt Network © 2026 • Hecho con ❤️ para la comunidad
      </footer>

      <audio ref={audioRef} />
    </div>
  );
}
