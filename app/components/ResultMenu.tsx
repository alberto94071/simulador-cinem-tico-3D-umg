'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ResultMenuProps {
  success: boolean;
  attempts: number;
  velocity: number;
  angle: number;
  distance: number;
  onReset: () => void;
}

export default function ResultMenu({
  success,
  attempts,
  velocity,
  angle,
  distance,
  onReset,
}: ResultMenuProps) {
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  
  const gravity = 9.8;
  const angleRad = (angle * Math.PI) / 180;
  
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);
  const timeOfFlight = (2 * v0y) / gravity;
  const maxHeight = (v0y * v0y) / (2 * gravity);
  const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

  useEffect(() => {
    if (success) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ca8a04', '#ffffff', '#eab308'], // Colores amarillos/dorados y blanco
          zIndex: 9999
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ca8a04', '#ffffff', '#eab308'],
          zIndex: 9999
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [success]);

  const getDetailContent = () => {
    switch(activeDetail) {
      case 'components':
        return {
          title: "Paso 1: Descomposición de la Velocidad",
          narrative: "Para analizar el movimiento parabólico, primero debemos descomponer la velocidad inicial (v₀) en dos ejes independientes (X y Y). Esto es necesario porque la física trata el avance horizontal y la subida/caída como procesos separados.",
          why: "Usamos el Coseno para el eje X porque es el cateto adyacente al ángulo, relacionando cuánto de la potencia se usa para avanzar. Usamos el Seno para el eje Y porque es el cateto opuesto, indicando cuánta potencia se usa para elevar la moto.",
          formula: "v₀ₓ = v₀ · cos(θ) | v₀ᵧ = v₀ · sen(θ)",
          steps: [
            `v₀ₓ = ${velocity} · cos(${angle}°) = ${v0x.toFixed(2)} m/s (Velocidad de avance constante)`,
            `v₀ᵧ = ${velocity} · sen(${angle}°) = ${v0y.toFixed(2)} m/s (Velocidad inicial de ascenso)`
          ]
        };
      case 'time':
        return {
          title: "Paso 2: Cálculo del Tiempo de Vuelo",
          narrative: "El tiempo total que la moto permanece en el aire depende exclusivamente de la gravedad y de qué tan fuerte fue el impulso hacia arriba (v₀ᵧ).",
          why: "Buscamos el momento en que la posición vertical vuelve a ser cero. En un lanzamiento nivelado, el tiempo de subida es igual al de bajada, por eso multiplicamos por 2 la velocidad vertical dividida por la gravedad.",
          formula: "t_total = (2 · v₀ᵧ) / g",
          steps: [
            `Sustituimos la velocidad vertical hallada antes:`,
            `t = (2 · ${v0y.toFixed(2)}) / 9.8`,
            `t = ${timeOfFlight.toFixed(2)} segundos en el aire`
          ]
        };
      case 'hmax':
        return {
          title: "Paso 3: Altura Máxima Alcanzada",
          narrative: "Este es el punto más alto de la parábola, donde la velocidad vertical de la moto se vuelve momentáneamente cero antes de empezar a caer.",
          why: "Se deriva de la ecuación de Torricelli. Relaciona la energía cinética vertical inicial con la aceleración negativa de la gravedad. Es vital para saber si la moto librará obstáculos altos.",
          formula: "hₘₐₓ = v₀ᵧ² / (2g)",
          steps: [
            `hₘₐₓ = (${v0y.toFixed(2)})² / (2 · 9.8)`,
            `hₘₐₓ = ${(v0y * v0y).toFixed(2)} / 19.6`,
            `hₘₐₓ = ${maxHeight.toFixed(2)} metros de altura`
          ]
        };
      case 'range':
        return {
          title: "Paso 4: Alcance Horizontal Total",
          narrative: "Finalmente, calculamos a qué distancia aterrizará la moto. Es el resultado de multiplicar la velocidad constante de avance (v₀ₓ) por el tiempo total de vuelo.",
          why: "En el eje X no hay aceleración (ignorando el aire), por lo que es un Movimiento Rectilíneo Uniforme (MRU). La fórmula simplificada usa la identidad trigonométrica del ángulo doble para mayor precisión.",
          formula: "R = (v₀² · sen(2θ)) / g",
          steps: [
            `R = (${velocity}² · sen(2 · ${angle}°)) / 9.8`,
            `R = (${velocity * velocity} · ${Math.sin(2 * angleRad).toFixed(2)}) / 9.8`,
            `R = ${range.toFixed(2)} metros (Distancia de impacto)`
          ]
        };
      default: return null;
    }
  };

  const detail = getDetailContent();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-2xl bg-[#0d0d0d]/95 border-2 border-yellow-600/50 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar">
        
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h2 className={`text-4xl font-black tracking-tighter mb-1 uppercase ${success ? 'text-green-500' : 'text-red-500'}`}>
            {success ? '¡ÉXITO!' : 'FALLIDO'}
          </h2>
          <p className="text-yellow-600/60 text-[10px] font-bold tracking-[0.2em] uppercase">
            Masterclass de Física Cinemática
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <span className="block text-yellow-600/50 text-[8px] uppercase font-bold">Intentos Restantes</span>
            <span className="text-white text-xl font-black">{attempts} / 3</span>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <span className="block text-yellow-600/50 text-[8px] uppercase font-bold">Objetivo</span>
            <span className="text-white text-xl font-black">{distance}m</span>
          </div>
        </div>

        {/* Clickable Formulas */}
        <div className="space-y-2 mb-6">
          <div className="text-[10px] font-black text-yellow-600/80 mb-2 tracking-widest uppercase flex items-center gap-2">
            <div className="w-4 h-0.5 bg-yellow-600" />
            Explora el Procedimiento (Selecciona un paso)
          </div>

          {[
            { id: 'components', label: '1. Descomposición de Vectores', val: `${v0x.toFixed(1)} | ${v0y.toFixed(1)} m/s` },
            { id: 'time', label: '2. Cálculo de Tiempo', val: `${timeOfFlight.toFixed(2)}s` },
            { id: 'hmax', label: '3. Punto de Altura Máxima', val: `${maxHeight.toFixed(2)}m` },
            { id: 'range', label: '4. Alcance Horizontal Final', val: `${range.toFixed(2)}m` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveDetail(activeDetail === item.id ? null : item.id)}
              className={`w-full flex justify-between items-center p-3 rounded border-l-4 transition-all hover:bg-white/5 group ${activeDetail === item.id ? 'bg-yellow-600/10 border-yellow-600' : 'bg-white/5 border-yellow-600/30'}`}
            >
              <span className="text-xs font-bold text-gray-300 group-hover:text-yellow-500">{item.label}</span>
              <span className={`font-mono text-sm ${item.id === 'range' && success ? 'text-green-400' : 'text-white'}`}>
                {item.val}
              </span>
            </button>
          ))}
        </div>

        {/* Detailed Masterclass View */}
        {activeDetail && detail && (
          <div className="mb-6 p-5 bg-white/5 border border-yellow-600/20 rounded-xl animate-in slide-in-from-top-4 duration-500 shadow-inner">
            <h3 className="text-yellow-600 font-black text-sm uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-pulse" />
              {detail.title}
            </h3>
            
            <div className="space-y-4 text-xs">
              <p className="text-gray-300 leading-relaxed italic border-l-2 border-white/10 pl-3">
                {detail.narrative}
              </p>
              
              <div className="bg-yellow-600/10 p-3 rounded-lg">
                <span className="text-[10px] text-yellow-600 font-bold uppercase block mb-1">Análisis Conceptual:</span>
                <p className="text-white/80">{detail.why}</p>
              </div>

              <div className="bg-black/60 p-4 rounded-lg font-mono border border-white/5">
                <div className="text-yellow-500/60 mb-3 border-b border-white/5 pb-2">
                  <span className="text-yellow-600 font-bold">FÓRMULA:</span> {detail.formula}
                </div>
                <div className="space-y-2">
                  {detail.steps.map((step, idx) => (
                    <div key={idx} className="text-white text-[13px] flex items-start gap-3">
                      <span className="text-yellow-600 font-bold">[{idx + 1}]</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onReset}
          className="w-full py-4 bg-yellow-600 text-black font-black text-sm uppercase tracking-[0.4em] rounded-xl hover:bg-yellow-500 transition-all active:scale-95 shadow-xl shadow-yellow-600/30"
        >
          {attempts > 0 ? 'Siguiente Intento' : 'Reiniciar Laboratorio'}
        </button>
      </div>
    </div>
  );
}
