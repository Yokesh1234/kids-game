
import React from 'react';
import { HandData } from '../types';

interface Props {
  handData: HandData;
}

export const Cursor: React.FC<Props> = ({ handData }) => {
  return (
    <div
      className={`fixed z-[100] pointer-events-none flex items-center justify-center transition-transform duration-75 ease-out rounded-full border-4 ${
        handData.isFist ? 'scale-75 bg-red-400 border-red-200' : 'scale-100 bg-yellow-400 border-yellow-200'
      } cursor-glow`}
      style={{
        left: handData.x,
        top: handData.y,
        width: '64px',
        height: '64px',
        transform: `translate(-50%, -50%) ${handData.isFist ? 'scale(0.8)' : 'scale(1.2)'}`,
      }}
    >
      <span className="text-3xl">
        {handData.isFist ? '✊' : '✋'}
      </span>
      <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></div>
    </div>
  );
};
