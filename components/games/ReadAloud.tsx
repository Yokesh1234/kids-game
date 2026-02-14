import React, { useState, useEffect, useCallback } from 'react';
import { GAME_ITEMS, GameItem, HandData } from '../../types';
import { speak, listen } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

interface Props {
  onBack: () => void;
  handData: HandData;
}

export const ReadAloud: React.FC<Props> = ({ onBack, handData }) => {
  const [target, setTarget] = useState<GameItem | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const startNewRound = useCallback(() => {
    const item = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
    setTarget(item);
    setHeard('');
    setShowConfetti(false);
    
    setTimeout(() => {
      speak(`Read the big word!`);
    }, 500);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleListen = async () => {
    if (isListening || showConfetti) return;
    setIsListening(true);
    setHeard('READING...');
    
    try {
      const transcript = await listen();
      setHeard(transcript.toUpperCase());
      
      if (transcript.toLowerCase().includes(target?.name.toLowerCase() || '')) {
        setShowConfetti(true);
        speak(`Brilliant! You read ${target?.name}!`);
        setTimeout(startNewRound, 3000);
      } else {
        speak(`Try one more time! You can say ${target?.name}!`);
      }
    } catch (err) {
      setHeard('TRY AGAIN...');
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-[#020617] relative">
      <Confetti active={showConfetti} />

      <div className="absolute top-20 text-center opacity-30">
        <h2 className="text-blue-400 font-mono text-xs tracking-[1em] uppercase">Visual Literacy Module</h2>
      </div>

      {target && (
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {target.name.split('').map((char, i) => {
            // Simple distance check for interaction effect
            // In a real physics engine we'd use bounding boxes, but this is a fun approximation
            return (
              <div 
                key={`${target.id}-${i}`}
                className={`text-[12rem] font-black uppercase transition-all duration-300 select-none
                  ${showConfetti ? 'text-green-500 scale-110' : 'text-blue-600'}
                  hover:scale-125 hover:-translate-y-8 cursor-pointer
                `}
                style={{
                  textShadow: showConfetti ? '0 0 40px rgba(34,197,94,0.5)' : '0 0 20px rgba(37,99,235,0.2)',
                  animation: `wiggle ${2 + Math.random()}s ease-in-out infinite`
                }}
              >
                {char}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-8 z-10 w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-md px-12 py-4 rounded-2xl border border-white/10 w-full text-center">
          <p className="text-2xl text-blue-300/60 font-mono tracking-widest italic">
            {heard || 'READY_FOR_SPEECH_DATA'}
          </p>
        </div>
        
        <button
          onClick={handleListen}
          disabled={isListening || showConfetti}
          className={`px-12 py-6 rounded-2xl border-4 border-white/10 flex items-center gap-4 transition-all transform hover:scale-105 active:scale-95
            ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}
            ${showConfetti ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <span className="text-4xl">{isListening ? '🎙️' : '🔊'}</span>
          <span className="text-xl font-black uppercase tracking-tighter">
            {isListening ? 'LISTENING' : 'START_READING'}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};