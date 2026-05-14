'use client';

import React, { useMemo, useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Stars, 
  useGLTF, 
  Environment, 
  Float,
  Text,
  Clone,
  ContactShadows,
  Sky,
  BakeShadows,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Physics, 
  RigidBody, 
  CuboidCollider, 
  RapierRigidBody
} from '@react-three/rapier';

interface Scene3DProps {
  velocity: number;
  angle: number;
  mass: number;
  targetDistance: number;
  isRunning: boolean;
  onSimulationEnd?: (success: boolean) => void;
}

/**
 * MODO MODELO PROFESIONAL:
 * Si descargas un modelo de internet (formato .glb), 
 * colócalo en la carpeta /public y descomenta las líneas de abajo.
 */
function ExternalMotorcycleModel({ angle }: { angle: number }) {
  const { scene } = useGLTF('/moto.glb');
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      // Inyectamos la rotación matemáticamente sin usar props de JSX
      groupRef.current.rotation.set(0, -Math.PI / 2, 0);
    }
  }, []);

  return (
    <group ref={groupRef} scale={0.4} position={[0.5, 0.45, 0]}>
      {/* Volvemos a colocar la moto ahora que sabemos que no es el origen del problema */}
      <Clone object={scene} castShadow />
    </group>
  );
}

function ProceduralMotorcycleModel() {
  return (
    <group scale={0.75}>
      <mesh position={[-0.1, 0.45, 0]} rotation={[0, 0, Math.PI / 2 + 0.2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>
      <group position={[0.2, 0.6, 0]}>
        <mesh rotation={[0, 0, -0.4]} castShadow>
          <capsuleGeometry args={[0.25, 0.5, 4, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.1} />
        </mesh>
        <mesh position={[-0.1, -0.15, 0.2]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.1, -0.15, -0.2]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
      <group position={[0.7, 0.8, 0]} rotation={[0, 0, -0.5]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.18, 0.2, 4, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.1, 0.1, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#222" transparent opacity={0.6} />
        </mesh>
      </group>
      <group position={[0.65, 0.5, 0]} rotation={[0, 0, -0.4]}>
        <mesh position={[0, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
      </group>
      <mesh position={[-0.05, 0.92, 0]} rotation={[0, 0, 0.3]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.1} />
      </mesh>
      <mesh position={[0.35, 0.6, 0.26]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1.5} />
      </mesh>
      <group position={[-0.25, 0.55, 0]} rotation={[0, 0, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 12]} />
          <meshStandardMaterial color="#ff6600" />
        </mesh>
      </group>
      <mesh position={[-0.7, 0.85, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.45, 0.82, 0]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.35]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>
      <Wheel position={[0.9, 0.18, 0]} color="#ff6600" />
      <Wheel position={[-0.85, 0.18, 0]} color="#ff6600" />
    </group>
  );
}

function Wheel({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.38, 0.14, 24, 48]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.1, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
          <boxGeometry args={[0.04, 0.6, 0.05]} />
          <meshStandardMaterial color={color} metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Memorizamos las estructuras estáticas para no sobrecargar la GPU
const StartingCliff = React.memo(() => {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid" position={[-11, -2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[10, 8, 6]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </RigidBody>
      {/* Valla publicitaria en la plataforma de despegue (atrás, apoyada en el borde) */}
      <UniversityBanner position={[-11, 2.75, -3]} width={10} repeatX={2.5} />
    </group>
  );
});

const LandingCliff = React.memo(({ distance, angle }: { distance: number, angle: number }) => {
  const angleRad = (angle * Math.PI) / 180;
  // Calculamos la altura exacta a la que la moto sale de la rampa
  const launchHeight = 2 + 12 * Math.sin(angleRad);
  // Calculamos el punto X exacto donde la moto sale de la rampa
  const launchX = -6 + 12 * Math.cos(angleRad);
  
  // Posición X = Donde sale de la rampa + distancia objetivo
  // Posición Y = Altura de salida menos la mitad de la altura de la caja
  return (
    <group>
      <RigidBody 
        type="fixed" 
        colliders="cuboid" 
        position={[launchX + distance, launchHeight - 4, 0]}
        friction={2.0} 
        frictionCombineRule="Max" // Garantiza que la moto frene al máximo al tocar esta zona
      >
        <mesh receiveShadow>
          <boxGeometry args={[12, 8, 8]} />
          {/* Color industrial visible para contrastar con el fondo oscuro */}
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        {/* Zona de aterrizaje con borde amarillo de seguridad */}
        <mesh position={[0, 4.05, 0]} receiveShadow>
          <boxGeometry args={[12, 0.1, 8]} />
          <meshStandardMaterial color="#ffaa00" />
        </mesh>
        <mesh position={[0, 4.1, 0]} receiveShadow>
          <boxGeometry args={[11, 0.1, 7]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      </RigidBody>
      {/* Valla publicitaria en la plataforma de aterrizaje */}
      <UniversityBanner position={[launchX + distance, launchHeight + 0.75, -3.5]} width={12} repeatX={3} />
    </group>
  );
});

const Ramp = React.memo(({ angle }: { angle: number }) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (rigidBodyRef.current) {
      const angleRad = (angle * Math.PI) / 180;
      const euler = new THREE.Euler(0, 0, angleRad);
      const quat = new THREE.Quaternion().setFromEuler(euler);
      rigidBodyRef.current.setRotation(quat, true);
      
      // Ajustamos la posición para que pivote exactamente en el borde del acantilado (-6, 2)
      const rampLength = 12; // Rampa más larga y realista
      const cx = -6 + (rampLength / 2) * Math.cos(angleRad);
      const cy = 2 + (rampLength / 2) * Math.sin(angleRad);
      rigidBodyRef.current.setTranslation({ x: cx, y: cy, z: 0 }, true);
    }
  }, [angle]);

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      type="fixed" 
      colliders="cuboid" 
      position={[-3, 2, 0]}
      friction={0}
      frictionCombineRule="Min" // Rampa perfecta sin fricción para no arruinar la física
      restitution={0}
    >
      <mesh receiveShadow>
        <boxGeometry args={[12, 0.4, 6]} />
        <meshStandardMaterial color="#884422" />
      </mesh>
    </RigidBody>
  );
});

function UniversityBanner({ position, width, repeatX }: { position: [number, number, number], width: number, repeatX: number }) {
  const logo = useTexture('/logoumg.png');
  const bannerTexture = useMemo(() => {
    const tex = logo.clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, 1);
    return tex;
  }, [logo, repeatX]);

  return (
    <RigidBody type="fixed" position={position}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[width, 1.5, 0.5]} />
        <meshStandardMaterial map={bannerTexture} color="#ffffff" roughness={0.5} />
      </mesh>
    </RigidBody>
  );
}

function EnvironmentSetup() {
  return (
    <>
      <Sky distance={450000} sunPosition={[10, 5, 10]} inclination={0} azimuth={0.25} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="sunset" />
      <mesh position={[0, -20, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#1a1a1a" roughness={1} />
      </mesh>
      <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={100} blur={2} far={15} />
    </>
  );
}

function PhysicsMotorcycle({ velocity, angle, mass, isRunning, targetDistance, onSimulationEnd }: Scene3DProps) {
  const rigidBody = useRef<RapierRigidBody>(null);
  const [hasLaunched, setHasLaunched] = useState(false);
  const hasLeftRamp = useRef(false);
  const angleRad = useMemo(() => (angle * Math.PI) / 180, [angle]);

  const initialData = useMemo(() => {
    const pivotX = -6; // Borde del acantilado
    const pivotY = 2;  // Altura del acantilado
    const offsetAlongRamp = 3.5; // Movemos la moto más adelante para que las dos ruedas toquen rampa
    
    // Distancia perpendicular para que las llantas descansen EXACTAMENTE sobre la madera
    // 0.2 (mitad del grosor de la rampa) + 0.3 (profundidad de la llanta bajo el eje) = 0.5
    const perpOffset = 0.5; 
    
    // Usamos el vector normal (-sin, cos) para elevar la moto perpendicularmente a la rampa
    const startX = pivotX + offsetAlongRamp * Math.cos(angleRad) - perpOffset * Math.sin(angleRad);
    const startY = pivotY + offsetAlongRamp * Math.sin(angleRad) + perpOffset * Math.cos(angleRad);
    
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angleRad);
    return { x: startX, y: startY, quaternion: q };
  }, [angleRad]);

  // Caché de memoria para la cámara (Elimina el Lag de Garbage Collection)
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (isRunning && !hasLaunched && rigidBody.current) {
      setHasLaunched(true);
      hasLeftRamp.current = false;
      
      // CAÑÓN MAGNÉTICO: Apagamos la gravedad en la rampa para que no haya pérdida de energía
      rigidBody.current.setGravityScale(0, true);
      rigidBody.current.setTranslation({ x: initialData.x, y: initialData.y, z: 0 }, true);
      rigidBody.current.setRotation(initialData.quaternion, true);
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      // Como no hay gravedad ni fricción en la rampa, aplicamos la velocidad pura del tablero
      const vx = Math.cos(angleRad) * velocity;
      const vy = Math.sin(angleRad) * velocity;
      
      setTimeout(() => {
        if (rigidBody.current) {
          rigidBody.current.setLinvel({ x: vx, y: vy, z: 0 }, true);
        }
      }, 30);

      // JUEZ DE FÍSICA INTELIGENTE: Evalúa cuando la moto se detiene o cae
      let checkInterval: NodeJS.Timeout;
      
      // Esperamos 1 segundo para que la moto gane velocidad y salga de la rampa
      const initialTimeout = setTimeout(() => {
        checkInterval = setInterval(() => {
          if (!rigidBody.current || !onSimulationEnd) return;
          
          const pos = rigidBody.current.translation();
          const vel = rigidBody.current.linvel();
          // Calculamos la velocidad total (energía cinética remanente)
          const speedSq = vel.x * vel.x + vel.y * vel.y;
          
          // 1. Condición de pérdida rápida: Cayó al abismo
          if (pos.y < -1) {
            clearInterval(checkInterval);
            onSimulationEnd(false);
          } 
          // 2. Condición de detención: La moto frenó casi por completo (vel < 0.3 m/s)
          else if (speedSq < 0.1) {
            clearInterval(checkInterval);
            
            // Verificamos si sus coordenadas X coinciden con la plataforma
            const launchX = -6 + 12 * Math.cos(angleRad);
            const platformCenterX = launchX + targetDistance;
            // La plataforma tiene 12m de ancho, damos un margen de +/- 6.5m
            const isOnPlatform = pos.x >= platformCenterX - 6.5 && pos.x <= platformCenterX + 6.5 && pos.y > 0;
            
            onSimulationEnd(isOnPlatform);
          }
        }, 200); // Monitorear cada 200ms
      }, 1000);

      // Guardamos las referencias en el DOM del elemento (cleanup ref)
      (rigidBody.current as any)._timeouts = { initialTimeout, checkInterval };

    } else if (!isRunning) {
      setHasLaunched(false);
      hasLeftRamp.current = false;
      // Limpieza de intervalos si el usuario cancela o reinicia
      if (rigidBody.current && (rigidBody.current as any)._timeouts) {
        clearTimeout((rigidBody.current as any)._timeouts.initialTimeout);
        clearInterval((rigidBody.current as any)._timeouts.checkInterval);
      }
      // Cuando no corre, la encajamos al inicio, anulamos su velocidad y apagamos gravedad
      if (rigidBody.current) {
        rigidBody.current.setGravityScale(0, true);
        rigidBody.current.setTranslation({ x: initialData.x, y: initialData.y, z: 0 }, true);
        rigidBody.current.setRotation(initialData.quaternion, true);
        rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
  }, [isRunning, velocity, hasLaunched, angleRad, initialData]);

  useFrame((state) => {
    if (!rigidBody.current) return;

    const pos = rigidBody.current.translation();

    // VUELO BALÍSTICO: Encendemos la gravedad exactamente cuando la llanta trasera deja la rampa
    if (isRunning && !hasLeftRamp.current) {
      const launchX = -6 + 12 * Math.cos(angleRad);
      if (pos.x >= launchX) {
        hasLeftRamp.current = true;
        rigidBody.current.setGravityScale(1, true);
      }
    }

    // Seguimiento Rígido (Cero Lag): Al usar .set() en lugar de .lerp(), la cámara se ancla perfectamente
    // al chasis de la moto, eliminando cualquier sensación de tartamudeo en pantallas de alta frecuencia.
    state.camera.position.set(pos.x + 2, pos.y + 4, pos.z + 18);
    state.camera.lookAt(pos.x, pos.y, pos.z);
  });

  return (
    <RigidBody 
      ref={rigidBody} 
      position={[initialData.x, initialData.y, 0]} 
      quaternion={initialData.quaternion}
      // Se maneja imperativamente sin lag
      type="dynamic"
      // Colisión ultra-rápida manual en lugar de calcular miles de polígonos
      colliders={false}
      mass={mass / 100}
      restitution={0.05}
      friction={1.0} // Fricción realista para asfalto/madera (evita el efecto de pared de ladrillo)
      angularDamping={8.0} // Amortiguador giroscópico pesado: detiene las vueltas de campana
      canSleep={false}
      enabledRotations={[false, false, true]} // Liberamos el eje Z para que aterrice naturalmente hacia adelante
      ccd={true}
    >
      {/* Ajustamos la caja de colisión hacia abajo (Y = 0.3) para que cubra exactamente la profundidad de las llantas */}
      <CuboidCollider args={[1, 0.6, 0.4]} position={[0, 0.3, 0]} />
      <ExternalMotorcycleModel angle={angle} />
    </RigidBody>
  );
}

export default function Scene3D({ velocity, angle, mass, targetDistance, isRunning, onSimulationEnd }: Scene3DProps) {
  return (
    <Canvas 
      shadows={{ type: THREE.BasicShadowMap }} 
      camera={{ position: [15, 10, 20], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ 
        antialias: true, 
        powerPreference: "high-performance",
        preserveDrawingBuffer: true 
      }}
    >
      <Suspense fallback={null}>
        <EnvironmentSetup />
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
        <Physics gravity={[0, -9.81, 0]}>
          <StartingCliff />
          <Ramp angle={angle} />
          <LandingCliff distance={targetDistance} angle={angle} />
          <PhysicsMotorcycle 
            velocity={velocity} 
            angle={angle} 
            mass={mass} 
            isRunning={isRunning}
            targetDistance={targetDistance}
            onSimulationEnd={onSimulationEnd}
          />
        </Physics>
        <BakeShadows />
      </Suspense>
    </Canvas>
  );
}
