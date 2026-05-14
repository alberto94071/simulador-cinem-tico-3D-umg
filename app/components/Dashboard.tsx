'use client';

import React, { useRef, useState, useEffect } from 'react';
import { calculateRange, calculateKineticEnergy } from '@/lib/physics';

interface DashboardProps {
  velocity: number;
  setVelocity: (v: number) => void;
  angle: number;
  setAngle: (a: number) => void;
  mass: number;
  setMass: (m: number) => void;
  targetDistance: number;
  setTargetDistance: (d: number) => void;
  isRunning: boolean;
  onStart: () => void;
}

/**
 * Interactive Gauge Component
 */
function Gauge({
  value,
  max,
  label,
  unit,
  onChange,
  color = '#ff3333',
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
  onChange: (v: number) => void;
  color?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calibration constants (SVG standard: 0deg is UP)
  const START_ANGLE = -135; // Bottom-Left
  const SWEEP = 270;

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const updateValueFromCoords = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
    if (angle > 180) angle -= 360;

    let relativeAngle = angle - START_ANGLE;
    if (relativeAngle < 0) relativeAngle += 360;
    
    let percentage = relativeAngle / SWEEP;
    if (percentage > 1.1) percentage = 0;
    if (percentage > 1) percentage = 1;

    onChange(Math.round(percentage * max));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) updateValueFromCoords(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragging) {
      const touch = e.touches[0];
      updateValueFromCoords(touch.clientX, touch.clientY);
    }
  };

  const needleRotation = (value / max) * SWEEP + START_ANGLE;

  return (
    <div
      className="flex flex-col items-center cursor-grab active:cursor-grabbing select-none touch-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div className="text-[10px] text-yellow-600 font-bold tracking-widest mb-1 uppercase">
        {label}
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-24 h-24 md:w-32 md:h-32 mb-1"
        style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.2))' }}
        suppressHydrationWarning
      >
        <circle cx="100" cy="100" r="95" fill="#1a1a1a" stroke="#4a4a4a" strokeWidth="8" />
        <circle cx="100" cy="100" r="88" fill="#0d0d0d" />

        {/* Labels - Calibrated to match needleRotation */}
        {mounted && [0, 1, 2, 3, 4, 5].map((i) => {
          const num = Math.round((i / 5) * max);
          const drawAngle = i * 54 + START_ANGLE;
          const mathAngle = (drawAngle - 90) * (Math.PI / 180);
          const x = 100 + 65 * Math.cos(mathAngle);
          const y = 100 + 65 * Math.sin(mathAngle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#d4af37"
              fontSize="14"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              suppressHydrationWarning
            >
              {num}
            </text>
          );
        })}

        {/* Tick marks - Calibrated */}
        {[...Array(26)].map((_, i) => {
          const drawAngle = (i * SWEEP) / 25 + START_ANGLE;
          const mathAngle = (drawAngle - 90) * (Math.PI / 180);
          const x1 = (100 + 78 * Math.cos(mathAngle)).toFixed(2);
          const y1 = (100 + 78 * Math.sin(mathAngle)).toFixed(2);
          const x2 = (100 + 88 * Math.cos(mathAngle)).toFixed(2);
          const y2 = (100 + 88 * Math.sin(mathAngle)).toFixed(2);
          const isMain = i % 5 === 0;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMain ? '#d4af37' : '#666666'}
              strokeWidth={isMain ? 3 : 1}
              suppressHydrationWarning
            />
          );
        })}

        <g transform={`rotate(${needleRotation} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="35" stroke={color} strokeWidth="4" />
          <polygon points="100,30 96,40 104,40" fill={color} />
        </g>

        <circle cx="100" cy="100" r="8" fill="#d4af37" stroke={color} strokeWidth="2" />
      </svg>

      <div className="text-center">
        <div className={`text-3xl font-bold tracking-wider`} style={{ color }}>
          {value}
        </div>
        <div className="text-xs text-yellow-600 tracking-widest">{unit}</div>
      </div>
    </div>
  );
}

/**
 * Vertical Indicator Bar
 */
function VerticalIndicator({
  value,
  max,
  label,
  color = '#d4af37',
}: {
  value: number;
  max: number;
  label: string;
  color?: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs text-yellow-600 font-bold tracking-widest">{label}</div>
      <div
        className="w-6 h-32 border-2 border-yellow-600 rounded-lg bg-black/50 flex items-end justify-center overflow-hidden"
      >
        <div
          className="w-4 transition-all"
          style={{
            height: `${percentage}%`,
            background: `linear-gradient(to top, ${color}, ${color}cc)`,
          }}
        />
      </div>
      <div className="text-sm font-bold text-yellow-600">{value}</div>
    </div>
  );
}

/**
 * Dashboard Component
 */
export default function Dashboard({
  velocity,
  setVelocity,
  angle,
  setAngle,
  mass,
  setMass,
  targetDistance,
  setTargetDistance,
  isRunning,
  onStart,
}: DashboardProps) {
  const [minimized, setMinimized] = useState(false);
  const range = calculateRange(velocity, angle);

  const handleStartClick = () => {
    setMinimized(true);
    onStart();
  };

  return (
    <div 
      className={`
        relative bg-black/85 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[3rem] px-4 md:px-8 shadow-2xl flex flex-col items-center overflow-hidden w-full transition-all duration-500 ease-in-out
        ${minimized ? 'translate-y-[calc(100%-60px)] md:translate-y-0' : 'translate-y-0'}
      `}
    >
      {/* Minimize Toggle (Mobile only) */}
      <button 
        onClick={() => setMinimized(!minimized)}
        className="md:hidden w-full h-10 flex items-center justify-center text-yellow-600/50 hover:text-yellow-600 transition-colors"
      >
        <div className={`w-8 h-1 rounded-full bg-current transition-transform duration-300 ${minimized ? 'rotate-0' : 'rotate-180'}`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      </button>

      {/* HUD Section */}
      <div className="flex justify-between w-full mb-3 items-center border-b border-white/5 pb-2 pt-2 md:pt-4">
        <span className="text-[9px] text-yellow-600 font-black tracking-widest uppercase">Newton Unit</span>
        <div className="text-right">
          <span className="text-[7px] text-gray-400 uppercase font-bold tracking-widest block leading-none">Alcance Est.</span>
          <span className="text-xs text-yellow-500 font-mono font-bold leading-none">{Math.round(range)}m</span>
        </div>
      </div>

      {/* Gauges Container */}
      <div className={`grid grid-cols-2 md:flex md:items-end gap-x-2 gap-y-4 md:justify-around mb-4 w-full justify-items-center transition-opacity duration-300 ${minimized ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
        <div className="scale-75 md:scale-110 transform-gpu">
          <Gauge value={velocity} max={60} label="Vel." unit="m/s" onChange={setVelocity} color="#ff3333" />
        </div>
        <div className="scale-75 md:scale-110 transform-gpu">
          <Gauge value={angle} max={80} label="Áng." unit="°" onChange={setAngle} color="#ffaa00" />
        </div>
        <div className="scale-75 md:scale-110 transform-gpu">
          <Gauge value={targetDistance} max={80} label="Obj." unit="m" onChange={setTargetDistance} color="#d4af37" />
        </div>
        <div className="scale-75 md:scale-110 transform-gpu flex items-center justify-center">
          <VerticalIndicator value={mass} max={300} label="Masa" color="#fff" />
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full pb-4 md:pb-6">
        <button
          onClick={handleStartClick}
          disabled={isRunning}
          className={`
            w-full px-10 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-full
            transition-all duration-500
            ${isRunning
              ? 'bg-red-900/40 text-red-400 border border-red-500/50 cursor-not-allowed'
              : 'bg-yellow-600/10 hover:bg-yellow-600 text-yellow-600 hover:text-black border border-yellow-600/50'
            }
          `}
        >
          <span>{isRunning ? 'En Vuelo...' : 'Iniciar Ignición'}</span>
        </button>
      </div>
    </div>
  );
}
