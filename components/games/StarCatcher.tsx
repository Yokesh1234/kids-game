
import React, { useState, useEffect, useRef } from 'react';
import { HandData } from '../../types';
import { speak } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export const StarCatcher: React.FC<{ onBack: () => void; handData: HandData }> = ({ onBack, handData }) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const gameLoopRef = useRef<number>(null);
  const starIdRef = useRef(0);

  useEffect(() => {
    speak("Catch the falling stars with your magic hand!");
    const spawnInterval = setInterval(() => {
      setStars(prev => [...prev, {
        id: ++starIdRef.current,
        x: Math.random() * 80 + 10,
        y: -10,
        size: Math.random() * 40 + 30,
        speed: Math.random() * 2 + 1
      }]);
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      setStars(prev => {
        const nextStars = prev.map(s => ({ ...s, y: s.y + s.speed })).filter(s => s.y < 110);
        
        // Collision detection
        const caught = nextStars.find(s => {
          const dx = (s.x / 100 * window.innerWidth) - handData.x;
          const dy = (s.y / 100 * window.innerHeight) - handData.y;
          return Math.sqrt(dx * dx + dy * dy) < s.size + 40;
        });

        if (caught) {
          setScore(s => s + 10);
          if (Math.random() > 0.8) speak("Good catch!");
          return nextStars.filter(s => s.id !== caught.id);
        }
        return nextStars;
      });
      gameLoopRef.current = requestAnimationFrame(update);
    };
    gameLoopRef.current = requestAnimationFrame(update);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [handData]);

  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <h2 className="text-4xl text-yellow-400 font-black mb-2 tracking-tighter uppercase">Gravity Harvester</h2>
        <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-yellow-500/30 text-2xl text-white font-mono">
          STARS: {score}
        </div>
      </div>

      {stars.map(s => (
        <div 
          key={s.id}
          className="absolute flex items-center justify-center transition-transform"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
        >
          <div className="text-4xl animate-spin" style={{ animationDuration: '3s' }}>⭐</div>
          <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse" />
        </div>
      ))}

      <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/20" />
    </div>
  );
};
