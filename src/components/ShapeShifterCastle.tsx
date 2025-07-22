import React, { useState, useCallback } from 'react';
import { ShapePalette } from './ShapePalette';
import { CastleInterface } from './CastleInterface';
import { ComparisonTask } from './ComparisonTask';
import { ProgressBar } from './ProgressBar';
import { CelebrationAnimation } from './CelebrationAnimation';

export type ShapeType = 'square' | 'rectangle' | 'triangle' | 'circle' | 'star' | 'heart';

export interface CastleSlot {
  id: string;
  type: ShapeType;
  position: { x: number; y: number };
  filled: boolean;
  showSymmetry: boolean;
}

export interface GameState {
  slots: CastleSlot[];
  currentTask: 'building' | 'comparison' | 'celebration';
  completedSlots: number;
  totalSlots: number;
  comparisonQuestion?: {
    shapes: { type: ShapeType; size?: 'small' | 'large'; is3D?: boolean }[];
    task: 'bigger' | 'more-corners' | '3d-shape';
  };
}

const initialSlots: CastleSlot[] = [
  // Blueprint Castle Design - Precisely positioned for architectural learning
  
  // Symmetrical Roof Triangles (Top Left/Right) - Bilateral Symmetry Learning
  { id: 'roof-left', type: 'triangle', position: { x: 25, y: 15 }, filled: false, showSymmetry: false },
  { id: 'roof-right', type: 'triangle', position: { x: 75, y: 15 }, filled: false, showSymmetry: false },
  
  // Central Star Crest (Top Center) - Rotational Symmetry Learning
  { id: 'star-crest', type: 'star', position: { x: 50, y: 12 }, filled: false, showSymmetry: false },
  
  // Symmetrical Heart Gate (Top Right) - Mirroring Concept
  { id: 'heart-gate', type: 'heart', position: { x: 65, y: 25 }, filled: false, showSymmetry: false },
  
  // Twin Purple Tower Foundations (Mid-Level) - 2D to 3D Circle to Sphere
  { id: 'tower-left', type: 'circle', position: { x: 20, y: 35 }, filled: false, showSymmetry: false },
  { id: 'tower-right', type: 'circle', position: { x: 80, y: 35 }, filled: false, showSymmetry: false },
  
  // Central Grand Dome Foundation (Bottom Center) - Grand 2D to 3D Transformation
  { id: 'grand-dome', type: 'circle', position: { x: 50, y: 60 }, filled: false, showSymmetry: false },
  
  // Entrance Portal (Rectangle) - Completing the blueprint
  { id: 'entrance', type: 'rectangle', position: { x: 50, y: 75 }, filled: false, showSymmetry: false },
];

export const ShapeShifterCastle: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    slots: initialSlots,
    currentTask: 'building',
    completedSlots: 0,
    totalSlots: initialSlots.length,
    comparisonQuestion: undefined,
  });

  const handleShapePlaced = useCallback((slotId: string, shapeType: ShapeType) => {
    setGameState(prev => {
      const slot = prev.slots.find(s => s.id === slotId);
      if (!slot || slot.type !== shapeType || slot.filled) {
        // Wrong shape or slot already filled - show error feedback
        return prev;
      }

      const updatedSlots = prev.slots.map(s =>
        s.id === slotId
          ? { ...s, filled: true, showSymmetry: true }
          : s
      );

      const newCompletedSlots = prev.completedSlots + 1;
      const shouldShowComparison = newCompletedSlots % 3 === 0 && newCompletedSlots < prev.totalSlots;
      const isGameComplete = newCompletedSlots >= prev.totalSlots;

      // Generate comparison task
      const comparisonQuestion = shouldShowComparison ? generateComparisonTask() : undefined;

      return {
        ...prev,
        slots: updatedSlots,
        completedSlots: newCompletedSlots,
        currentTask: isGameComplete ? 'celebration' : shouldShowComparison ? 'comparison' : 'building',
        comparisonQuestion,
      };
    });
  }, []);

  const handleComparisonComplete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTask: prev.completedSlots >= prev.totalSlots ? 'celebration' : 'building',
      comparisonQuestion: undefined,
    }));
  }, []);

  const generateComparisonTask = () => {
    const tasks = [
      {
        shapes: [
          { type: 'circle' as ShapeType, size: 'small' as const },
          { type: 'circle' as ShapeType, size: 'large' as const }
        ],
        task: 'bigger' as const
      },
      {
        shapes: [
          { type: 'triangle' as ShapeType },
          { type: 'square' as ShapeType }
        ],
        task: 'more-corners' as const
      },
      {
        shapes: [
          { type: 'square' as ShapeType, is3D: false },
          { type: 'square' as ShapeType, is3D: true }
        ],
        task: '3d-shape' as const
      }
    ];
    
    return tasks[Math.floor(Math.random() * tasks.length)];
  };

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
        completed={gameState.completedSlots}
        total={gameState.totalSlots}
        className="m-6"
      />

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        {gameState.currentTask === 'comparison' && gameState.comparisonQuestion ? (
          <ComparisonTask
            question={gameState.comparisonQuestion}
            onComplete={handleComparisonComplete}
          />
        ) : gameState.currentTask === 'celebration' ? (
          <CelebrationAnimation />
        ) : (
          <CastleInterface
            slots={gameState.slots}
            onShapePlaced={handleShapePlaced}
          />
        )}
      </div>

      {/* Shape Palette */}
      {gameState.currentTask === 'building' && (
        <ShapePalette className="mx-6 mb-6" />
      )}
    </div>
  );
};