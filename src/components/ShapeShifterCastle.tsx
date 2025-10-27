
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShapePalette } from './ShapePalette';
import { CastleInterface } from './CastleInterface';
import { ComparisonTask } from './ComparisonTask';
import { ProgressBar } from './ProgressBar';
import { BlueprintSelector } from './BlueprintSelector';
import { tutorService } from '../services/tutorService';
import { blueprints, type BlueprintType } from '../data/blueprints';
import type { BlueprintType as BlueprintSelectorType } from './BlueprintSelector';

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
  colorIndex?: number;
  color?: string;
  drawOrder: number;
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

export const ShapeShifterCastle: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentBlueprint, setCurrentBlueprint] = useState<BlueprintType>('castle');
  const [filledSlots, setFilledSlots] = useState<{ [id: string]: boolean }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showBlueprintSelector, setShowBlueprintSelector] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [shapeColors, setShapeColors] = useState<{ [id: string]: string }>({});

  const blueprintSequence = blueprints[currentBlueprint];
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
    currentBlueprint,
    showBlueprintSelector
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
    if (showBlueprintSelector) return;
    
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
          const blueprintName = t(`blueprints.${currentBlueprint}.title`);
          tutorService.sendSuccessMessage(t, 'tutor.blueprint_complete', { blueprintName });
          // Don't show selector immediately - let them view 3D first
        }, 1000);
      }
    }
  };

  const handleShapeClick = (shapeType: ShapeType) => {
    if (showBlueprintSelector) return;
    
    const expected = blueprintSequence[currentStep];
    if (shapeType === expected.type) {
      handleShapePlaced(expected.id, shapeType);
    }
  };

  const handleBlueprintSelect = (blueprintType: BlueprintSelectorType) => {
    setCurrentBlueprint(blueprintType as BlueprintType);
    setFilledSlots({});
    setCurrentStep(0);
    setShowBlueprintSelector(false);
  };

  const handleExploreClick = () => {
    // When they click Explore Shapes after completion, show blueprint selector
    setShowBlueprintSelector(true);
  };

  const handleColorChange = useCallback((slotId: string, color: string) => {
    setShapeColors(prev => ({ ...prev, [slotId]: color }));
  }, []);

  // Prepare slots for rendering with color indices based on shape type occurrence
  const slots: CastleSlot[] = blueprintSequence.map((slot, idx) => {
    // Count how many shapes of the same type have been placed before this one
    const sameTypeBefore = blueprintSequence
      .slice(0, idx)
      .filter(s => s.type === slot.type).length;
    
    return {
      ...slot,
      filled: !!filledSlots[slot.id],
      active: idx === currentStep && !showBlueprintSelector,
      locked: idx < currentStep,
      showSymmetry: false,
      colorIndex: sameTypeBefore,
      color: shapeColors[slot.id],
      drawOrder: slot.drawOrder,
    };
  });

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
      {!showBlueprintSelector && (
        <ProgressBar
          completed={currentStep}
          total={blueprintSequence.length}
          className="mx-2 mt-2 mb-1 md:mx-4 md:mt-4 md:mb-2 lg:mx-6 lg:mt-6 lg:mb-4"
        />
      )}

      {/* Main Game Area - responsive padding */}
      <div className="flex-1 flex flex-col px-2 md:px-4 lg:px-6">
        {showBlueprintSelector ? (
          <BlueprintSelector onSelect={handleBlueprintSelect} />
        ) : (
          <CastleInterface
            slots={slots}
            onShapePlaced={handleShapePlaced}
            onExploreShapePlaced={() => {}}
            onExploreShapeRemoved={() => {}}
            onExploreShapeMoved={() => {}}
            onExploreShapeRotated={() => {}}
            onColorChange={handleColorChange}
            isExploreMode={false}
            isCompleted={isCompleted}
            onStartExplore={handleExploreClick}
          />
        )}
      </div>

      {/* Shape Palette - responsive positioning and spacing */}
      {!showBlueprintSelector && (
        <ShapePalette 
          className="mx-2 mb-2 md:mx-4 md:mb-4 lg:mx-6 lg:mb-6"
          activeShapeType={currentStep < blueprintSequence.length ? blueprintSequence[currentStep].type : null}
          onShapeClick={handleShapeClick}
        />
      )}
    </div>
  );
};
