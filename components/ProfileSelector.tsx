
import React from 'react';
import { speak } from '../services/speechService';

interface Props {
  onSelect: () => void;
}

export const ProfileSelector: React.FC<Props> = ({ onSelect }) => {
  const profiles = [
    { name: 'Kid Explorer', icon: '🧑‍🚀', color: 'bg-blue-500' },
    { name: 'Guest Friend', icon: '🦊', color: 'bg-orange-500' },
  ];

  const handleSelect = (name: string) => {
    speak(`Welcome back, ${name}. Initiating gaming environment.`);
    onSelect();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-10 z-50">
      <h1 className="text-4xl font-black mb-16 tracking-widest text-blue-400">WHO IS PLAYING?</h1>
      <div className="flex gap-12">
        {profiles.map((p) => (
          <button
            key={p.name}
            onClick={() => handleSelect(p.name)}
            className="group flex flex-col items-center transition-all transform hover:scale-110 active:scale-95"
          >
            <div className={`w-48 h-48 ${p.color} rounded-full flex items-center justify-center text-8xl mb-6 shadow-2xl border-8 border-white/10 group-hover:border-white/40 transition-all`}>
              {p.icon}
            </div>
            <span className="text-2xl font-bold tracking-tight opacity-70 group-hover:opacity-100">{p.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-20 flex flex-col items-center gap-2 opacity-30 font-mono text-xs">
        <span>HAND_TRACKING_V2.5_ACTIVE</span>
        <span>DRIVERS_LOADED</span>
        <span>YOKESH K</span>
        <span>https://yokeshcv.netlify.app</span>
      </div>
    </div>
  );
};
