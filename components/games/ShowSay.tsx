
import React, { useState, useEffect, useCallback } from 'react';
import { GAME_ITEMS, GameItem, HandData } from '../../types';
import { speak, listen } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

// Define Props interface outside the component to be accessible by the type definition
interface Props {
  onBack: () => void;
  handData: HandData;
}

export const ShowSay: React.FC<Props> = ({ onBack, handData }) => {
  const [target, setTarget] = useState<GameItem | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const startNewRound = useCallback(() => {
    const roundTarget = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
    setTarget(roundTarget);
    setFeedback('');
    setHeard('');
    setShowConfetti(false);
    
    setTimeout(() => {
      speak(`What is this? Tell me!`);
    }, 500);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleListen = async () => {
    if (isListening || showConfetti) return;
    setIsListening(true);
    setHeard('Listening...');
    
    try {
      const transcript = await listen();
      setHeard(transcript);
      
      if (transcript.toLowerCase().includes(target?.name.toLowerCase() || '')) {
        setFeedback('WOW! YOU ARE SMART! ⭐');
        setShowConfetti(true);
        speak(`Yes! That is a ${target?.name}! You are brilliant!`);
        setTimeout(startNewRound, 3000);
      } else {
        setFeedback('Almost! Try saying it again?');
        speak(`Try again! Can you say ${target?.name}?`);
      }
    } catch (err) {
      setHeard('I didn\'t quite catch that...');
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden">
      <Confetti active={showConfetti} />
      
      <h2 className="text-6xl text-orange-600 mb-8 font-black drop-shadow-md z-10">Show & Say!</h2>

      {target && (
        <div className={`bg-white p-12 rounded-[4rem] shadow-2xl border-8 mb-10 transition-all duration-500 z-10 ${
          showConfetti ? 'scale-110 border-green-400 rotate-6' : 'border-orange-200'
        }`}>
          <img src={target.image} alt="Mystery" className="w-80 h-80 object-cover rounded-[3rem] shadow-inner mb-4" />
          <div className="text-9xl animate-bounce">{target.emoji}</div>
        </div>
      )}

      <div className="h-20 z-10">
        {feedback && (
          <div className={`text-5xl font-black animate-bounce ${showConfetti ? 'text-green-500' : 'text-orange-500'}`}>
            {feedback}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 z-10">
        <div className="bg-white/80 px-10 py-4 rounded-full shadow-lg border-2 border-white">
          <p className="text-3xl text-gray-700 font-bold italic">
            {heard ? `You said: "${heard}"` : 'Press the mic and speak!'}
          </p>
        </div>
        
        <button
          onClick={handleListen}
          disabled={isListening || showConfetti}
          className={`w-36 h-36 rounded-full border-8 border-white shadow-2xl flex items-center justify-center text-7xl transition-all transform hover:scale-110 active:scale-90 z-20 ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
          } ${showConfetti ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
        >
          {isListening ? '🎤' : '🎙️'}
        </button>
      </div>
    </div>
  );
};
