
import React, { useState, useCallback } from 'react';
import { ShapePalette } from './ShapePalette';
import { CastleInterface } from './CastleInterface';
import { ComparisonTask } from './ComparisonTask';
import { ProgressBar } from './ProgressBar';

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
  const [filledSlots, setFilledSlots] = useState<{ [id: string]: boolean }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [exploreShapes, setExploreShapes] = useState<CastleSlot[]>([]);

  const isCompleted = currentStep >= blueprintSequence.length;

  console.log('ShapeShifterCastle render:', { 
    isCompleted, 
    currentStep, 
    totalSteps: blueprintSequence.length,
    isExploreMode 
  });

  const handleShapePlaced = (slotId: string, shapeType: ShapeType) => {
    if (isExploreMode) return;
    
    const expected = blueprintSequence[currentStep];
    if (slotId === expected.id && shapeType === expected.type) {
      setFilledSlots(prev => ({ ...prev, [slotId]: true }));
      setCurrentStep(step => step + 1);
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
      {/* Blueprint Construction Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'var(--blueprint-grid)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-8 left-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute top-8 right-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute bottom-24 left-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute bottom-24 right-8 w-2 h-2 border border-cyan-400 rotate-45" />
      </div>

      {/* Progress Bar - only show in blueprint mode */}
      {!isExploreMode && (
        <ProgressBar
          completed={currentStep}
          total={blueprintSequence.length}
          className="m-6"
        />
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
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

      {/* Shape Palette */}
      <ShapePalette className="mx-6 mb-6" />
    </div>
  );
};
