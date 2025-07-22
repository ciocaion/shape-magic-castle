import React, { useState } from 'react';
import { DraggableShape } from './DraggableShape';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface BlueprintCastleSlotProps {
  slot: CastleSlotType;
  onShapeDrop: (slotId: string, shapeType: ShapeType) => void;
  hasError?: boolean;
}

export const BlueprintCastleSlot: React.FC<BlueprintCastleSlotProps> = ({ 
  slot, 
  onShapeDrop, 
  hasError 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

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
      
      // Trigger transformation animation
      setIsTransforming(true);
      setTimeout(() => setIsTransforming(false), 1500);
      
      onShapeDrop(slot.id, data.type);
    } catch (error) {
      console.error('Failed to parse drop data:', error);
    }
  };

  const getWOWTransformation = () => {
    if (!slot.filled) return null;

    const transformationClass = getTransformationClass(slot.type);
    
    return (
      <div className={`relative ${transformationClass}`}>
        <DraggableShape 
          type={slot.type} 
          size="medium" 
          is3D={true}
        />
        
        {/* Symmetry Line Reveals */}
        {slot.showSymmetry && (
          <div className="absolute inset-0 pointer-events-none">
            {slot.type === 'triangle' && (
              <>
                {/* Bilateral symmetry line for pyramid */}
                <div className="absolute top-0 left-1/2 bottom-0 w-0.5 bg-cyan-300 opacity-70 animate-symmetry-line-appear transform -translate-x-0.5" />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-300 opacity-50 animate-symmetry-line-appear transform -translate-y-0.5" />
              </>
            )}
            
            {slot.type === 'star' && (
              <>
                {/* Rotational symmetry lines for star */}
                {[0, 72, 144, 216, 288].map((angle, index) => (
                  <div
                    key={angle}
                    className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-yellow-300 opacity-60 animate-symmetry-line-appear origin-bottom"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                ))}
              </>
            )}
            
            {slot.type === 'heart' && (
              <>
                {/* Mirror line for heart */}
                <div className="absolute top-0 left-1/2 bottom-0 w-0.5 bg-pink-300 opacity-70 animate-symmetry-line-appear transform -translate-x-0.5" />
                {/* Mirrored heart appears */}
                <div className="absolute -right-8 top-0 opacity-60 animate-heart-mirror-reveal">
                  <DraggableShape type="heart" size="medium" />
                </div>
              </>
            )}
            
            {slot.type === 'circle' && (
              <>
                {/* Sphere symmetry indicators */}
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-blue-300 rounded-full opacity-50 animate-symmetry-line-appear" />
                <div className="absolute top-1/3 left-1/3 right-1/3 bottom-1/3 border border-blue-200 rounded-full opacity-30 animate-symmetry-line-appear" style={{ animationDelay: '0.2s' }} />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const getTransformationClass = (shapeType: ShapeType) => {
    switch (shapeType) {
      case 'triangle':
        return 'animate-triangle-to-pyramid';
      case 'circle':
        return 'animate-circle-to-sphere';
      case 'star':
        return 'animate-star-symmetry-reveal';
      case 'heart':
        return 'animate-heart-mirror-reveal';
      default:
        return 'animate-gentle-bounce';
    }
  };

  const getSlotContent = () => {
    if (slot.filled) {
      return getWOWTransformation();
    }

    // Blueprint-style empty slot with glowing outline
    return (
      <div className={`
        w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center
        transition-all duration-300 min-w-[44px] min-h-[44px]
        ${isDragOver 
          ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-blueprint-pulse' 
          : 'border-cyan-300/60 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
        }
        ${hasError ? 'border-error bg-error/10 animate-subtle-shake' : ''}
      `}>
        {/* Blueprint-style shape hint */}
        <div className="opacity-40">
          <DraggableShape type={slot.type} size="medium" />
        </div>
        
        {/* Blueprint corner markers */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-cyan-300" />
        <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-cyan-300" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-cyan-300" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-cyan-300" />
      </div>
    );
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
    >
      {getSlotContent()}
    </div>
  );
};