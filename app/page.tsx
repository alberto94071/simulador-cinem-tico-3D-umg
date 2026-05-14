'use client';

import React, { useState, Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Dashboard from './components/Dashboard';
import ResultMenu from './components/ResultMenu';

// Dynamic import for Scene3D to avoid SSR issues with Three.js
const Scene3D = dynamic(() => import('./components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center">
      <div className="text-yellow-600 text-2xl font-bold tracking-widest animate-pulse">
        Initializing Physics World...
      </div>
    </div>
  ),
});

export default function SimulatorPage() {
  const [velocity, setVelocity] = useState<number>(10);
  const [angle, setAngle] = useState<number>(30);
  const [mass, setMass] = useState<number>(100);
  const [targetDistance, setTargetDistance] = useState<number>(30);
  const [attempts, setAttempts] = useState<number>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Referencias a los efectos de sonido
  const engineSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const failSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Precargamos los audios
    engineSoundRef.current = new Audio('/engine.mp3');
    successSoundRef.current = new Audio('/success.mp3');
    failSoundRef.current = new Audio('/fail.mp3');
  }, []);

  const handleStart = () => {
    if (attempts <= 0) {
      setAttempts(3);
      return;
    }
    
    setIsRunning(true);
    
    // Reproducimos el motor
    if (engineSoundRef.current) {
      engineSoundRef.current.currentTime = 0;
      engineSoundRef.current.play().catch(() => console.log('Esperando audio engine.mp3'));
    }
  };

  const handleSimulationEnd = (success: boolean) => {
    setIsSuccess(success);
    setShowResult(true);
    
    if (success) {
      // Reproducir sonido de trompetas/aplausos
      if (successSoundRef.current) {
        successSoundRef.current.currentTime = 0;
        successSoundRef.current.play().catch(() => console.log('Esperando audio success.mp3'));
      }
    } else {
      setAttempts(prev => Math.max(0, prev - 1));
      // Reproducir sonido de fallo
      if (failSoundRef.current) {
        failSoundRef.current.currentTime = 0;
        failSoundRef.current.play().catch(() => console.log('Esperando audio fail.mp3'));
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setShowResult(false);
    setIsSuccess(false);
    if (attempts === 0 && !isSuccess) {
      setAttempts(3);
    }
  };

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      {/* Fullscreen 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Scene3D
            velocity={velocity}
            angle={angle}
            mass={mass}
            targetDistance={targetDistance}
            isRunning={isRunning}
            onSimulationEnd={handleSimulationEnd}
          />
        </Suspense>
      </div>

      {/* Floating HUD Info */}
      <div className="absolute top-6 right-6 text-yellow-600 font-bold text-sm space-y-2 z-10 pointer-events-none">
        <div className="text-[10px] tracking-widest border border-yellow-600/30 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md">
          {attempts} INTENTOS RESTANTES
        </div>
        <div className="text-[10px] tracking-widest border border-yellow-600/30 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md">
          OBJETIVO: {targetDistance}m
        </div>
      </div>

      {/* Result Overlay */}
      {showResult && (
        <ResultMenu
          success={isSuccess}
          attempts={attempts}
          velocity={velocity}
          angle={angle}
          distance={targetDistance}
          onReset={handleReset}
        />
      )}

      {/* Floating Motorcycle Cockpit Dashboard */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <Dashboard
            velocity={velocity}
            setVelocity={setVelocity}
            angle={angle}
            setAngle={setAngle}
            mass={mass}
            setMass={setMass}
            targetDistance={targetDistance}
            setTargetDistance={setTargetDistance}
            isRunning={isRunning}
            onStart={handleStart}
          />
        </div>
      </div>
    </main>
  );
}
