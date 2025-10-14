
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { CastleSlot as CastleSlotType } from './ShapeShifterCastle';
import { Html } from '@react-three/drei';
import { tutorService } from '../services/tutorService';

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

  // Map 2D pixel positions to 3D coordinates
  const blueprintWidth = 800;
  const blueprintHeight = 600;
  
  // For explore mode shapes, use direct position mapping with better spacing
  if (slot.isExploreMode) {
    const scaleFactor = 0.01; // Reduced for better spacing
    const x3d = (slot.position.x - blueprintWidth / 2) * scaleFactor;
    const y3d = -(slot.position.y - blueprintHeight / 2) * scaleFactor;
    const position: [number, number, number] = [x3d, y3d, 0];
    
    // Apply rotation from explore mode - convert degrees to radians and apply to Z-axis
    const rotationZ = (slot.rotation || 0) * (Math.PI / 180);
    
    return (
      <mesh 
        ref={meshRef} 
        position={position} 
        onClick={handleClick}
        rotation={[0, 0, rotationZ]}
      >
        {getShape3DGeometry(slot)}
      </mesh>
    );
  }
  
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

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      {getShape3DGeometry(slot)}
    </mesh>
  );
};

// Extract shape geometry logic into a separate function
const getShape3DGeometry = (slot: CastleSlotType) => {
  const sizeMultiplier = slot.size === 'large' ? 1.5 : slot.size === 'small' ? 0.5 : 1;
  
  switch (slot.type) {
    case 'triangle':
      return (
        <>
          <coneGeometry args={[0.8 * sizeMultiplier, 1.2 * sizeMultiplier, 3]} />
          <meshStandardMaterial color="#10b981" />
          {slot.showSymmetry && (
            <lineSegments>
              <edgesGeometry args={[new THREE.ConeGeometry(0.8 * sizeMultiplier, 1.2 * sizeMultiplier, 3)]} />
              <lineBasicMaterial color="#06d6a0" />
            </lineSegments>
          )}
        </>
      );
    case 'circle':
      return (
        <>
          <sphereGeometry args={[0.6 * sizeMultiplier, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" />
          {slot.showSymmetry && (
            <lineSegments>
              <edgesGeometry args={[new THREE.SphereGeometry(0.6 * sizeMultiplier, 16, 16)]} />
              <lineBasicMaterial color="#fde047" />
            </lineSegments>
          )}
        </>
      );
    case 'square':
      return (
        <>
          <boxGeometry args={[1.2 * sizeMultiplier, 1.2 * sizeMultiplier, 1.2 * sizeMultiplier]} />
          <meshStandardMaterial color="#ef4444" />
          {slot.showSymmetry && (
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.2 * sizeMultiplier, 1.2 * sizeMultiplier, 1.2 * sizeMultiplier)]} />
              <lineBasicMaterial color="#f87171" />
            </lineSegments>
          )}
        </>
      );
    case 'pentagon':
      return (
        <>
          <cylinderGeometry args={[0.6 * sizeMultiplier, 0.6 * sizeMultiplier, 1.2 * sizeMultiplier, 5]} />
          <meshStandardMaterial color="#22c55e" />
          {slot.showSymmetry && (
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.6 * sizeMultiplier, 0.6 * sizeMultiplier, 1.2 * sizeMultiplier, 5)]} />
              <lineBasicMaterial color="#4ade80" />
            </lineSegments>
          )}
        </>
      );
    case 'hexagon':
      return (
        <>
          <cylinderGeometry args={[0.6 * sizeMultiplier, 0.6 * sizeMultiplier, 1.2 * sizeMultiplier, 6]} />
          <meshStandardMaterial color="#ec4899" />
          {slot.showSymmetry && (
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.6 * sizeMultiplier, 0.6 * sizeMultiplier, 1.2 * sizeMultiplier, 6)]} />
              <lineBasicMaterial color="#f472b6" />
            </lineSegments>
          )}
        </>
      );
    case 'rectangle':
      return (
        <>
          {slot.size === 'small' ? (
            // Thin and tall for tree trunk
            <boxGeometry args={[0.4 * sizeMultiplier, 1.8 * sizeMultiplier, 1.2 * sizeMultiplier]} />
          ) : (
            // Tall rectangles for towers - with proper spacing
            <boxGeometry args={[1.0 * sizeMultiplier, 2.8 * sizeMultiplier, 1.2 * sizeMultiplier]} />
          )}
          <meshStandardMaterial color="#8b5cf6" />
          {slot.showSymmetry && (
            <lineSegments>
              <edgesGeometry args={slot.size === 'small' ? 
                [new THREE.BoxGeometry(0.4 * sizeMultiplier, 1.8 * sizeMultiplier, 1.2 * sizeMultiplier)] :
                [new THREE.BoxGeometry(1.0 * sizeMultiplier, 2.8 * sizeMultiplier, 1.2 * sizeMultiplier)]
              } />
              <lineBasicMaterial color="#a78bfa" />
            </lineSegments>
          )}
        </>
      );
    default:
      return null;
  }
};

export const ThreeDCastleScene: React.FC<ThreeDCastleSceneProps> = ({ slots }) => {
  const { t } = useTranslation();
  
  // Debug: log which slots are filled and will be rendered
  const filledSlots = slots.filter(slot => slot.filled);
  console.log('ThreeDCastleScene: filled slots for 3D', filledSlots);

  // State for shape isolation
  const [isolatedShapeId, setIsolatedShapeId] = useState<string | null>(null);

  // If no shapes placed, send an instructional tutor message instead of showing text in UI
  useEffect(() => {
    if (filledSlots.length === 0) {
      tutorService.sendInstructionMessage(t, 'tutor.no_shapes_hint', { context: 'threeDScene' });
    }
  }, [filledSlots.length, t]);

  const handleShapeClick = (slotId: string) => {
    // Find the clicked slot to get its shape type
    const clickedSlot = filledSlots.find(slot => slot.id === slotId);
    if (clickedSlot) {
      // Send 3D shape learning message based on shape type
      const messageKey = `tutor.3d_shapes.${clickedSlot.type}`;
      tutorService.sendInstructionMessage(t, messageKey, { 
        shapeType: clickedSlot.type,
        slotId: slotId 
      });
    }
    
    // Continue with existing isolation functionality
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
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Back button when a shape is isolated - responsive positioning and sizing */}
        {isolatedShapeId && (
          <Html position={[-4, 4, 0]}>
            <button 
              onClick={handleBackClick}
              className="bg-card rounded-gradeaid p-2 md:p-3 shadow-gradeaid border-l-[4px] md:border-l-[6px] border-b-[4px] md:border-b-[6px] border-foreground hover:bg-card/90 transition-all duration-300 flex items-center gap-1 md:gap-2 whitespace-nowrap touch-manipulation"
            >
              <span className="text-primary font-semibold text-sm md:text-base">←</span>
              <span className="text-foreground font-medium text-xs md:text-sm">
                <span className="hidden sm:inline">{t('ui.back_to_castle')}</span>
                <span className="sm:hidden">{t('ui.back')}</span>
              </span>
            </button>
          </Html>
        )}
        
        {/* No inline instructional text when there are no shapes; message is sent via tutor service */}
        
        {visibleSlots.map((slot) => (
          <Shape3D 
            key={slot.id} 
            slot={slot} 
            onClick={handleShapeClick}
            isIsolated={isolatedShapeId === slot.id}
          />
        ))}
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.05}
          maxDistance={20}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
