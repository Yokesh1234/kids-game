
import React, { useState, useEffect, useCallback } from 'react';
import { HandData } from '../../types';
import { speak } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

interface Block {
  id: number;
  shape: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  isCorrect: boolean;
}

const SHAPES = ['■', '▲', '●', '★'];
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export const LogicBlocks: React.FC<{ onBack: () => void; handData: HandData }> = ({ onBack, handData }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [grabbedId, setGrabbedId] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const initGame = useCallback(() => {
    const newBlocks = SHAPES.map((shape, i) => ({
      id: i,
      shape,
      x: 20 + i * 20,
      y: 70,
      targetX: 20 + i * 20,
      targetY: 30,
      color: COLORS[i],
      isCorrect: false
    }));
    setBlocks(newBlocks);
    setSuccess(false);
    speak("Match the shapes to the glowing holes!");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (handData.isFist) {
      if (grabbedId === null) {
        const hx = (handData.x / window.innerWidth) * 100;
        const hy = (handData.y / window.innerHeight) * 100;
        const target = blocks.find(b => !b.isCorrect && Math.abs(b.x - hx) < 10 && Math.abs(b.y - hy) < 10);
        if (target) setGrabbedId(target.id);
      } else {
        setBlocks(prev => prev.map(b => b.id === grabbedId ? { 
          ...b, 
          x: (handData.x / window.innerWidth) * 100, 
          y: (handData.y / window.innerHeight) * 100 
        } : b));
      }
    } else {
      if (grabbedId !== null) {
        const block = blocks.find(b => b.id === grabbedId);
        if (block && Math.abs(block.x - block.targetX) < 8 && Math.abs(block.y - block.targetY) < 8) {
          setBlocks(prev => prev.map(b => b.id === grabbedId ? { ...b, x: b.targetX, y: b.targetY, isCorrect: true } : b));
          speak("Perfect match!");
        }
        setGrabbedId(null);
      }
    }
  }, [handData, grabbedId, blocks]);

  useEffect(() => {
    if (blocks.length > 0 && blocks.every(b => b.isCorrect)) {
      setSuccess(true);
      speak("Great job! All blocks sorted!");
      setTimeout(initGame, 4000);
    }
  }, [blocks, initGame]);

  return (
    <div className="w-full h-full bg-[#0a0f1e] relative overflow-hidden">
      <Confetti active={success} />
      
      {/* Targets (Holes) */}
      {blocks.map(b => (
        <div 
          key={`target-${b.id}`}
          className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 border-4 border-dashed rounded-2xl flex items-center justify-center text-6xl opacity-20"
          style={{ left: `${b.targetX}%`, top: `${b.targetY}%`, borderColor: b.color, color: b.color }}
        >
          {b.shape}
        </div>
      ))}

      {/* Actual Blocks */}
      {blocks.map(b => (
        <div 
          key={`block-${b.id}`}
          className={`absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-2xl flex items-center justify-center text-7xl transition-transform
            ${grabbedId === b.id ? 'scale-110 shadow-2xl z-20' : 'scale-100'}
            ${b.isCorrect ? 'opacity-100 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'opacity-80'}
          `}
          style={{ left: `${b.x}%`, top: `${b.y}%`, backgroundColor: b.color, color: 'white' }}
        >
          {b.shape}
          {grabbedId === b.id && <div className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl" />}
        </div>
      ))}

      <div className="absolute top-20 left-10 opacity-30">
        <h2 className="text-blue-400 font-mono text-xs tracking-widest uppercase">Geometric Logic Processor</h2>
      </div>
    </div>
  );
};
