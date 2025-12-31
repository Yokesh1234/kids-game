
import React, { useState, useEffect, useCallback } from 'react';
import { GAME_ITEMS, GameItem, HandData } from '../../types';
import { speak, listen } from '../../services/speechService';
import { Confetti } from '../FeedbackEffects';

interface Props {
  onBack: () => void;
  handData: HandData;
}

export const ReadAloud: React.FC<Props> = ({ onBack, handData }) => {
  const [target, setTarget] = useState<GameItem | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const startNewRound = useCallback(() => {
    const roundTarget = GAME_ITEMS[Math.floor(Math.random() * Math.random() * GAME_ITEMS.length)];
    const items = [...GAME_ITEMS];
    const item = items[Math.floor(Math.random() * items.length)];
    setTarget(item);
    setFeedback('');
    setHeard('');
    setShowConfetti(false);
    
    setTimeout(() => {
      speak(`Can you read this word?`);
    }, 500);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleListen = async () => {
    if (isListening || showConfetti) return;
    setIsListening(true);
    setHeard('I\'m listening...');
    
    try {
      const transcript = await listen();
      setHeard(transcript);
      
      if (transcript.toLowerCase().includes(target?.name.toLowerCase() || '')) {
        setFeedback('EXCELLENT READING! 📚✨');
        setShowConfetti(true);
        speak(`Perfect! You read ${target?.name}!`);
        setTimeout(startNewRound, 3000);
      } else {
        setFeedback('So close! Try one more time?');
        speak(`Give it another try! Read the big word out loud!`);
      }
    } catch (err) {
      setHeard('Oops, say it louder!');
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden">
      <Confetti active={showConfetti} />

      <h2 className="text-6xl text-purple-600 mb-8 font-black drop-shadow-md z-10">Read Aloud!</h2>

      {target && (
        <div className={`bg-white px-20 py-16 rounded-[4rem] shadow-2xl border-8 transition-all duration-700 z-10 ${
          showConfetti ? 'scale-110 border-green-400 rotate-2' : 'border-purple-200 -rotate-1'
        }`}>
          <div className={`text-[12rem] font-black tracking-widest uppercase leading-none transition-colors duration-500 ${
            showConfetti ? 'text-green-500' : 'text-purple-600'
          }`}>
            {target.name}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {target.name.split('').map((char, i) => (
              <span key={i} className={`text-4xl font-bold uppercase transition-all duration-300`} style={{ transitionDelay: `${i * 100}ms` }}>
                {char}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="h-24 z-10 flex items-center justify-center">
        {feedback && (
          <div className={`text-5xl font-black animate-bounce ${showConfetti ? 'text-blue-500' : 'text-purple-400'}`}>
            {feedback}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 z-10">
        <div className="bg-white/90 px-10 py-4 rounded-full shadow-lg border-2 border-purple-100">
          <p className="text-3xl text-gray-600 font-bold italic">
            {heard ? `Heard: "${heard}"` : 'Click the microphone and read!'}
          </p>
        </div>
        
        <button
          onClick={handleListen}
          disabled={isListening || showConfetti}
          className={`px-16 py-10 rounded-full border-8 border-white shadow-2xl flex items-center justify-center text-5xl font-black transition-all transform hover:scale-110 active:scale-95 z-20 ${
            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-500 text-white'
          } ${showConfetti ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
        >
          {isListening ? '🔴 LISTENING...' : '🎤 START READING'}
        </button>
      </div>
    </div>
  );
};
