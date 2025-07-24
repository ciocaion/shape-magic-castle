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
}

export interface GameState {
  slots: CastleSlot[];
  currentTask: 'building' | 'comparison';
  completedSlots: number;
  totalSlots: number;
  comparisonQuestion?: {
    shapes: { type: ShapeType; size?: 'small' | 'large'; is3D?: boolean }[];
    task: 'bigger' | 'more-corners' | '3d-shape';
  };
}

// Castle blueprint sequence
const castleBlueprintSequence = [
  { id: 'castle-base', type: 'square' as ShapeType, position: { x: 400, y: 350 }, size: 'large' as const },
  { id: 'tower-center', type: 'rectangle' as ShapeType, position: { x: 400, y: 320 }, size: 'medium' as const },
  { id: 'tower-left', type: 'rectangle' as ShapeType, position: { x: 340, y: 350 }, size: 'medium' as const },
  { id: 'tower-right', type: 'rectangle' as ShapeType, position: { x: 460, y: 350 }, size: 'medium' as const },
  { id: 'roof-left', type: 'triangle' as ShapeType, position: { x: 340, y: 290 }, size: 'medium' as const },
  { id: 'roof-right', type: 'triangle' as ShapeType, position: { x: 460, y: 290 }, size: 'medium' as const },
  { id: 'roof-center', type: 'triangle' as ShapeType, position: { x: 400, y: 260 }, size: 'medium' as const },
  { id: 'sun', type: 'circle' as ShapeType, position: { x: 120, y: 200 }, size: 'medium' as const },
  { id: 'tree-trunk', type: 'rectangle' as ShapeType, position: { x: 580, y: 350 }, size: 'small' as const },
  { id: 'tree-top', type: 'pentagon' as ShapeType, position: { x: 580, y: 320 }, size: 'medium' as const },
];

// Airplane blueprint sequence - matching the screenshot layout
const airplaneBlueprintSequence = [
  { id: 'plane-body', type: 'rectangle' as ShapeType, position: { x: 400, y: 300 }, size: 'large' as const },
  { id: 'plane-nose', type: 'triangle' as ShapeType, position: { x: 520, y: 300 }, size: 'medium' as const },
  { id: 'plane-wing-top', type: 'rectangle' as ShapeType, position: { x: 400, y: 260 }, size: 'medium' as const },
  { id: 'plane-wing-bottom', type: 'rectangle' as ShapeType, position: { x: 400, y: 340 }, size: 'medium' as const },
  { id: 'plane-tail-body', type: 'rectangle' as ShapeType, position: { x: 300, y: 300 }, size: 'small' as const },
  { id: 'plane-tail-fin', type: 'triangle' as ShapeType, position: { x: 300, y: 260 }, size: 'small' as const },
  { id: 'propeller', type: 'circle' as ShapeType, position: { x: 560, y: 300 }, size: 'small' as const },
  { id: 'cloud-1', type: 'circle' as ShapeType, position: { x: 150, y: 180 }, size: 'medium' as const },
  { id: 'cloud-2', type: 'circle' as ShapeType, position: { x: 600, y: 200 }, size: 'medium' as const },
];

export const ShapeShifterCastle: React.FC = () => {
  const [currentBlueprint, setCurrentBlueprint] = useState<'castle' | 'airplane'>('castle');
  const [filledSlots, setFilledSlots] = useState<{ [id: string]: boolean }>({});
  const [currentStep, setCurrentStep] = useState(0);

  const blueprintSequence = currentBlueprint === 'castle' ? castleBlueprintSequence : airplaneBlueprintSequence;

  const handleShapePlaced = (slotId: string, shapeType: ShapeType) => {
    const expected = blueprintSequence[currentStep];
    if (slotId === expected.id && shapeType === expected.type) {
      setFilledSlots(prev => ({ ...prev, [slotId]: true }));
      setCurrentStep(step => step + 1);
    } else {
      // Incorrect shape or slot: trigger error feedback
    }
  };

  const handleBuildAnother = () => {
    setCurrentBlueprint('airplane');
    setFilledSlots({});
    setCurrentStep(0);
  };

  const slots: CastleSlot[] = blueprintSequence.map((slot, idx) => ({
    ...slot,
    filled: !!filledSlots[slot.id],
    active: idx === currentStep,
    locked: idx < currentStep,
    showSymmetry: false,
  }));

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
      {/* Subtle Blueprint Corner Markers */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-8 left-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute top-8 right-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute bottom-24 left-8 w-2 h-2 border border-cyan-400 rotate-45" />
        <div className="absolute bottom-24 right-8 w-2 h-2 border border-cyan-400 rotate-45" />
      </div>
      {/* Progress Bar */}
      <ProgressBar
        completed={currentStep}
        total={blueprintSequence.length}
        className="m-6"
      />
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        <CastleInterface
          slots={slots}
          onShapePlaced={handleShapePlaced}
          onBuildAnother={handleBuildAnother}
        />
      </div>
      {/* Shape Palette */}
      <ShapePalette className="mx-6 mb-6" />
    </div>
  );
};
