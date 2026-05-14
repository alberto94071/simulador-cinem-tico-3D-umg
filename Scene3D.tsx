'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Environment,
  Plane as MeshPlane,
  Sphere,
  Box,
  useGLTF,
  Html,
} from '@react-three/drei';
import { Physics, RigidBody, Collider, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { calculateTrajectory, calculateRange } from '@/lib/physics';

interface Scene3DProps {
  velocity: number;
  angle: number;
  mass: number;
  isRunning: boolean;
  onLandingResult?: (success: boolean, message: string) => void;
}

/**
 * Motorcycle Component - Yellow realistic model
 */
function Motorcycle({ initialPosition, isFlying, trajectory, time }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    
    if (isFlying && trajectory && trajectory.length > 0) {
      const frame = Math.min(Math.floor(time * 60), trajectory.length - 1);
      const point = trajectory[frame];
      
      groupRef.current.position.x = point.x * 2; // scale for visibility
      groupRef.current.position.y = point.y * 2;
      groupRef.current.position.z = 0;
    } else {
      groupRef.current.position.set(...initialPosition);
    }
  });

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Main body - bright yellow */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.5, 0.3]} />
        <meshStandardMaterial color="#ffff00" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Fairing - sleek design */}
      <mesh position={[0.3, 0.35, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.25, 0.6, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#ffff00" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Front wheel */}
      <mesh position={[0.5, -0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rear wheel */}
      <mesh position={[-0.4, -0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Headlight */}
      <pointLight position={[0.6, 0.4, 0]} intensity={1} distance={5} color="#ffffff" />
    </group>
  );
}

/**
 * Ramp Component - Dynamic rotation based on angle
 */
function Ramp({ angle }: any) {
  const rampRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (rampRef.current) {
      rampRef.current.rotation.z = (angle * Math.PI) / 180;
    }
  }, [angle]);

  return (
    <group ref={rampRef} position={[-2, -0.5, 0]}>
      {/* Ramp surface */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.15, 0.8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Ramp edges */}
      <mesh position={[0, 0.1, -0.45]} castShadow>
        <boxGeometry args={[2.5, 0.15, 0.1]} />
        <meshStandardMaterial color="#aa8c1c" metalness={0.4} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.1, 0.45]} castShadow>
        <boxGeometry args={[2.5, 0.15, 0.1]} />
        <meshStandardMaterial color="#aa8c1c" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Support structure */}
      <mesh position={[-1, -0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 1, 0.8]} />
        <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.6} />
      </mesh>

      <mesh position={[1, -0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 1, 0.8]} />
        <meshStandardMaterial color="#555555" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Landing Platform Component
 */
function LandingPlatform() {
  return (
    <group position={[2.5, 0, 0]}>
      {/* Platform surface */}
      <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
        <boxGeometry args={[1.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#4a7a3a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Platform edges - safety barriers */}
      <mesh position={[-1, 0, -0.45]} castShadow>
        <boxGeometry args={[2, 0.3, 0.1]} />
        <meshStandardMaterial color="#2a4a1a" metalness={0.3} roughness={0.6} />
      </mesh>

      <mesh position={[-1, 0, 0.45]} castShadow>
        <boxGeometry args={[2, 0.3, 0.1]} />
        <meshStandardMaterial color="#2a4a1a" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Landing zone indicator */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.6]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00aa00"
          metalness={0.5} 
          roughness={0.4} 
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

/**
 * Danger Zone / Cliff Component
 */
function DangerZone() {
  return (
    <group position={[0.2, -1.5, 0]}>
      {/* Cliff faces */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 2, 0.8]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Cliff edge warning */}
      <mesh position={[0, 0.9, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.1, 0.8]} />
        <meshStandardMaterial color="#ff3333" emissive="#aa0000" metalness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Ground/Base
 */
function Ground() {
  return (
    <mesh receiveShadow position={[0, -2.5, 0]}>
      <planeGeometry args={[15, 5]} />
      <meshStandardMaterial color="#1a2a1a" metalness={0.1} roughness={0.9} />
    </mesh>
  );
}

/**
 * Lighting Setup
 */
function Lights() {
  return (
    <>
      {/* Sun - warm yellow/orange */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#ffcc55"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light */}
      <directionalLight position={[-5, 4, -5]} intensity={0.5} color="#5599ff" />

      {/* Ambient */}
      <ambientLight intensity={0.6} color="#ffffff" />

      {/* HUD glow */}
      <pointLight position={[0, 2, 3]} intensity={0.5} distance={20} color="#ffff00" />
    </>
  );
}

/**
 * Trajectory Visualization
 */
function TrajectoryVisualization({ trajectory }: any) {
  const pointsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!trajectory || !pointsRef.current) return;

    const points = trajectory.map((p: any) => new THREE.Vector3(p.x * 2, p.y * 2, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    pointsRef.current.geometry = geometry;
  }, [trajectory]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial color="#39ff14" size={0.08} />
    </points>
  );
}

/**
 * Vector Visualization (Velocity, Gravity, Force)
 */
function VectorVisualization({ velocity, angle, isFlying }: any) {
  if (isFlying) return null;

  const angleRad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(angleRad) * 0.05;
  const vy = velocity * Math.sin(angleRad) * 0.05;

  return (
    <group position={[-2, 0.3, 0]}>
      {/* Velocity vector */}
      <arrowHelper
        args={[
          new THREE.Vector3(vx, vy, 0).normalize(),
          new THREE.Vector3(0, 0, 0),
          2,
          0x39ff14,
        ]}
      />

      {/* Gravity vector */}
      <arrowHelper
        args={[
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(0, 0, 0),
          1.5,
          0xff6b6b,
        ]}
      />
    </group>
  );
}

/**
 * Main 3D Scene
 */
function Scene3DContent({ 
  velocity, 
  angle, 
  mass, 
  isRunning,
  onLandingResult 
}: Scene3DProps) {
  const cameraRef = useRef<any>(null);
  const [time, setTime] = useState(0);
  const [trajectory, setTrajectory] = useState<any[]>([]);
  const [isFlying, setIsFlying] = useState(false);

  // Calculate trajectory when parameters change
  useEffect(() => {
    const traj = calculateTrajectory(velocity, angle, 150);
    setTrajectory(traj);
  }, [velocity, angle]);

  // Start animation when isRunning changes
  useEffect(() => {
    if (isRunning) {
      setIsFlying(true);
      setTime(0);
      
      const duration = calculateTrajectory(velocity, angle).reduce((max, p) => 
        p.t > max ? p.t : max, 0
      ) + 0.5;

      const interval = setInterval(() => {
        setTime((t) => {
          if (t >= duration) {
            setIsFlying(false);
            clearInterval(interval);
            return t;
          }
          return t + 0.016; // ~60fps
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isRunning, velocity, angle]);

  useFrame((state) => {
    // Smooth camera following
    if (cameraRef.current) {
      cameraRef.current.position.lerp(
        new THREE.Vector3(0, 1.5, 5),
        0.05
      );
    }
  });

  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={[0, 1.5, 5]} 
        fov={50}
        near={0.1}
        far={1000}
      />
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={!isFlying}
        autoRotateSpeed={1}
      />

      <Lights />
      <Environment preset="sunset" />

      {/* Ramp with dynamic angle */}
      <Ramp angle={angle} />

      {/* Motorcycle */}
      <Motorcycle 
        initialPosition={[-2, 0.3, 0]} 
        isFlying={isFlying}
        trajectory={trajectory}
        time={time}
      />

      {/* Landing platform */}
      <LandingPlatform />

      {/* Danger zone visualization */}
      <DangerZone />

      {/* Ground */}
      <Ground />

      {/* Trajectory visualization when flying */}
      {isFlying && <TrajectoryVisualization trajectory={trajectory} />}

      {/* Vector visualization (velocity, gravity) */}
      <VectorVisualization velocity={velocity} angle={angle} isFlying={isFlying} />

      {/* Grid helper */}
      <gridHelper args={[20, 20]} position={[0, -2.4, 0]} />

      {/* Axes helper for debugging */}
      <axesHelper args={[3]} position={[-2, 0, 0]} />
    </>
  );
}

/**
 * Scene3D Component Wrapper
 */
export default function Scene3D(props: Scene3DProps) {
  return (
    <Canvas
      className="w-full h-full"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      shadow-map-type={THREE.PCFShadowShadowMap}
    >
      <color attach="background" args={['#2d1a4a']} />
      <fog attach="fog" args={['#2d1a4a', 3, 20]} />
      
      <Scene3DContent {...props} />
    </Canvas>
  );
}
