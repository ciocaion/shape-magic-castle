import React, { useState } from 'react';
import { DraggableShape } from './DraggableShape';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface CastleSlotProps {
  slot: CastleSlotType;
  onShapeDrop: (slotId: string, shapeType: ShapeType) => void;
  hasError?: boolean;
}

export const CastleSlot: React.FC<CastleSlotProps> = ({ slot, onShapeDrop, hasError }) => {
  const [isDragOver, setIsDragOver] = useState(false);

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
        <div className="relative animate-bounce-in">
          <DraggableShape 
            type={slot.type} 
            size="medium" 
            is3D={true}
          />
          {slot.showSymmetry && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Symmetry line animation */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary-glow animate-glow-pulse opacity-60" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-glow animate-glow-pulse opacity-60" />
            </div>
          )}
        </div>
      );
    }

    // Empty slot with glowing outline
    return (
      <div className={`
        w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center
        transition-all duration-300
        ${isDragOver ? 'border-success bg-success/20 animate-glow-pulse' : 'border-primary/60 animate-glow-pulse'}
        ${hasError ? 'border-error bg-error/20 animate-shake' : ''}
      `}>
        {/* Shape hint outline */}
        <div className="opacity-30">
          <DraggableShape type={slot.type} size="medium" />
        </div>
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