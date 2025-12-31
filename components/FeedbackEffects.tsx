
import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
}

const COLORS = ['#FFD700', '#FF69B4', '#00CED1', '#ADFF2F', '#FF4500', '#9370DB'];

export const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 50 }).map((_, i) => ({
        id: Math.random(),
        x: 50, // Center X
        y: 50, // Center Y
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 15 + 10,
        angle: Math.random() * Math.PI * 2,
        velocity: Math.random() * 10 + 5,
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => setPieces([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active && pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute transition-all duration-1000 ease-out flex items-center justify-center"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '20%',
            transform: `translate(${Math.cos(p.angle) * 300}px, ${Math.sin(p.angle) * 300}px) rotate(${p.angle * 100}deg)`,
            opacity: 0,
          }}
        >
          <span style={{ fontSize: '1rem' }}>{Math.random() > 0.8 ? '⭐' : ''}</span>
        </div>
      ))}
      <style>{`
        @keyframes burst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
