
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { CastleSlot as CastleSlotType } from './ShapeShifterCastle';
import { Html } from '@react-three/drei';

interface ThreeDCastleSceneProps {
  slots: CastleSlotType[];
}

const Shape3D: React.FC<{ 
  slot: CastleSlotType; 
  onClick: (slotId: string) => void;
  isIsolated: boolean;
}> = ({ slot, onClick, isIsolated }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && slot.filled) {
      // Subtle rotation for 3D effect
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Add hover effect when isolated
      if (isIsolated) {
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      }
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick(slot.id);
  };

  if (!slot.filled) return null;

  // Map 2D pixel positions to 3D coordinates with better spacing for 3D view
  // Create a more spread out layout for better 3D visualization
  const blueprintWidth = 800;
  const blueprintHeight = 600;
  
  // Apply scaling factor for better 3D spacing - reduced for closer castle structure
  const scaleFactor = 0.015; // Smaller scale for closer, more cohesive castle
  const x3d = (slot.position.x - blueprintWidth / 2) * scaleFactor;
  let y3d = -(slot.position.y - blueprintHeight / 2) * scaleFactor;
  
  // Get size multiplier for positioning calculations
  const sizeMultiplier = slot.size === 'large' ? 1.5 : slot.size === 'small' ? 0.5 : 1;
  
  // Adjust positioning for proper alignment
  if (slot.type === 'square') {
    // Keep square at original position - rectangles will align to it
    // No adjustment needed
  } else if (slot.type === 'rectangle' && slot.size !== 'small') {
    // Align rectangle bottom with square bottom
    // Square bottom: y - 0.5 (square center at y, height 1)
    // Rectangle height: 2.4, so rectangle extends 1.2 down from center
    // For rectangle bottom to be at y - 0.5: rectangle center = (y - 0.5) + 1.2 = y + 0.7
    y3d += 0.7; // Move rectangle up to align bottom with square
  } else if (slot.type === 'rectangle' && slot.size === 'small') {
    // Small rectangles (tree trunk) - keep existing logic
    const rectangleHeight = 1.5 * 0.5;
    y3d -= (rectangleHeight / 2) - 0.5;
  } else if (slot.type === 'triangle') {
    // Place triangles almost on top of rectangles
    // Rectangle center: y + 0.7, rectangle height: 2.4
    // Rectangle top: (y + 0.7) + 1.2 = y + 1.9
    y3d += 1.9; // Position at rectangle top
    y3d += 0.05; // Small gap to make it "almost" on top
  }
  
  const position: [number, number, number] = [x3d, y3d, 0];

  const getShape3D = () => {
    // Size multiplier already defined above for positioning
    
    switch (slot.type) {
      case 'triangle':
        return (
          <mesh ref={meshRef} position={position} onClick={handleClick}>
            <coneGeometry args={[1 * sizeMultiplier, 1.0 * sizeMultiplier, 3]} />
            <meshStandardMaterial color="#10b981" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.ConeGeometry(1 * sizeMultiplier, 1.0 * sizeMultiplier, 3)]} />
                <lineBasicMaterial color="#06d6a0" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'circle':
        return (
          <mesh ref={meshRef} position={position} onClick={handleClick}>
            <sphereGeometry args={[0.5 * sizeMultiplier, 32, 32]} />
            <meshStandardMaterial color="#fbbf24" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.SphereGeometry(0.5 * sizeMultiplier, 16, 16)]} />
                <lineBasicMaterial color="#fde047" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'square':
        return (
          <mesh ref={meshRef} position={position} onClick={handleClick}>
            <boxGeometry args={[1 * sizeMultiplier, 1 * sizeMultiplier, 1 * sizeMultiplier]} />
            <meshStandardMaterial color="#ef4444" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(1 * sizeMultiplier, 1 * sizeMultiplier, 1 * sizeMultiplier)]} />
                <lineBasicMaterial color="#f87171" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'pentagon':
        return (
          <mesh ref={meshRef} position={position} onClick={handleClick}>
            <cylinderGeometry args={[0.5 * sizeMultiplier, 0.5 * sizeMultiplier, 1 * sizeMultiplier, 5]} />
            <meshStandardMaterial color="#22c55e" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.CylinderGeometry(0.5 * sizeMultiplier, 0.5 * sizeMultiplier, 1 * sizeMultiplier, 5)]} />
                <lineBasicMaterial color="#4ade80" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'hexagon':
        return (
          <mesh ref={meshRef} position={position} onClick={handleClick}>
            <cylinderGeometry args={[0.5 * sizeMultiplier, 0.5 * sizeMultiplier, 1 * sizeMultiplier, 6]} />
            <meshStandardMaterial color="#ec4899" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={[new THREE.CylinderGeometry(0.5 * sizeMultiplier, 0.5 * sizeMultiplier, 1 * sizeMultiplier, 6)]} />
                <lineBasicMaterial color="#f472b6" />
              </lineSegments>
            )}
          </mesh>
        );
      case 'rectangle':
        return (
          <mesh ref={meshRef} position={position} onClick={handleClick}>
            {slot.size === 'small' ? (
              // Thin and tall for tree trunk
              <boxGeometry args={[0.5 * sizeMultiplier, 1.5 * sizeMultiplier, 1 * sizeMultiplier]} />
            ) : (
              // Tall rectangles for towers - significantly taller than square
              <boxGeometry args={[0.8 * sizeMultiplier, 2.4 * sizeMultiplier, 1 * sizeMultiplier]} />
            )}
            <meshStandardMaterial color="#8b5cf6" />
            {slot.showSymmetry && (
              <lineSegments>
                <edgesGeometry args={slot.size === 'small' ? 
                  [new THREE.BoxGeometry(0.5 * sizeMultiplier, 1.5 * sizeMultiplier, 1 * sizeMultiplier)] :
                  [new THREE.BoxGeometry(0.8 * sizeMultiplier, 2.4 * sizeMultiplier, 1 * sizeMultiplier)]
                } />
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
  // Debug: log which slots are filled and will be rendered
  const filledSlots = slots.filter(slot => slot.filled);
  console.log('ThreeDCastleScene: filled slots for 3D', filledSlots);

  // State for shape isolation
  const [isolatedShapeId, setIsolatedShapeId] = useState<string | null>(null);

  const handleShapeClick = (slotId: string) => {
    setIsolatedShapeId(slotId);
  };

  const handleBackClick = () => {
    setIsolatedShapeId(null);
  };

  // Filter slots based on isolation
  const visibleSlots = isolatedShapeId 
    ? filledSlots.filter(slot => slot.id === isolatedShapeId)
    : filledSlots;

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Back button when a shape is isolated */}
        {isolatedShapeId && (
          <Html position={[-3.5, 3, 0]}>
            <button 
              onClick={handleBackClick}
              className="bg-card rounded-gradeaid p-3 shadow-gradeaid border-l-[6px] border-b-[6px] border-foreground hover:bg-card/90 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <span className="text-primary font-semibold">←</span>
              <span className="text-foreground font-medium">Back to Castle View</span>
            </button>
          </Html>
        )}
        
        {filledSlots.length === 0 && (
          // Show a message in the 3D scene if nothing is placed
          <Html center>
            <div style={{ color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '1em', borderRadius: '8px' }}>
              No shapes placed yet! Switch to Blueprint view and place shapes to see them here.
            </div>
          </Html>
        )}
        
        {visibleSlots.map((slot) => (
          <Shape3D 
            key={slot.id} 
            slot={slot} 
            onClick={handleShapeClick}
            isIsolated={isolatedShapeId === slot.id}
          />
        ))}
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
