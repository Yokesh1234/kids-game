
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, HandData } from './types';
import { HandTracker } from './components/HandTracker';
import { Cursor } from './components/Cursor';
import { MainMenu } from './components/MainMenu';
import { Tutorial } from './components/Tutorial';
import { ProfileSelector } from './components/ProfileSelector';
import { ListenPick } from './components/games/ListenPick';
import { ShowSay } from './components/games/ShowSay';
import { ReadAloud } from './components/games/ReadAloud';
import { SystemBar } from './components/SystemBar';
import { speak } from './services/speechService';

export const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.BOOT);
  const [handData, setHandData] = useState<HandData>({ x: 0, y: 0, isFist: false });
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  
  const lastFistState = useRef(false);

  // OS Boot Animation Logic
  useEffect(() => {
    if (mode === GameMode.BOOT) {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setMode(GameMode.LOGIN), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Handle Hand Selection (Fist down/up logic)
  useEffect(() => {
    if (handData.isFist && !lastFistState.current) {
      const element = document.elementFromPoint(handData.x, handData.y) as HTMLElement;
      if (element) {
        element.click();
      }
    }
    lastFistState.current = handData.isFist;
  }, [handData]);

  const handleStartGame = (newMode: GameMode) => {
    setMode(newMode);
  };

  const goToMenu = useCallback(() => {
    setMode(GameMode.MENU);
  }, []);

  if (mode === GameMode.BOOT) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white font-mono">
        <div className="text-6xl mb-12 opacity-50"># FUN_OS_INIT</div>
        <div className="flex flex-col gap-2 w-80 text-[10px] text-blue-500 mb-8 overflow-hidden h-20">
           <div>[ OK ] Mounted /sys/kernel/debug</div>
           <div>[ OK ] Starting Hand_Driver_v2...</div>
           <div>[ OK ] Camera Hub Initialized</div>
           <div>[ OK ] Neural Mesh Loaded</div>
        </div>
        <div className="w-96 h-1 bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
            style={{ width: `${bootProgress}%` }}
          />
        </div>
      </div>
    );
  }

  if (mode === GameMode.LOGIN) {
    return (
      <div className="w-screen h-screen">
        <HandTracker onData={setHandData} onReady={() => setIsCameraReady(true)} />
        <Cursor handData={handData} />
        <ProfileSelector onSelect={() => setMode(GameMode.MENU)} />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-[#020617]">
      {/* OS Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <SystemBar />

      <HandTracker 
        onData={setHandData} 
        onReady={() => setIsCameraReady(true)} 
      />

      <Cursor handData={handData} />

      {!isCameraReady ? (
        <div className="z-50 text-center p-12 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-white/10 rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-2xl text-white font-black mb-2 uppercase tracking-tighter">Linking Hardware</h1>
          <p className="text-sm text-blue-300 opacity-50">WAKING UP THE EYE... 👁️</p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col pt-10">
          {mode === GameMode.MENU && <MainMenu onSelect={handleStartGame} />}
          {mode === GameMode.TUTORIAL && <Tutorial onComplete={() => setMode(GameMode.MENU)} />}
          {mode === GameMode.LISTEN_PICK && <ListenPick onBack={goToMenu} handData={handData} />}
          {mode === GameMode.SHOW_SAY && <ShowSay onBack={goToMenu} handData={handData} />}
          {mode === GameMode.READ_ALOUD && <ReadAloud onBack={goToMenu} handData={handData} />}
        </div>
      )}

      {mode !== GameMode.MENU && mode !== GameMode.TUTORIAL && mode !== GameMode.LOGIN && (
        <button
          id="back-btn"
          onClick={goToMenu}
          className="absolute top-14 left-6 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white text-[10px] font-mono tracking-widest rounded-lg border border-white/10 transition-all transform hover:scale-105 active:scale-95 z-40 flex items-center gap-3"
        >
          <span className="text-xl">⌂</span>
          EXIT_PROCESS
        </button>
      )}
    </div>
  );
};
