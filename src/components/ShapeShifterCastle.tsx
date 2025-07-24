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

// Step-by-step sequence for the castle blueprint
const blueprintSequence = [
  // Back Tower (tall rectangle, positioned behind square - rendered first)
  { id: 'tower-back', type: 'rectangle', position: { x: 400, y: 280 }, size: 'medium' },
  // Main Castle Base (large square, rendered on top of back tower)
  { id: 'castle-base', type: 'square', position: { x: 400, y: 300 }, size: 'large' },
  // Left Tower (tall rectangle, very close to left edge of square)
  { id: 'tower-left', type: 'rectangle', position: { x: 344, y: 300 }, size: 'medium' },
  // Right Tower (tall rectangle, very close to right edge of square)
  { id: 'tower-right', type: 'rectangle', position: { x: 456, y: 300 }, size: 'medium' },
  // Left Roof (triangle above left tower)
  { id: 'roof-left', type: 'triangle', position: { x: 344, y: 252 }, size: 'medium' },
  // Right Roof (triangle above right tower)
  { id: 'roof-right', type: 'triangle', position: { x: 456, y: 252 }, size: 'medium' },
  // Back Roof (triangle above back tower)
  { id: 'roof-back', type: 'triangle', position: { x: 400, y: 232 }, size: 'medium' },
  // Tree Trunk (thin vertical rectangle, closer to castle, bottom-aligned)
  { id: 'tree-trunk', type: 'rectangle', position: { x: 550, y: 300 }, size: 'small' },
  // Tree Top (green pentagon, on top of trunk - closer to castle)
  { id: 'tree-top', type: 'pentagon', position: { x: 550, y: 268 }, size: 'medium' },
  // Sun (circle, closer to castle - brought down even more)
  { id: 'sun', type: 'circle', position: { x: 250, y: 200 }, size: 'medium' },
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
