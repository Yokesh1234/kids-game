
import React, { useState } from 'react';
import { GameMode } from '../types';

interface Props {
  onSelect: (mode: GameMode) => void;
}

export const MainMenu: React.FC<Props> = ({ onSelect }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  
  const games = [
    { 
      mode: GameMode.LISTEN_PICK, 
      title: 'Listen & Pick', 
      icon: '👂', 
      color: 'from-emerald-400 to-cyan-500',
      description: 'Audio identification challenges'
    },
    { 
      mode: GameMode.SHOW_SAY, 
      title: 'Show & Say', 
      icon: '🗣️', 
      color: 'from-orange-400 to-red-500',
      description: 'Visual naming & pronunciation'
    },
    { 
      mode: GameMode.READ_ALOUD, 
      title: 'Read Aloud', 
      icon: '📖', 
      color: 'from-purple-400 to-pink-500',
      description: 'Vocabulary & literacy expansion'
    },
    { 
      mode: GameMode.TUTORIAL, 
      title: 'Hand Wizard', 
      icon: '🪄', 
      color: 'from-blue-400 to-indigo-500',
      description: 'Master your magic powers'
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background dynamic glow */}
      <div className={`absolute inset-0 transition-all duration-700 opacity-20 ${
        hovered !== null ? 'blur-[100px]' : 'blur-[50px]'
      }`}>
        <div className={`absolute w-[500px] h-[500px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr ${
          hovered !== null ? games[hovered].color : 'from-blue-500 to-purple-500'
        }`} />
      </div>

      <div className="flex gap-8 px-20 py-10 overflow-x-auto no-scrollbar items-center z-10 w-full justify-center">
        {games.map((game, idx) => (
          <button
            key={game.mode}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(game.mode)}
            className={`flex-shrink-0 relative flex flex-col items-center w-80 h-[450px] rounded-[2rem] shadow-2xl transition-all duration-500 transform 
              ${hovered === idx ? 'scale-110 -translate-y-4 ring-8 ring-white/20' : hovered !== null ? 'scale-90 opacity-40 blur-sm' : 'scale-100'}
              overflow-hidden bg-[#1e293b]/80 border border-white/10 backdrop-blur-md
            `}
          >
            {/* Game Preview Area */}
            <div className={`w-full h-1/2 bg-gradient-to-br ${game.color} flex items-center justify-center text-9xl`}>
              <span className={`${hovered === idx ? 'animate-bounce' : ''}`}>{game.icon}</span>
            </div>
            
            {/* Game Info Area */}
            <div className="p-8 text-left w-full">
              <h2 className="text-3xl text-white font-black uppercase tracking-tight mb-2 leading-none">{game.title}</h2>
              <p className="text-blue-200/60 text-sm font-medium uppercase tracking-widest mb-6">{game.description}</p>
              
              <div className="mt-auto pt-6 border-t border-white/5">
                 <div className="px-4 py-2 bg-white/5 rounded-xl text-xs text-white/40 font-mono flex justify-between items-center">
                   <span>MODULE: PKG_v1.0</span>
                   <span className="text-blue-400">READY</span>
                 </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* OS Dashboard hint */}
      <div className="mt-12 text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] flex items-center gap-6 animate-pulse">
        <div className="h-[1px] w-32 bg-white/5" />
        Navigate to select application
        <div className="h-[1px] w-32 bg-white/5" />
      </div>
    </div>
  );
};
