
import React, { useState } from 'react';
import { DraggableShape } from './DraggableShape';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface BlueprintCastleSlotProps {
  slot: CastleSlotType;
  onShapeDrop: (slotId: string, shapeType: ShapeType) => void;
  onRemove?: (shapeId: string) => void;
  hasError?: boolean;
  isExploreMode?: boolean;
}

export const BlueprintCastleSlot: React.FC<BlueprintCastleSlotProps> = ({ 
  slot, 
  onShapeDrop, 
  onRemove,
  hasError,
  isExploreMode = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (isExploreMode && slot.isExploreMode) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isExploreMode && slot.isExploreMode) return;
    
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (slot.active && data.type === slot.type) {
        setIsTransforming(true);
        setTimeout(() => setIsTransforming(false), 800);
        onShapeDrop(slot.id, data.type);
      } else if (slot.active) {
        setShowError(true);
        setTimeout(() => setShowError(false), 600);
      }
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 600);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(slot.id);
    }
  };

  // In explore mode, show all shapes with remove button
  if (isExploreMode && slot.isExploreMode) {
    const sizeMap = {
      large: { width: 80, height: 80 },
      medium: { width: 32, height: 96 },
      small: { width: 20, height: 32 },
    };
    const slotSize = sizeMap[slot.size || 'medium'];

    return (
      <div
        className="absolute group"
        style={{ 
          left: `${slot.position.x}px`, 
          top: `${slot.position.y}px`,
          transform: 'translate(-50%, -50%)',
          width: `${slotSize.width}px`,
          height: `${slotSize.height}px`,
        }}
      >
        <div style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px` }}>
          <DraggableShape 
            type={slot.type}
            size={slot.size || 'medium'}
            is3D={true}
            isDropped={true}
          />
        </div>
        {/* Remove button - only show on hover */}
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600 z-10"
          title="Remove shape"
        >
          ×
        </button>
      </div>
    );
  }

  // Only render blueprint slots if not in explore mode and not an explore shape
  if (isExploreMode || (!slot.active && !slot.filled && !slot.locked)) return null;

  // Prompt text for each shape type
  const promptMap: Record<string, string> = {
    square: 'Add Square',
    rectangle: 'Add Rectangle',
    triangle: 'Add Triangle',
    circle: 'Add Circle',
    pentagon: 'Add Pentagon',
    hexagon: 'Add Hexagon',
  };

  // Size mapping for slot containers
  const sizeMap = {
    large: { width: 80, height: 80 },
    medium: { width: 32, height: 96 },
    small: { width: 20, height: 32 },
  };
  const slotSize = sizeMap[slot.size || 'medium'];

  // Filled or locked: show the shape
  if (slot.filled || slot.locked) {
    return (
      <div
        className="absolute"
        style={{ 
          left: `${slot.position.x}px`, 
          top: `${slot.position.y}px`,
          transform: 'translate(-50%, -50%)',
          width: `${slotSize.width}px`,
          height: `${slotSize.height}px`,
        }}
      >
        <div className={`relative ${isTransforming ? 'animate-transform-to-3d' : ''}`} style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px` }}>
          <DraggableShape 
            type={slot.type}
            size={slot.size || 'medium'}
            is3D={true}
            isDropped={true}
          />
        </div>
      </div>
    );
  }

  // Active slot: show glowing outline and prompt
  return (
    <div
      className="absolute"
      style={{ 
        left: `${slot.position.x}px`, 
        top: `${slot.position.y}px`,
        transform: 'translate(-50%, -50%)',
        width: `${slotSize.width}px`,
        height: `${slotSize.height}px`,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`border-4 rounded-lg flex items-center justify-center relative transition-all duration-300 min-w-0 min-h-0
          ${showError ? 'border-red-400 bg-red-200/20 animate-subtle-shake' : isDragOver ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-blueprint-pulse' : 'border-cyan-300/80 bg-transparent shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-blueprint-pulse'}
        `}
        style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px`, boxShadow: slot.active ? '0 0 16px 4px #22d3ee' : undefined }}
      >
        <div className="opacity-30">
          <DraggableShape type={slot.type} size={slot.size || 'medium'} isDropped={true} />
        </div>
        {slot.active && (
          <div className="absolute left-1/2 top-[-2.5rem] -translate-x-1/2 px-4 py-2 bg-cyan-400/80 text-cyan-900 font-bold rounded-xl border border-cyan-300 text-lg shadow-lg pointer-events-none animate-float-prompt">
            {promptMap[slot.type]}
          </div>
        )}
      </div>
    </div>
  );
};
