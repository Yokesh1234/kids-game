
import React, { useEffect, useRef } from 'react';
import { HandData } from '../types';

interface Props {
  onData: (data: HandData) => void;
  onReady: () => void;
}

export const HandTracker: React.FC<Props> = ({ onData, onReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const Hands = (window as any).Hands;
    const Camera = (window as any).Camera;

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const onResults = (results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const indexTip = landmarks[8];
        const screenX = (1 - indexTip.x) * window.innerWidth;
        const screenY = indexTip.y * window.innerHeight;

        const isFist = 
          landmarks[8].y > landmarks[6].y && 
          landmarks[12].y > landmarks[10].y && 
          landmarks[16].y > landmarks[14].y && 
          landmarks[20].y > landmarks[18].y;

        onData({ x: screenX, y: screenY, isFist });
      }
    };

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start().then(() => {
      onReady();
    });

    return () => {
      camera.stop();
      hands.close();
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 w-32 h-24 opacity-30 z-0 pointer-events-none scale-x-[-1]">
      <video ref={videoRef} className="w-full h-full object-cover rounded-lg border-2 border-white" autoPlay playsInline />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
