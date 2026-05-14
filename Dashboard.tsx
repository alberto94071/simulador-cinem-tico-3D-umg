'use client';

import React, { useRef, useState } from 'react';
import { calculateRange, calculateKineticEnergy } from '@/lib/physics';

interface DashboardProps {
  velocity: number;
  setVelocity: (v: number) => void;
  angle: number;
  setAngle: (a: number) => void;
  mass: number;
  setMass: (m: number) => void;
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
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const normalized = ((angle + 135) / 270) * 100;
    const clamped = Math.max(0, Math.min(100, normalized));
    const newValue = Math.round((clamped / 100) * max);

    onChange(newValue);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const needleRotation = (value / max) * 270 - 135;

  return (
    <div
      className="flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      <div className="text-xs text-yellow-600 font-bold tracking-widest mb-2 uppercase">
        {label}
      </div>

      {/* Gauge SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-40 h-40 mb-3"
        style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }}
      >
        {/* Gauge background */}
        <circle cx="100" cy="100" r="95" fill="#1a1a1a" stroke="#4a4a4a" strokeWidth="8" />
        <circle cx="100" cy="100" r="88" fill="#0d0d0d" />

        {/* Gauge numbers */}
        {[0, Math.floor(max / 5), Math.floor((max * 2) / 5), Math.floor((max * 3) / 5), Math.floor((max * 4) / 5), max].map(
          (num, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180);
            const x = 100 + 70 * Math.cos(angle);
            const y = 100 + 70 * Math.sin(angle);
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#d4af37"
                fontSize="16"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                {num}
              </text>
            );
          }
        )}

        {/* Scale marks */}
        {[...Array(25)].map((_, i) => {
          const angle = (i * 10.8 - 90) * (Math.PI / 180);
          const x1 = 100 + 80 * Math.cos(angle);
          const y1 = 100 + 80 * Math.sin(angle);
          const x2 = 100 + 88 * Math.cos(angle);
          const y2 = 100 + 88 * Math.sin(angle);
          const isMain = i % 5 === 0;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMain ? '#d4af37' : '#666666'}
              strokeWidth={isMain ? 3 : 1.5}
              opacity={isMain ? 1 : 0.6}
            />
          );
        })}

        {/* Needle */}
        <g transform={`rotate(${needleRotation} 100 100)`}>
          <polygon
            points="100,100 95,50 100,30 105,50"
            fill={color}
            opacity="0.95"
          />
        </g>

        {/* Center point */}
        <circle cx="100" cy="100" r="8" fill="#d4af37" stroke={color} strokeWidth="2" />
      </svg>

      {/* Digital display */}
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
  isRunning,
  onStart,
}: DashboardProps) {
  const kineticEnergy = calculateKineticEnergy(mass, velocity);
  const range = calculateRange(velocity, angle);

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-t-4 border-yellow-600 px-8 py-4 flex flex-col justify-center">

      {/* Top: Display information */}
      <div className="flex justify-between items-start mb-6">
        {/* Left info */}
        <div className="text-left">
          <div className="text-xs text-yellow-600 tracking-widest font-bold mb-2">
            NEWTON SIMULATOR v1.0
          </div>
          <div className="text-xs text-yellow-600/70 tracking-widest">
            {isRunning ? '🔴 FLIGHT' : '⚪ IDLE'}
          </div>
        </div>

        {/* Center: Range calculator */}
        <div className="text-center bg-black border-2 border-yellow-600 px-6 py-2 rounded-lg">
          <div className="text-yellow-600 font-mono text-xs tracking-widest mb-1">
            PREDICTED RANGE
          </div>
          <div className="text-yellow-500 font-mono text-2xl font-black tracking-wider">
            {Math.round(range)}m
          </div>
          <div className="text-yellow-600 font-mono text-xs tracking-widest">
            @ {angle}° | {velocity} m/s
          </div>
        </div>

        {/* Right info */}
        <div className="text-right">
          <div className="text-xs text-yellow-600 tracking-widest font-bold mb-2">
            ENERGY METRICS
          </div>
          <div className="text-xs text-yellow-600/70 tracking-widest">
            KE: {Math.round(kineticEnergy / 1000)}kJ
          </div>
        </div>
      </div>

      {/* Middle: Controls (3 sections) */}
      <div className="flex justify-between items-end gap-8 flex-1 max-h-64">

        {/* Left: Velocity gauge */}
        <Gauge
          value={velocity}
          max={100}
          label="Velocity (v₀)"
          unit="m/s"
          onChange={setVelocity}
          color="#ff3333"
        />

        {/* Center: Indicators */}
        <div className="flex gap-8 items-end mb-6">
          {/* Mass indicator */}
          <VerticalIndicator
            value={mass}
            max={300}
            label="Mass"
            color="#ff6666"
          />

          {/* Kinetic Energy indicator */}
          <VerticalIndicator
            value={Math.round(kineticEnergy / 1000)}
            max={25}
            label="Kinetic E."
            color="#ffaa00"
          />
        </div>

        {/* Right: Angle gauge */}
        <Gauge
          value={angle}
          max={80}
          label="Ramp Angle (θ)"
          unit="°"
          onChange={setAngle}
          color="#ff3333"
        />
      </div>

      {/* Bottom: Start button */}
      <div className="flex justify-center pt-6 border-t border-yellow-600/30">
        <button
          onClick={onStart}
          disabled={isRunning}
          className={`
            px-20 py-4 text-xl font-black uppercase tracking-widest rounded-lg
            border-4 transition-all duration-300 shadow-lg
            ${isRunning
              ? 'bg-red-600 border-red-400 text-white animate-pulse cursor-not-allowed'
              : 'bg-yellow-600 border-yellow-400 text-black hover:scale-105 hover:shadow-2xl hover:shadow-yellow-600/60 active:scale-95 cursor-pointer'
            }
          `}
        >
          {isRunning ? '⚡ FLYING' : '▶ LAUNCH'}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-yellow-600/40 text-xs tracking-widest font-bold mt-4">
        CHRONOS-DEV • Software Development & AI Integration
      </div>
    </div>
  );
}