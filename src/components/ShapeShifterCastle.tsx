import React, { useState, useCallback } from 'react';
import { MagicalShapePalette } from './MagicalShapePalette';
import { EnchantedCastleInterface } from './EnchantedCastleInterface';
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
  // Main Castle Gate Roof Triangles (Symmetrical)
  { id: 'gate-roof-left', type: 'triangle', position: { x: 35, y: 25 }, filled: false, showSymmetry: false },
  { id: 'gate-roof-right', type: 'triangle', position: { x: 65, y: 25 }, filled: false, showSymmetry: false },
  
  // Central Castle Dome
  { id: 'main-dome', type: 'circle', position: { x: 50, y: 30 }, filled: false, showSymmetry: false },
  
  // Tower Orb Foundations (Symmetrical Pillars)
  { id: 'pillar-orb-left', type: 'circle', position: { x: 20, y: 20 }, filled: false, showSymmetry: false },
  { id: 'pillar-orb-right', type: 'circle', position: { x: 80, y: 20 }, filled: false, showSymmetry: false },
  
  // Castle Windows (Symmetrical)
  { id: 'window-left', type: 'square', position: { x: 30, y: 50 }, filled: false, showSymmetry: false },
  { id: 'window-right', type: 'square', position: { x: 70, y: 50 }, filled: false, showSymmetry: false },
  
  // Main Gate/Door
  { id: 'main-gate', type: 'rectangle', position: { x: 50, y: 65 }, filled: false, showSymmetry: false },
  
  // Magical Castle Crest
  { id: 'castle-crest', type: 'star', position: { x: 50, y: 15 }, filled: false, showSymmetry: false },
  
  // Decorative Heart Gate Elements
  { id: 'heart-decoration', type: 'heart', position: { x: 50, y: 45 }, filled: false, showSymmetry: false },
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
      {/* Gentle background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-3 h-3 bg-primary rounded-full animate-gentle-float" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-2 h-2 bg-secondary rounded-full animate-gentle-float" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-accent rounded-full animate-gentle-float" 
             style={{ animationDelay: '2s' }} />
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
          <EnchantedCastleInterface
            slots={gameState.slots}
            onShapePlaced={handleShapePlaced}
          />
        )}
      </div>

      {/* Magical Shape Palette */}
      {gameState.currentTask === 'building' && (
        <MagicalShapePalette className="mx-6 mb-6" />
      )}
    </div>
  );
};