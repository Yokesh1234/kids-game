import React, { useState, useEffect, useCallback } from 'react';
import { GAME_ITEMS, GameItem, HandData } from '../../types';
import { speak, listen } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

interface Props {
  onBack: () => void;
  handData: HandData;
}

export const ShowSay: React.FC<Props> = ({ onBack, handData }) => {
  const [target, setTarget] = useState<GameItem | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const startNewRound = useCallback(() => {
    const roundTarget = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
    setTarget(roundTarget);
    setHeard('');
    setShowConfetti(false);
    setRevealed(false);
    
    setTimeout(() => {
      speak(`A mystery prize! What's inside the box?`);
    }, 500);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleListen = async () => {
    if (isListening || revealed) return;
    setIsListening(true);
    setHeard('LISTENING...');
    
    try {
      const transcript = await listen();
      setHeard(transcript.toUpperCase());
      
      if (transcript.toLowerCase().includes(target?.name.toLowerCase() || '')) {
        setRevealed(true);
        setShowConfetti(true);
        speak(`BOOM! It's the ${target?.name}! You guessed it!`);
        setTimeout(startNewRound, 4000);
      } else {
        speak(`Not quite! It looks a bit like a ${target?.name}. Try again?`);
      }
    } catch (err) {
      setHeard('EYES ON ME...');
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-[#0a0a0a] relative">
      <Confetti active={showConfetti} />
      
      <div className="z-10 text-center mb-12">
        <h2 className="text-blue-500 font-mono text-sm tracking-[0.5em] mb-4 uppercase">Neural Reveal Protocol</h2>
        <div className="h-1 w-24 bg-blue-500/20 mx-auto" />
      </div>

      <div className="relative group cursor-pointer" onClick={handleListen}>
        {/* Mystery Box / Content */}
        <div className={`w-80 h-80 rounded-[3rem] transition-all duration-700 flex flex-col items-center justify-center border-8 shadow-2xl
          ${revealed 
            ? 'bg-white border-green-500 scale-110 rotate-6 shadow-green-500/20' 
            : 'bg-slate-900 border-blue-500/30 animate-pulse'
          }
        `}>
          {revealed ? (
            <>
              <img src={target?.image} alt="Revealed" className="w-64 h-64 object-cover rounded-2xl mb-4" />
              <span className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{target?.name}</span>
            </>
          ) : (
            <div className="flex flex-col items-center text-blue-500">
              <span className="text-9xl mb-4">?</span>
              <span className="text-xs font-mono opacity-50">ENCRYPTED_ASSET</span>
            </div>
          )}
        </div>

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-[3rem] blur-3xl transition-opacity duration-1000 -z-10
          ${revealed ? 'bg-green-500 opacity-20' : 'bg-blue-500 opacity-10'}
        `} />
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="h-12 flex items-center">
           <span className="text-xl font-mono text-white/40 tracking-widest uppercase">
            {heard || 'Awaiting Voice Input...'}
           </span>
        </div>

        <button
          onClick={handleListen}
          disabled={isListening || revealed}
          className={`group relative p-8 rounded-full border-4 border-white/10 transition-all transform hover:scale-110 active:scale-90
            ${isListening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-blue-600'}
            ${revealed ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          `}
        >
          <span className="text-5xl">{isListening ? '🔴' : '🎤'}</span>
          <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-20" />
        </button>
      </div>
    </div>
  );
};