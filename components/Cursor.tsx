import React from 'react';
import { HandData } from '../types';

interface Props {
  handData: HandData;
}

export const Cursor: React.FC<Props> = ({ handData }) => {
  return (
    <>
      {/* Dynamic Cursor Glow */}
      <div
        className="fixed z-[99] pointer-events-none transition-all duration-300 mix-blend-screen blur-2xl rounded-full"
        style={{
          left: handData.x,
          top: handData.y,
          width: handData.isFist ? '120px' : '180px',
          height: handData.isFist ? '120px' : '180px',
          backgroundColor: handData.isFist ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.2)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Main Cursor Element */}
      <div
        className={`fixed z-[100] pointer-events-none flex items-center justify-center transition-transform duration-75 ease-out rounded-full border-2 
          ${handData.isFist ? 'bg-red-500 border-red-200' : 'bg-white/10 backdrop-blur-md border-white/40'}
        `}
        style={{
          left: handData.x,
          top: handData.y,
          width: '64px',
          height: '64px',
          transform: `translate(-50%, -50%) ${handData.isFist ? 'scale(0.8)' : 'scale(1.1)'}`,
        }}
      >
        <div className={`text-3xl transition-all ${handData.isFist ? 'scale-110' : 'scale-100'}`}>
          {handData.isFist ? '✊' : '✋'}
        </div>
        
        {/* Interaction Indicator */}
        <div className={`absolute inset-0 rounded-full border-2 border-white/20 transition-all duration-500
          ${handData.isFist ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
        `} />
      </div>

      {/* Crosshair lines for "High Tech" feel */}
      <div className="fixed inset-0 pointer-events-none z-[98] opacity-5">
        <div className="absolute w-px h-full bg-white" style={{ left: handData.x }} />
        <div className="absolute h-px w-full bg-white" style={{ top: handData.y }} />
      </div>
    </>
  );
};