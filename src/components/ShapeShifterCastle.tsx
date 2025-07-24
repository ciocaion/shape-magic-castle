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

// Compact castle blueprint sequence
const blueprintSequence = [
  // Main Castle Base (purple square, centered)
  { id: 'castle-base', type: 'square', position: { x: 400, y: 340 }, size: 'large' },
  // Left Tower (blue rectangle, touching left side of square)
  { id: 'tower-left', type: 'rectangle', position: { x: 320, y: 300 }, size: 'medium' },
  // Right Tower (blue rectangle, touching right side of square)
  { id: 'tower-right', type: 'rectangle', position: { x: 480, y: 300 }, size: 'medium' },
  // Center Tower (blue rectangle, above square base)
  { id: 'tower-center', type: 'rectangle', position: { x: 400, y: 260 }, size: 'medium' },
  // Left Roof (green triangle, directly on top of left tower)
  { id: 'roof-left', type: 'triangle', position: { x: 320, y: 220 }, size: 'medium' },
  // Right Roof (green triangle, directly on top of right tower)
  { id: 'roof-right', type: 'triangle', position: { x: 480, y: 220 }, size: 'medium' },
  // Center Roof (green triangle, directly on top of center tower)
  { id: 'roof-center', type: 'triangle', position: { x: 400, y: 180 }, size: 'medium' },
  // Sun (orange circle, top-left corner, far from castle)
  { id: 'sun', type: 'circle', position: { x: 150, y: 120 }, size: 'medium' },
  // Tree Trunk (small blue rectangle, right side of castle, bottom-aligned with base)
  { id: 'tree-trunk', type: 'rectangle', position: { x: 580, y: 340 }, size: 'small' },
  // Tree Top (yellow pentagon, directly on top of trunk)
  { id: 'tree-top', type: 'pentagon', position: { x: 580, y: 300 }, size: 'medium' },
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
  const slots = blueprintSequence.map((slot, idx) => ({
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
