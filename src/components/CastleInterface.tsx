import React, { useState } from 'react';
import { CastleSlot } from './CastleSlot';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface CastleInterfaceProps {
  slots: CastleSlotType[];
  onShapePlaced: (slotId: string, shapeType: ShapeType) => void;
}

export const CastleInterface: React.FC<CastleInterfaceProps> = ({ slots, onShapePlaced }) => {
  const [dragError, setDragError] = useState<string | null>(null);

  const handleShapeDrop = (slotId: string, shapeType: ShapeType) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    if (slot.type === shapeType && !slot.filled) {
      onShapePlaced(slotId, shapeType);
      setDragError(null);
    } else {
      setDragError(slotId);
      setTimeout(() => setDragError(null), 500);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="relative w-full max-w-4xl h-96 mx-auto">
        {/* Castle Base */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-40 bg-castle-stone rounded-t-3xl shadow-castle" />
        
        {/* Main Tower */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-castle-tower rounded-t-2xl shadow-castle" />
        
        {/* Side Towers */}
        <div className="absolute bottom-0 left-8 w-20 h-32 bg-castle-tower rounded-t-2xl shadow-castle" />
        <div className="absolute bottom-0 right-8 w-20 h-32 bg-castle-tower rounded-t-2xl shadow-castle" />

        {/* Render Castle Slots */}
        {slots.map((slot) => (
          <CastleSlot
            key={slot.id}
            slot={slot}
            onShapeDrop={handleShapeDrop}
            hasError={dragError === slot.id}
          />
        ))}

        {/* Magical sparkles around the castle */}
        <div className="absolute top-4 left-1/4 w-2 h-2 bg-primary-glow rounded-full animate-sparkle" 
             style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-8 right-1/3 w-3 h-3 bg-accent rounded-full animate-sparkle" 
             style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-shape-star rounded-full animate-sparkle" 
             style={{ animationDelay: '2.5s' }} />
      </div>
    </div>
  );
};