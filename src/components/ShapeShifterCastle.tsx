import React, { useState, useCallback } from 'react';
import { ShapePalette } from './ShapePalette';
import { CastleInterface } from './CastleInterface';
import { ComparisonTask } from './ComparisonTask';
import { ProgressBar } from './ProgressBar';

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
  currentTask: 'building' | 'comparison';
  completedSlots: number;
  totalSlots: number;
  comparisonQuestion?: {
    shapes: { type: ShapeType; size?: 'small' | 'large'; is3D?: boolean }[];
    task: 'bigger' | 'more-corners' | '3d-shape';
  };
}

const initialSlots: CastleSlot[] = [
  // Castle Blueprint Design - Authentic castle architecture layout
  
  // Castle Towers (Symmetrical Left/Right) - Round tower foundations
  { id: 'tower-left', type: 'circle', position: { x: 15, y: 25 }, filled: false, showSymmetry: false },
  { id: 'tower-right', type: 'circle', position: { x: 85, y: 25 }, filled: false, showSymmetry: false },
  
  // Tower Roofs (Triangular tops for towers) - Bilateral Symmetry Learning
  { id: 'roof-left', type: 'triangle', position: { x: 15, y: 15 }, filled: false, showSymmetry: false },
  { id: 'roof-right', type: 'triangle', position: { x: 85, y: 15 }, filled: false, showSymmetry: false },
  
  // Central Keep (Main castle structure) - Grand 2D to 3D Transformation
  { id: 'central-keep', type: 'square', position: { x: 50, y: 35 }, filled: false, showSymmetry: false },
  
  // Royal Banner/Flag (Star on central keep) - Rotational Symmetry Learning
  { id: 'royal-banner', type: 'star', position: { x: 50, y: 20 }, filled: false, showSymmetry: false },
  
  // Castle Gate (Heart-shaped entrance) - Mirroring Concept
  { id: 'castle-gate', type: 'heart', position: { x: 50, y: 55 }, filled: false, showSymmetry: false },
  
  // Entrance Bridge (Rectangle) - Completing the castle approach
  { id: 'entrance-bridge', type: 'rectangle', position: { x: 50, y: 70 }, filled: false, showSymmetry: false },
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

      // Generate comparison task
      const comparisonQuestion = shouldShowComparison ? generateComparisonTask() : undefined;

      return {
        ...prev,
        slots: updatedSlots,
        completedSlots: newCompletedSlots,
        currentTask: shouldShowComparison ? 'comparison' : 'building',
        comparisonQuestion,
      };
    });
  }, []);

  const handleComparisonComplete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTask: 'building',
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
