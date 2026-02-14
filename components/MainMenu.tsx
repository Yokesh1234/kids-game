
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
      mode: GameMode.STAR_CATCHER, 
      title: 'Star Catcher', 
      icon: '⭐', 
      color: 'from-yellow-400 to-orange-500',
      description: 'Hand tracking agility'
    },
    { 
      mode: GameMode.NEON_PAINTER, 
      title: 'Neon Painter', 
      icon: '🎨', 
      color: 'from-blue-400 to-purple-600',
      description: 'Free-form light drawing'
    },
    { 
      mode: GameMode.LOGIC_BLOCKS, 
      title: 'Logic Blocks', 
      icon: '🧩', 
      color: 'from-cyan-400 to-blue-600',
      description: 'Shape matching puzzles'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className={`absolute inset-0 transition-all duration-700 opacity-20 ${
        hovered !== null ? 'blur-[100px]' : 'blur-[50px]'
      }`}>
        <div className={`absolute w-[500px] h-[500px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr ${
          hovered !== null ? games[hovered].color : 'from-blue-500 to-purple-500'
        }`} />
      </div>

      <div className="flex gap-6 px-10 py-10 overflow-x-auto no-scrollbar items-center z-10 w-full justify-start md:justify-center">
        {games.map((game, idx) => (
          <button
            key={game.mode}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(game.mode)}
            className={`flex-shrink-0 relative flex flex-col items-center w-72 h-[400px] rounded-[2rem] shadow-2xl transition-all duration-500 transform 
              ${hovered === idx ? 'scale-105 -translate-y-4 ring-8 ring-white/10' : hovered !== null ? 'scale-95 opacity-40 blur-[2px]' : 'scale-100'}
              overflow-hidden bg-slate-900/80 border border-white/5 backdrop-blur-md
            `}
          >
            <div className={`w-full h-2/5 bg-gradient-to-br ${game.color} flex items-center justify-center text-8xl`}>
              <span className={`${hovered === idx ? 'animate-bounce' : ''}`}>{game.icon}</span>
            </div>
            <div className="p-6 text-left w-full h-3/5 flex flex-col">
              <h2 className="text-2xl text-white font-black uppercase tracking-tight mb-1">{game.title}</h2>
              <p className="text-blue-200/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">{game.description}</p>
              <div className="mt-auto pt-4 border-t border-white/5">
                 <div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] text-white/40 font-mono flex justify-between items-center">
                   <span>MODULE: PKG_v1.2</span>
                   <span className="text-blue-400">STATUS: READY</span>
                 </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 text-white/10 font-mono text-[9px] uppercase tracking-[0.6em] flex items-center gap-10">
        <div className="h-[1px] w-24 bg-white/5" />
        {hovered !== null ? `LOAD: ${games[hovered].title}` : 'SELECT_SUBSYSTEM'}
        <div className="h-[1px] w-24 bg-white/5" />
      </div>
    </div>
  );
};
