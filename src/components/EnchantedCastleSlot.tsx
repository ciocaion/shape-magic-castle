import React, { useState, useEffect } from 'react';
import { WOWTransformationShape } from './WOWTransformationShape';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface EnchantedCastleSlotProps {
  slot: CastleSlotType;
  onShapeDrop: (slotId: string, shapeType: ShapeType) => void;
  hasError?: boolean;
  isActive?: boolean;
  hasCelebration?: boolean;
}

export const EnchantedCastleSlot: React.FC<EnchantedCastleSlotProps> = ({ 
  slot, 
  onShapeDrop, 
  hasError, 
  isActive,
  hasCelebration 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [showSymmetryReveal, setShowSymmetryReveal] = useState(false);

  useEffect(() => {
    if (slot.filled && !showSymmetryReveal) {
      // Trigger transformation sequence
      setIsTransforming(true);
      
      // After transformation, show symmetry reveal
      setTimeout(() => {
        setIsTransforming(false);
        setShowSymmetryReveal(true);
      }, 800);
    }
  }, [slot.filled, showSymmetryReveal]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      onShapeDrop(slot.id, data.type);
    } catch (error) {
      console.error('Failed to parse drop data:', error);
    }
  };

  const getSlotContent = () => {
    if (slot.filled) {
      return (
        <div className="relative">
          <WOWTransformationShape 
            type={slot.type} 
            size="medium" 
            isTransforming={isTransforming}
            showSymmetry={showSymmetryReveal}
          />
          
          {/* Particle burst for celebration */}
          {hasCelebration && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full animate-gentle-bounce"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Empty slot with magical glowing outline
    return (
      <div className={`
        w-20 h-20 border-2 border-dashed rounded-xl flex items-center justify-center
        transition-all duration-500 min-w-[44px] min-h-[44px] relative
        ${isActive ? 'border-primary bg-primary/10 animate-soft-glow shadow-gentle scale-110' : 'border-primary/30'}
        ${isDragOver ? 'border-success bg-success/20 animate-soft-glow scale-105' : ''}
        ${hasError ? 'border-error bg-error/20 animate-subtle-shake' : ''}
      `}>
        {/* Magic Circle Background for Active Slot */}
        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 animate-gentle-float" />
        )}
        
        {/* Shape hint outline */}
        <div className="relative opacity-40 z-10">
          <WOWTransformationShape type={slot.type} size="medium" />
        </div>

        {/* Magical Particles around Active Slot */}
        {isActive && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary/60 rounded-full animate-gentle-float" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary/60 rounded-full animate-gentle-float" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-accent/60 rounded-full animate-gentle-float" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary/60 rounded-full animate-gentle-float" style={{ animationDelay: '1.5s' }} />
          </>
        )}

        {/* Wrong Shape "No" Animation */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-1 bg-error rounded-full transform rotate-45 animate-subtle-shake" />
            <div className="w-8 h-1 bg-error rounded-full transform -rotate-45 animate-subtle-shake absolute" />
          </div>
        )}
      </div>
    );
  };

  // Different slot positions for different castle elements
  const getSlotDescription = () => {
    switch (slot.id) {
      case 'gate-roof-left':
      case 'gate-roof-right':
        return 'Magical Gate Roof';
      case 'main-dome':
        return 'Castle Central Dome';
      case 'pillar-orb-left':
      case 'pillar-orb-right':
        return 'Magical Orb Pillar';
      case 'window-left':
      case 'window-right':
        return 'Enchanted Window';
      case 'main-gate':
        return 'Castle Main Gate';
      case 'castle-crest':
        return 'Royal Castle Crest';
      case 'heart-decoration':
        return 'Magical Heart Portal';
      default:
        return 'Castle Element';
    }
  };

  return (
    <div
      className="absolute"
      style={{ 
        left: `${slot.position.x}%`, 
        top: `${slot.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={getSlotDescription()}
    >
      {getSlotContent()}
    </div>
  );
};