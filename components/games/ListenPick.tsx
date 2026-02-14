
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_ITEMS, GameItem, HandData } from '../../types';
import { speak } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

interface Props {
  onBack: () => void;
  handData: HandData;
}

interface FloatingItem extends GameItem {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const STORAGE_KEY = 'funos_listen_pick_highscore';

export const ListenPick: React.FC<Props> = ({ onBack, handData }) => {
  const [options, setOptions] = useState<FloatingItem[]>([]);
  const [target, setTarget] = useState<GameItem | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const requestRef = useRef<number>(null);

  // Load high score on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const startNewRound = useCallback(() => {
    const shuffled = [...GAME_ITEMS].sort(() => 0.5 - Math.random());
    const roundOptions = shuffled.slice(0, 4).map(item => ({
      ...item,
      id: Math.random().toString(),
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
    const roundTarget = roundOptions[Math.floor(Math.random() * roundOptions.length)];
    
    setOptions(roundOptions);
    setTarget(roundTarget);
    setShowConfetti(false);
    setIsNewRecord(false);
    
    setTimeout(() => {
      speak(`Pop the ${roundTarget.name}!`);
    }, 500);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Animation Loop for floating bubbles
  useEffect(() => {
    const animate = () => {
      setOptions(prev => prev.map(item => {
        let nextX = item.x + item.vx;
        let nextY = item.y + item.vy;
        let nextVx = item.vx;
        let nextVy = item.vy;

        if (nextX < 10 || nextX > 90) nextVx *= -1;
        if (nextY < 10 || nextY > 90) nextVy *= -1;

        return { ...item, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
      }));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);

  const handlePick = (item: FloatingItem) => {
    if (showConfetti) return;
    
    if (item.name === target?.name) {
      const newScore = score + 1;
      setScore(newScore);
      
      // Update High Score
      if (newScore > highScore) {
        setHighScore(newScore);
        setIsNewRecord(true);
        localStorage.setItem(STORAGE_KEY, newScore.toString());
      }

      setShowConfetti(true);
      speak(`POP! You got the ${item.name}!`);
      setTimeout(startNewRound, 2500);
    } else {
      speak(`That's the ${item.name}. Look for the ${target?.name}!`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden bg-gradient-to-b from-blue-900 to-indigo-950">
      <Confetti active={showConfetti} />
      
      {/* Scoreboard UI */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 text-center flex flex-col items-center">
        <h2 className="text-4xl text-blue-200 font-black mb-1">BUBBLE POP!</h2>
        
        <div className="flex gap-8 items-center bg-black/30 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Current Score</span>
            <span className="text-2xl text-white font-black leading-none">{score.toString().padStart(3, '0')}</span>
          </div>
          
          <div className="w-[1px] h-8 bg-white/10" />
          
          <div className="flex flex-col">
            <span className="text-[10px] text-yellow-500 font-mono tracking-widest uppercase">Best Record</span>
            <span className="text-2xl text-yellow-400 font-black leading-none">{highScore.toString().padStart(3, '0')}</span>
          </div>
        </div>

        {isNewRecord && (
          <div className="mt-2 px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-full animate-bounce shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            NEW_HIGH_SCORE_UNLOCKED!
          </div>
        )}
      </div>

      {options.map((item) => (
        <button
          key={item.id}
          onClick={() => handlePick(item)}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          className={`absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300
            ${showConfetti && item.name === target?.name ? 'scale-150' : 'hover:scale-110'}
          `}
        >
          {/* Bubble Visual */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-pulse" />
          <div className="absolute inset-2 bg-gradient-to-tr from-transparent to-white/30 rounded-full" />
          
          <div className="relative flex flex-col items-center justify-center h-full pointer-events-none">
            <span className="text-7xl mb-2">{item.emoji}</span>
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-tighter">{item.name}</span>
          </div>
        </button>
      ))}

      <div className="absolute bottom-10 flex gap-4">
        <button
          onClick={() => target && speak(`Find the ${target.name}`)}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-blue-300 font-mono text-xs hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <span className="animate-pulse">🔊</span> RE-SEND_AUDIO_PROMPT
        </button>
      </div>
    </div>
  );
};
