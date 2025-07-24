
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

// Compact castle blueprint sequence - proper castle formation
const blueprintSequence = [
  // Main Castle Base (purple square, centered bottom)
  { id: 'castle-base', type: 'square' as ShapeType, position: { x: 400, y: 350 }, size: 'large' as const },
  // Left Tower (blue rectangle, positioned on left side touching the base)
  { id: 'tower-left', type: 'rectangle' as ShapeType, position: { x: 340, y: 280 }, size: 'medium' as const },
  // Right Tower (blue rectangle, positioned on right side touching the base)
  { id: 'tower-right', type: 'rectangle' as ShapeType, position: { x: 460, y: 280 }, size: 'medium' as const },
  // Center Tower (blue rectangle, positioned directly above castle base)
  { id: 'tower-center', type: 'rectangle' as ShapeType, position: { x: 400, y: 260 }, size: 'medium' as const },
  // Left Roof (green triangle, positioned directly on top of left tower)
  { id: 'roof-left', type: 'triangle' as ShapeType, position: { x: 340, y: 210 }, size: 'medium' as const },
  // Right Roof (green triangle, positioned directly on top of right tower)
  { id: 'roof-right', type: 'triangle' as ShapeType, position: { x: 460, y: 210 }, size: 'medium' as const },
  // Center Roof (green triangle, positioned directly on top of center tower)
  { id: 'roof-center', type: 'triangle' as ShapeType, position: { x: 400, y: 190 }, size: 'medium' as const },
  // Sun (orange circle, positioned in top-left area)
  { id: 'sun', type: 'circle' as ShapeType, position: { x: 120, y: 80 }, size: 'medium' as const },
  // Tree Trunk (small blue rectangle, positioned to the right of castle)
  { id: 'tree-trunk', type: 'rectangle' as ShapeType, position: { x: 580, y: 350 }, size: 'small' as const },
  // Tree Top (yellow pentagon, positioned directly on top of tree trunk)
  { id: 'tree-top', type: 'pentagon' as ShapeType, position: { x: 580, y: 320 }, size: 'medium' as const },
];

export const ShapeShifterCastle: React.FC = () => {
  // Track which slots are filled by id
  const [filledSlots, setFilledSlots] = useState<{ [id: string]: boolean }>({});
  // Track the current step in the sequence
  const [currentStep, setCurrentStep] = useState(0);

  // Handler for placing a shape
  const handleShapePlaced = (slotId: string, shapeType: ShapeType) => {
    const expected = blueprintSequence[currentStep];
    if (slotId === expected.id && shapeType === expected.type) {
      setFilledSlots(prev => ({ ...prev, [slotId]: true }));
      setCurrentStep(step => step + 1);
    } else {
      // Incorrect shape or slot: trigger error feedback (handled in BlueprintCastleSlot)
    }
  };

  // Prepare slots for rendering: previous slots are filled, current is active, rest are hidden
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
        />
      </div>
      {/* Shape Palette */}
      <ShapePalette className="mx-6 mb-6" />
    </div>
  );
};
