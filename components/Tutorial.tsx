
import React, { useEffect } from 'react';
import { speak } from '../services/speechService';

interface Props {
  onComplete: () => void;
}

export const Tutorial: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    speak("Open your hand to move the cursor. Close your hand into a fist to click. Try it now!");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10">
      <h1 className="text-5xl text-blue-600 mb-12">Magic Hands! ✨</h1>
      
      <div className="flex flex-wrap justify-center gap-20 mb-12">
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center text-8xl shadow-xl border-4 border-yellow-400 mb-6 animate-pulse">
            ✋
          </div>
          <p className="text-3xl font-bold text-gray-700">Open = MOVE</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center text-8xl shadow-xl border-4 border-red-400 mb-6 animate-bounce">
            ✊
          </div>
          <p className="text-3xl font-bold text-gray-700">Fist = CLICK</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="px-12 py-6 bg-green-500 text-white text-4xl rounded-full shadow-2xl border-4 border-white hover:scale-105 transition-transform"
      >
        I'm Ready! ✅
      </button>
    </div>
  );
};
