
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
  const [showError, setShowError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (slot.filled) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && slot.filled) {
      const container = e.currentTarget.closest('.relative');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;
        
        // Update position through parent component
        // This would need to be implemented in the parent
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Only render if active, filled, or locked
  if (!slot.active && !slot.filled && !slot.locked) return null;

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

  // Filled or locked: show the shape (now draggable)
  if (slot.filled || slot.locked) {
    return (
      <div
        className={`absolute cursor-move ${isDragging ? 'z-50' : ''}`}
        style={{ 
          left: `${slot.position.x}px`, 
          top: `${slot.position.y}px`,
          transform: 'translate(-50%, -50%)',
          width: `${slotSize.width}px`,
          height: `${slotSize.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={`relative ${isTransforming ? 'animate-transform-to-3d' : ''} ${isDragging ? 'opacity-70' : ''}`} 
             style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px` }}>
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
        {/* Shape hint */}
        <div className="opacity-30">
          <DraggableShape type={slot.type} size={slot.size || 'medium'} isDropped={true} />
        </div>
        {/* Floating prompt */}
        {slot.active && (
          <div className="absolute left-1/2 top-[-2.5rem] -translate-x-1/2 px-4 py-2 bg-cyan-400/80 text-cyan-900 font-bold rounded-xl border border-cyan-300 text-lg shadow-lg pointer-events-none animate-float-prompt">
            {promptMap[slot.type]}
          </div>
        )}
      </div>
    </div>
  );
};
