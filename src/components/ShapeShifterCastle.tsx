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
  // Castle windows (squares)
  { id: 'window-1', type: 'square', position: { x: 20, y: 40 }, filled: false, showSymmetry: false },
  { id: 'window-2', type: 'square', position: { x: 80, y: 40 }, filled: false, showSymmetry: false },
  // Castle door (rectangle)
  { id: 'door', type: 'rectangle', position: { x: 50, y: 70 }, filled: false, showSymmetry: false },
  // Castle towers (circles)
  { id: 'tower-1', type: 'circle', position: { x: 15, y: 20 }, filled: false, showSymmetry: false },
  { id: 'tower-2', type: 'circle', position: { x: 85, y: 20 }, filled: false, showSymmetry: false },
  // Castle roofs (triangles)
  { id: 'roof-1', type: 'triangle', position: { x: 15, y: 10 }, filled: false, showSymmetry: false },
  { id: 'roof-2', type: 'triangle', position: { x: 50, y: 5 }, filled: false, showSymmetry: false },
  { id: 'roof-3', type: 'triangle', position: { x: 85, y: 10 }, filled: false, showSymmetry: false },
  // Decorative elements
  { id: 'star-1', type: 'star', position: { x: 30, y: 15 }, filled: false, showSymmetry: false },
  { id: 'heart-1', type: 'heart', position: { x: 70, y: 15 }, filled: false, showSymmetry: false },
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
    <div className="min-h-screen bg-gradient-castle flex flex-col relative overflow-hidden">
      {/* Background magical elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 bg-primary rounded-full animate-sparkle" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-3 h-3 bg-shape-star rounded-full animate-sparkle" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-shape-heart rounded-full animate-sparkle" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Progress Bar */}
      <ProgressBar
        completed={gameState.completedSlots}
        total={gameState.totalSlots}
        className="m-4"
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
        <ShapePalette className="mx-4 mb-4" />
      )}
    </div>
  );
};