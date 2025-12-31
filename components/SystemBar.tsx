
import React, { useState, useEffect } from 'react';

export const SystemBar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [cpuLoad, setCpuLoad] = useState(12);
  const [temp, setTemp] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      // Simulate hardware noise
      setCpuLoad(Math.floor(Math.random() * 20) + 5);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-10 bg-black/60 backdrop-blur-xl border-b border-white/5 z-[60] flex items-center justify-between px-6 text-white font-mono text-[10px] uppercase tracking-tighter">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2 font-black text-blue-400">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          FUN_OS // RPI-4B
        </span>
        <div className="flex items-center gap-4 opacity-50">
          <span>CPU: {cpuLoad}%</span>
          <span>TEMP: {temp}°C</span>
          <span className="text-green-400">STATUS: OPTIMAL</span>
        </div>
      </div>
      <div className="flex items-center gap-6 font-bold text-xs">
        <div className="flex items-center gap-3 opacity-80">
          <span title="Wifi Connected">📶</span>
          <span title="Battery Charged">🔋 100%</span>
        </div>
        <span className="bg-white/5 px-3 py-1 rounded-sm border border-white/10">{time}</span>
      </div>
    </div>
  );
};
