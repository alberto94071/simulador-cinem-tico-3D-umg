'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Dashboard from './components/Dashboard';

// Dynamic import for Scene3D to avoid SSR issues with Three.js
const Scene3D = dynamic(() => import('./components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-[#2d1a4a] to-[#3d2a5a] flex items-center justify-center">
      <div className="text-yellow-600 text-2xl font-bold tracking-widest">
        Loading 3D Engine...
      </div>
    </div>
  ),
});

/**
 * Physics Simulator Main Page
 * 65% 3D Viewport + 35% Dashboard
 */
export default function SimulatorPage() {
  const [velocity, setVelocity] = useState<number>(45);
  const [angle, setAngle] = useState<number>(25);
  const [mass, setMass] = useState<number>(150);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleStart = () => {
    setIsRunning(true);
    // Auto-reset after flight
    setTimeout(() => setIsRunning(false), 5000);
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col overflow-hidden">
      {/* 3D Viewport (65%) */}
      <div className="flex-[65%] relative bg-gradient-to-b from-[#2d1a4a] to-[#3d2a5a] overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-yellow-600 text-2xl font-bold tracking-widest">
                Loading...
              </div>
            </div>
          }
        >
          <Scene3D
            velocity={velocity}
            angle={angle}
            mass={mass}
            isRunning={isRunning}
          />
        </Suspense>

        {/* HUD Info Overlay */}
        <div className="absolute top-6 right-6 text-yellow-600 font-bold text-sm space-y-2 z-10 pointer-events-none">
          <div className="text-xs tracking-widest border border-yellow-600/50 px-3 py-1 rounded bg-black/60">
            PHYSICS SIMULATOR v1.0
          </div>
          <div className="text-xs tracking-widest border border-yellow-600/50 px-3 py-1 rounded bg-black/60">
            {isRunning ? '🔴 FLIGHT ACTIVE' : '⚪ STANDBY MODE'}
          </div>
          <div className="text-xs tracking-widest border border-yellow-600/50 px-3 py-1 rounded bg-black/60">
            {velocity} m/s • {angle}° • {mass}kg
          </div>
        </div>

        {/* Top-left Physics info */}
        <div className="absolute top-6 left-6 text-yellow-600 font-bold text-xs space-y-1 z-10 pointer-events-none">
          <div className="tracking-widest border border-yellow-600/50 px-3 py-1 rounded bg-black/60">
            NEWTON'S LAWS
          </div>
          <div className="tracking-widest border border-yellow-600/50 px-3 py-1 rounded bg-black/60 text-[10px]">
            1️⃣ Inertia • 2️⃣ Force • 3️⃣ Reaction
          </div>
        </div>
      </div>

      {/* Dashboard (35%) */}
      <div className="flex-[35%]">
        <Dashboard
          velocity={velocity}
          setVelocity={setVelocity}
          angle={angle}
          setAngle={setAngle}
          mass={mass}
          setMass={setMass}
          isRunning={isRunning}
          onStart={handleStart}
        />
      </div>
    </div>
  );
}
