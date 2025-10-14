
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShapePalette } from './ShapePalette';
import { CastleInterface } from './CastleInterface';
import { ComparisonTask } from './ComparisonTask';
import { ProgressBar } from './ProgressBar';
import { tutorService } from '../services/tutorService';

export type ShapeType = 'square' | 'rectangle' | 'triangle' | 'circle' | 'pentagon' | 'hexagon';

export interface CastleSlot {
  id: string;
  type: ShapeType;
  position: { x: number; y: number };
  size?: 'small' | 'medium' | 'large';
  filled: boolean;
  active: boolean;
  locked: boolean;
  showSymmetry: boolean;
  isExploreMode?: boolean;
  rotation?: number;
}

export interface GameState {
  slots: CastleSlot[];
  currentTask: 'building' | 'comparison' | 'explore';
  completedSlots: number;
  totalSlots: number;
  comparisonQuestion?: {
    shapes: { type: ShapeType; size?: 'small' | 'large'; is3D?: boolean }[];
    task: 'bigger' | 'more-corners' | '3d-shape';
  };
}

// Compact castle blueprint sequence - proper castle formation with triangles directly on top of rectangles
const blueprintSequence = [
  { id: 'tower-center', type: 'rectangle' as ShapeType, position: { x: 400, y: 320 }, size: 'medium' as const },
  { id: 'castle-base', type: 'square' as ShapeType, position: { x: 400, y: 350 }, size: 'large' as const },
  { id: 'tower-left', type: 'rectangle' as ShapeType, position: { x: 340, y: 350 }, size: 'medium' as const },
  { id: 'tower-right', type: 'rectangle' as ShapeType, position: { x: 460, y: 350 }, size: 'medium' as const },
  { id: 'roof-left', type: 'triangle' as ShapeType, position: { x: 340, y: 302 }, size: 'medium' as const },
  { id: 'roof-right', type: 'triangle' as ShapeType, position: { x: 460, y: 302 }, size: 'medium' as const },
  { id: 'roof-center', type: 'triangle' as ShapeType, position: { x: 400, y: 272 }, size: 'medium' as const },
  { id: 'sun', type: 'circle' as ShapeType, position: { x: 120, y: 150 }, size: 'medium' as const },
  { id: 'tree-trunk', type: 'rectangle' as ShapeType, position: { x: 580, y: 350 }, size: 'small' as const },
  { id: 'tree-top', type: 'pentagon' as ShapeType, position: { x: 580, y: 318 }, size: 'medium' as const },
];

export const ShapeShifterCastle: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [filledSlots, setFilledSlots] = useState<{ [id: string]: boolean }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [exploreShapes, setExploreShapes] = useState<CastleSlot[]>([]);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  const isCompleted = currentStep >= blueprintSequence.length;

  // Language change handled globally in App

  // Show intro message when component mounts
  useEffect(() => {
    if (!hasShownIntro) {
      setTimeout(() => {
        tutorService.sendInstructionMessage(t, 'tutor.intro');
        setHasShownIntro(true);
      }, 1000); // Small delay to ensure UI is ready
    }
  }, [t, hasShownIntro]);

  console.log('ShapeShifterCastle render:', { 
    isCompleted, 
    currentStep, 
    totalSteps: blueprintSequence.length,
    isExploreMode 
  });

  // Get tutor message key based on step and slot
  const getTutorMessageKey = (step: number, slotId: string): string => {
    switch (step) {
      case 0: // tower-center (rectangle)
        return 'tutor.rectangle_base';
      case 1: // castle-base (square)
        return 'tutor.square_hall';
      case 2: // tower-left (rectangle) - first side tower
        return 'tutor.rectangles_towers';
      case 3: // tower-right (rectangle) - second side tower
        return ''; // Already showed rectangles_towers message
      case 4: // roof-left (triangle) - first roof
        return 'tutor.triangles_roofs';
      case 5: // roof-right (triangle) - second roof
      case 6: // roof-center (triangle) - third roof
        return ''; // Already showed triangles_roofs message
      case 7: // sun (circle)
        return 'tutor.circle_sun';
      case 8: // tree-trunk (rectangle)
        return 'tutor.rectangle_trunk';
      case 9: // tree-top (pentagon)
        return 'tutor.pentagon_leaves';
      default: 
        return '';
    }
  };

  const handleShapePlaced = (slotId: string, shapeType: ShapeType) => {
    if (isExploreMode) return;
    
    const expected = blueprintSequence[currentStep];
    if (slotId === expected.id && shapeType === expected.type) {
      setFilledSlots(prev => ({ ...prev, [slotId]: true }));
      
      // Send success message for correct placement
      tutorService.sendSuccessMessage(t, 'tutor.encouragements.nice_match');
      
      // Get and send instruction for next step
      const messageKey = getTutorMessageKey(currentStep, slotId);
      if (messageKey) {
        setTimeout(() => {
          tutorService.sendInstructionMessage(t, messageKey);
        }, 500);
      }
      
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      // Check if blueprint is complete
      if (newStep >= blueprintSequence.length) {
        setTimeout(() => {
          tutorService.sendSuccessMessage(t, 'tutor.blueprint_complete');
        }, 1000);
      }
    }
  };

  const handleShapeClick = (shapeType: ShapeType) => {
    if (isExploreMode) return;
    
    const expected = blueprintSequence[currentStep];
    if (shapeType === expected.type) {
      handleShapePlaced(expected.id, shapeType);
    }
  };

  const handleExploreShapePlaced = (position: { x: number; y: number }, shapeType: ShapeType) => {
    const newShape: CastleSlot = {
      id: `explore-${Date.now()}-${Math.random()}`,
      type: shapeType,
      position,
      size: 'medium',
      filled: true,
      active: false,
      locked: false,
      showSymmetry: false,
      isExploreMode: true,
      rotation: 0,
    };
    setExploreShapes(prev => [...prev, newShape]);
  };

  const handleExploreShapeRemoved = (shapeId: string) => {
    setExploreShapes(prev => prev.filter(shape => shape.id !== shapeId));
  };

  const handleExploreShapeMoved = (shapeId: string, newPosition: { x: number; y: number }) => {
    setExploreShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, position: newPosition }
        : shape
    ));
  };

  const handleExploreShapeRotated = (shapeId: string) => {
    setExploreShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, rotation: (shape.rotation || 0) + 45 }
        : shape
    ));
  };

  const handleStartExplore = () => {
    setIsExploreMode(true);
    setTimeout(() => {
      tutorService.sendInstructionMessage(t, 'tutor.explore_mode');
    }, 500);
  };

  // Prepare slots for rendering
  const slots: CastleSlot[] = [
    ...blueprintSequence.map((slot, idx) => ({
      ...slot,
      filled: !!filledSlots[slot.id],
      active: idx === currentStep && !isExploreMode,
      locked: idx < currentStep,
      showSymmetry: false,
    })),
    ...exploreShapes,
  ];

  return (
    <div className="min-h-screen bg-gradient-blueprint flex flex-col relative overflow-hidden">
      {/* Blueprint Construction Grid Background - responsive grid size */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'var(--blueprint-grid)',
          backgroundSize: '20px 20px' // Smaller on mobile
        }}
      />
      <div 
        className="absolute inset-0 opacity-30 hidden md:block"
        style={{
          backgroundImage: 'var(--blueprint-grid)',
          backgroundSize: '30px 30px' // Medium on tablet
        }}
      />
      <div 
        className="absolute inset-0 opacity-30 hidden lg:block"
        style={{
          backgroundImage: 'var(--blueprint-grid)',
          backgroundSize: '40px 40px' // Larger on desktop
        }}
      />
      
      {/* Blueprint corner markers - responsive positioning */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-2 left-2 md:top-4 md:left-4 lg:top-8 lg:left-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute top-2 right-2 md:top-4 md:right-4 lg:top-8 lg:right-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute bottom-16 left-2 md:bottom-20 md:left-4 lg:bottom-24 lg:left-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute bottom-16 right-2 md:bottom-20 md:right-4 lg:bottom-24 lg:right-8 w-2 h-2 border border-cyan-400 rotate-45" />
      </div>

      {/* Progress Bar - only show in blueprint mode - responsive spacing */}
      {!isExploreMode && (
        <ProgressBar
          completed={currentStep}
          total={blueprintSequence.length}
          className="mx-2 mt-2 mb-1 md:mx-4 md:mt-4 md:mb-2 lg:mx-6 lg:mt-6 lg:mb-4"
        />
      )}

      {/* Main Game Area - responsive padding */}
      <div className="flex-1 flex flex-col px-2 md:px-4 lg:px-6">
        <CastleInterface
          slots={slots}
          onShapePlaced={handleShapePlaced}
          onExploreShapePlaced={handleExploreShapePlaced}
          onExploreShapeRemoved={handleExploreShapeRemoved}
          onExploreShapeMoved={handleExploreShapeMoved}
          onExploreShapeRotated={handleExploreShapeRotated}
          isExploreMode={isExploreMode}
          isCompleted={isCompleted}
          onStartExplore={handleStartExplore}
        />
      </div>

      {/* Shape Palette - responsive positioning and spacing */}
      <ShapePalette 
        className="mx-2 mb-2 md:mx-4 md:mb-4 lg:mx-6 lg:mb-6"
        activeShapeType={!isExploreMode && currentStep < blueprintSequence.length ? blueprintSequence[currentStep].type : null}
        onShapeClick={handleShapeClick}
      />
    </div>
  );
};
