import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableShape } from './DraggableShape';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface BlueprintCastleSlotProps {
  slot: CastleSlotType;
  onShapeDrop: (slotId: string, shapeType: ShapeType) => void;
  onRemove?: (shapeId: string) => void;
  onMove?: (shapeId: string, newPosition: { x: number; y: number }) => void;
  onRotate?: (shapeId: string) => void;
  hasError?: boolean;
  isExploreMode?: boolean;
}

export const BlueprintCastleSlot: React.FC<BlueprintCastleSlotProps> = ({ 
  slot, 
  onShapeDrop, 
  onRemove,
  onMove,
  onRotate,
  hasError,
  isExploreMode = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  // Clean up dragging state when component unmounts or dragging should stop
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !onMove) return;
      
      const container = document.querySelector('.relative');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragOffset.x;
      const newY = e.clientY - containerRect.top - dragOffset.y;
      
      onMove(slot.id, { x: newX, y: newY });
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, onMove, slot.id, dragOffset]);

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

  const handleShapeDragStart = (e: React.DragEvent) => {
    // Prevent dragging of blueprint shapes (non-explore mode)
    if (!isExploreMode || !slot.isExploreMode) {
      e.preventDefault();
      return;
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(slot.id);
    }
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRotate) {
      onRotate(slot.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExploreMode || !slot.isExploreMode || !onMove) return;
    
    // Check if the click is on a control button
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return; // Don't start dragging if clicking a button
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // In explore mode, show all shapes with interactive controls
  if (isExploreMode && slot.isExploreMode) {
    const sizeMap = {
      large: { width: 80, height: 80 },
      medium: { width: 32, height: 96 },
      small: { width: 20, height: 32 },
    };
    const slotSize = sizeMap[slot.size || 'medium'];

    return (
      <div
        className={`absolute group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          left: `${slot.position.x}px`, 
          top: `${slot.position.y}px`,
          transform: 'translate(-50%, -50%)',
          width: `${slotSize.width}px`,
          height: `${slotSize.height}px`,
          zIndex: isDragging ? 1000 : 1,
        }}
        onMouseDown={handleMouseDown}
      >
        <div 
          style={{ 
            width: `${slotSize.width}px`, 
            height: `${slotSize.height}px`,
            transform: `rotate(${slot.rotation || 0}deg)`,
            pointerEvents: isDragging ? 'none' : 'auto'
          }}
          onDragStart={handleShapeDragStart}
        >
          <DraggableShape 
            type={slot.type}
            size={slot.size || 'medium'}
            is3D={true}
            isDropped={true}
          />
        </div>
        {/* Control buttons - only show on hover and not when dragging */}
        {!isDragging && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
             <button
              onClick={handleRotate}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold hover:bg-blue-600 z-10 flex items-center justify-center"
               title={t('ui.rotate_shape')}
            >
              ↻
            </button>
            <button
              onClick={handleRemove}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 z-10 flex items-center justify-center"
               title={t('ui.remove_shape')}
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }

  // Only render blueprint slots if not in explore mode and not an explore shape
  if (isExploreMode || (!slot.active && !slot.filled && !slot.locked)) return null;

  const promptMap: Record<string, string> = {
    square: t('ui.add_shape.square'),
    rectangle: t('ui.add_shape.rectangle'),
    triangle: t('ui.add_shape.triangle'),
    circle: t('ui.add_shape.circle'),
    pentagon: t('ui.add_shape.pentagon'),
    hexagon: t('ui.add_shape.hexagon'),
  };

  const sizeMap = {
    large: { width: 80, height: 80 },
    medium: { width: 32, height: 96 },
    small: { width: 20, height: 32 },
  };
  const slotSize = sizeMap[slot.size || 'medium'];

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
        <div 
          className={`relative ${isTransforming ? 'animate-transform-to-3d' : ''}`} 
          style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px` }}
          onDragStart={handleShapeDragStart}
        >
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
