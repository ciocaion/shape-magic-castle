
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { CastleSlot as CastleSlotType } from './ShapeShifterCastle';

interface ThreeDCastleSceneProps {
  slots: CastleSlotType[];
}

const Shape3D: React.FC<{ slot: CastleSlotType }> = ({ slot }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && slot.filled) {
      // Subtle rotation for 3D effect
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (!slot.filled) return null;

  const position: [number, number, number] = [
    (slot.position.x - 50) * 0.1, // Convert percentage to 3D coordinates
    -(slot.position.y - 50) * 0.1,
    0
  ];

  const getShape3D = () => {
    switch (slot.type) {
      case 'triangle':
        return (
          <mesh ref={meshRef} position={position}>
            <coneGeometry args={[1, 2, 4]} />
            <meshStandardMaterial color="#10b981" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.ConeGeometry(1, 2, 4)]} />
                <lineBasicMaterial color="#06d6a0" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'circle':
        return (
          <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#3b82f6" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.SphereGeometry(1, 16, 16)]} />
                <lineBasicMaterial color="#60a5fa" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'square':
        return (
          <mesh ref={meshRef} position={position}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#ef4444" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
                <lineBasicMaterial color="#f87171" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'star':
        return (
          <mesh ref={meshRef} position={position}>
            <cylinderGeometry args={[0.5, 1, 0.2, 5]} />
            <meshStandardMaterial color="#f59e0b" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.CylinderGeometry(0.5, 1, 0.2, 5)]} />
                <lineBasicMaterial color="#fbbf24" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'heart':
        return (
          <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#ec4899" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.SphereGeometry(0.8, 8, 8)]} />
                <lineBasicMaterial color="#f472b6" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'rectangle':
        return (
          <mesh ref={meshRef} position={position}>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial color="#8b5cf6" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(2, 1, 1)]} />
                <lineBasicMaterial color="#a78bfa" />
              </lineSegments>
            )}
          </mesh>
        );
      default:
        return null;
    }
  };

  return getShape3D();
};

export const ThreeDCastleScene: React.FC<ThreeDCastleSceneProps> = ({ slots }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {slots.map((slot) => (
          <Shape3D key={slot.id} slot={slot} />
        ))}
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
