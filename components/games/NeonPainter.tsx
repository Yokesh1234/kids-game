
import React, { useState, useEffect, useRef } from 'react';
import { HandData } from '../../types';
import { speak } from '../../services/speechService';

interface Line {
  points: { x: number; y: number }[];
  color: string;
}

export const NeonPainter: React.FC<{ onBack: () => void; handData: HandData }> = ({ onBack, handData }) => {
  const [lines, setLines] = useState<Line[]>([]);
  const currentLineRef = useRef<Line | null>(null);

  useEffect(() => {
    speak("Close your hand to draw magic neon lines!");
  }, []);

  useEffect(() => {
    if (handData.isFist) {
      if (!currentLineRef.current) {
        currentLineRef.current = { points: [{ x: handData.x, y: handData.y }], color: `hsl(${Math.random() * 360}, 100%, 70%)` };
        setLines(prev => [...prev, currentLineRef.current!]);
      } else {
        const lastPoint = currentLineRef.current.points[currentLineRef.current.points.length - 1];
        if (Math.abs(lastPoint.x - handData.x) > 5 || Math.abs(lastPoint.y - handData.y) > 5) {
          currentLineRef.current.points.push({ x: handData.x, y: handData.y });
          setLines(prev => [...prev.slice(0, -1), { ...currentLineRef.current! }]);
        }
      }
    } else {
      currentLineRef.current = null;
    }
  }, [handData]);

  const clearCanvas = () => {
    setLines([]);
    speak("Canvas cleared!");
  };

  return (
    <div className="w-full h-full bg-[#050505] relative cursor-none">
      <svg className="w-full h-full">
        {lines.map((line, i) => (
          <polyline
            key={i}
            points={line.points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={line.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'blur(1px)', dropShadow: '0 0 10px currentColor' }}
          />
        ))}
      </svg>
      
      <div className="absolute top-20 right-10 flex flex-col gap-4">
        <button 
          onClick={clearCanvas}
          className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white text-[10px] font-mono p-4 rounded-xl border border-white/10"
        >
          CLEAR_STORAGE
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center opacity-20">
        <p className="text-white font-mono text-[10px] uppercase tracking-widest">Neural Brush active // Buffer capacity: 1024KB</p>
      </div>
    </div>
  );
};
