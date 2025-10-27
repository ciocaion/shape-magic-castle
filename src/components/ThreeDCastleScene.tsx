
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { CastleSlot as CastleSlotType } from './ShapeShifterCastle';
import { tutorService } from '../services/tutorService';
import { getShapeColor } from '../lib/shapeColors';

const PX_PER_UNIT = 100;

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

  // Shared 2D(px) -> 3D(world) mapping using orthographic camera
  // The 2D positions are center-anchored pixels; y is inverted in 3D
  const { size } = useThree();
  const w = size.width;
  const h = size.height;
  const x3d = (slot.position.x - w / 2) / PX_PER_UNIT;
  const y3d = (h / 2 - slot.position.y) / PX_PER_UNIT;
  const position: [number, number, number] = [x3d, y3d, 0];

  if (slot.isExploreMode) {
    // Apply rotation from explore mode - convert degrees to radians and apply to Z-axis
    // Negate rotation to account for Y-axis flip (2D screen coords vs 3D world coords)
    const rotationZ = -(slot.rotation || 0) * (Math.PI / 180);
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

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      {getShape3DGeometry(slot)}
    </mesh>
  );
};

// Extract shape geometry logic into a separate function
const getShape3DGeometry = (slot: CastleSlotType) => {
  // Convert 2D slot size (in px) to world units using shared PX_PER_UNIT
  const size = slot.size ?? 'medium';

  const getDimsPx = () => {
    if (slot.type === 'rectangle') {
      if (size === 'small') return { w: 16, h: 64 };
      if (size === 'large') return { w: 80, h: 80 }; // keep aspect; we will treat as square-like rect if needed
      return { w: 32, h: 96 };
    }
    // squares, triangles, circles, pentagon, hexagon share same side for blueprint
    const side = size === 'small' ? 32 : size === 'large' ? 80 : 48;
    return { w: side, h: side };
  };

  const dimsPx = getDimsPx();
  const wWorld = dimsPx.w / PX_PER_UNIT;
  const hWorld = dimsPx.h / PX_PER_UNIT;
  const depth = Math.max(0.12, Math.min(0.24, Math.min(wWorld, hWorld) * 0.3));

  // Get matching color from shared color system
  const color = getShapeColor(slot.type, slot.colorIndex || 0);

  switch (slot.type) {
    case 'triangle': {
      return (
        <>
          <coneGeometry args={[wWorld / 2, hWorld, 3]} />
          <meshStandardMaterial color={color} />
        </>
      );
    }
    case 'circle': {
      return (
        <>
          <sphereGeometry args={[wWorld / 2, 32, 32]} />
          <meshStandardMaterial color={color} />
        </>
      );
    }
    case 'square': {
      return (
        <>
          <boxGeometry args={[wWorld, hWorld, depth]} />
          <meshStandardMaterial color={color} />
        </>
      );
    }
    case 'pentagon': {
      return (
        <>
          <cylinderGeometry args={[wWorld / 2, wWorld / 2, hWorld, 5]} />
          <meshStandardMaterial color={color} />
        </>
      );
    }
    case 'hexagon': {
      return (
        <>
          <cylinderGeometry args={[wWorld / 2, wWorld / 2, hWorld, 6]} />
          <meshStandardMaterial color={color} />
        </>
      );
    }
    case 'rectangle': {
      return (
        <>
          <boxGeometry args={[wWorld, hWorld, depth]} />
          <meshStandardMaterial color={color} />
        </>
      );
    }
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
    <div className="w-full h-full relative">
      {/* Fixed back button when a shape is isolated */}
      {isolatedShapeId && (
        <button 
          onClick={handleBackClick}
          className="absolute top-4 left-4 z-10 bg-card rounded-gradeaid p-2 md:p-3 shadow-gradeaid border-l-[4px] md:border-l-[6px] border-b-[4px] md:border-b-[6px] border-foreground hover:bg-card/90 transition-all duration-300 flex items-center gap-1 md:gap-2 whitespace-nowrap touch-manipulation"
        >
          <span className="text-primary font-semibold text-sm md:text-base">←</span>
          <span className="text-foreground font-medium text-xs md:text-sm">
            <span className="hidden sm:inline">{t('ui.back_to_castle')}</span>
            <span className="sm:hidden">{t('ui.back')}</span>
          </span>
        </button>
      )}
      
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={PX_PER_UNIT} near={0.1} far={1000} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
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
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
          minZoom={PX_PER_UNIT * 0.5}
          maxZoom={PX_PER_UNIT * 2}
        />
      </Canvas>
    </div>
  );
};
