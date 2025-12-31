
import React, { useState, useEffect, useCallback } from 'react';
import { GAME_ITEMS, GameItem, HandData } from '../../types';
import { speak } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

interface Props {
  onBack: () => void;
  handData: HandData;
}

export const ListenPick: React.FC<Props> = ({ onBack, handData }) => {
  const [options, setOptions] = useState<GameItem[]>([]);
  const [target, setTarget] = useState<GameItem | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongItem, setWrongItem] = useState<string | null>(null);

  const startNewRound = useCallback(() => {
    const shuffled = [...GAME_ITEMS].sort(() => 0.5 - Math.random());
    const roundOptions = shuffled.slice(0, 4);
    const roundTarget = roundOptions[Math.floor(Math.random() * 4)];
    
    setOptions(roundOptions);
    setTarget(roundTarget);
    setFeedback('');
    setShowConfetti(false);
    setWrongItem(null);
    
    setTimeout(() => {
      speak(`Find the ${roundTarget.name}`);
    }, 500);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handlePick = (item: GameItem) => {
    if (item.name === target?.name) {
      setFeedback('AWESOME! 🌟');
      setScore(s => s + 1);
      setShowConfetti(true);
      speak(`Great job! That is the ${item.name}!`);
      
      const history = JSON.parse(localStorage.getItem('pickedItems') || '[]');
      history.push(item.name);
      localStorage.setItem('pickedItems', JSON.stringify(history));

      setTimeout(startNewRound, 2500);
    } else {
      setWrongItem(item.name);
      setFeedback('Try again! You can do it! 💪');
      speak(`Not quite, try again! Look for the ${target?.name}`);
      setTimeout(() => setWrongItem(null), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 relative overflow-hidden">
      <Confetti active={showConfetti} />
      
      <div className="mb-8 text-center z-10">
        <h2 className="text-6xl text-purple-600 mb-2 font-black drop-shadow-lg">Listen & Pick!</h2>
        <div className="text-3xl text-gray-600 font-bold bg-white/80 px-8 py-2 rounded-full inline-block shadow-sm">
          Stars Earned: {score} ⭐
        </div>
      </div>

      <div className="h-24 flex items-center justify-center z-10">
        {feedback && (
          <div className={`text-7xl font-black animate-bounce ${feedback.includes('AWESOME') ? 'text-green-500' : 'text-orange-500'}`}>
            {feedback}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-4xl z-10">
        {options.map((item) => {
          const isCorrect = showConfetti && item.name === target?.name;
          const isWrong = wrongItem === item.name;
          
          return (
            <button
              key={item.name}
              onClick={() => !showConfetti && handlePick(item)}
              className={`group bg-white p-6 rounded-[3rem] shadow-2xl border-8 transition-all transform duration-300 
                ${isCorrect ? 'scale-110 border-green-400 rotate-3' : 'hover:scale-105 active:scale-90 border-white'}
                ${isWrong ? 'animate-shake border-red-400' : ''}
              `}
            >
              <img src={item.image} alt={item.name} className="w-64 h-64 object-cover rounded-3xl mb-4 pointer-events-none shadow-md" />
              <div className="text-7xl group-hover:scale-110 transition-transform">{item.emoji}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 z-10">
        <button
          onClick={() => target && speak(`Look for the ${target.name}`)}
          className="bg-yellow-400 p-8 rounded-full text-4xl shadow-2xl border-4 border-white animate-pulse hover:bg-yellow-500 transition-colors"
        >
          📢 REPEAT
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
