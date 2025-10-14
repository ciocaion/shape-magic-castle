import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  hasError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [showError, setShowError] = useState(false);
  const { t } = useTranslation();

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

  const handleShapeDragStart = (e: React.DragEvent) => {
    // Prevent dragging of blueprint shapes
    e.preventDefault();
    return;
  };

  // Only render active, filled, or locked slots
  if (!slot.active && !slot.filled && !slot.locked) return null;

  const promptMap: Record<string, string> = {
    square: t('ui.add_shape.square'),
    rectangle: t('ui.add_shape.rectangle'),
    triangle: t('ui.add_shape.triangle'),
    circle: t('ui.add_shape.circle'),
    pentagon: t('ui.add_shape.pentagon'),
    hexagon: t('ui.add_shape.hexagon'),
  };

  const slotSize = (() => {
    const s = slot.size || 'medium';
    const isRect = slot.type === 'rectangle';
    if (s === 'small') return isRect ? { width: 16, height: 64 } : { width: 32, height: 32 };
    if (s === 'medium') return isRect ? { width: 32, height: 96 } : { width: 48, height: 48 };
    return { width: 80, height: 80 };
  })();

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
      {slot.type === 'triangle' ? (
        
        		<div
          className={`relative flex items-center justify-center transition-all duration-300 min-w-0 min-h-0
            ${showError ? 'bg-red-200/20 animate-subtle-shake' : isDragOver ? 'bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-blueprint-pulse' : 'bg-transparent shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-blueprint-pulse'}
          `}
          style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px`, boxShadow: slot.active ? '0 0 16px 4px #22d3ee' : undefined }}
        >
          {/* Triangle outline placeholder (no rectangular border) */}
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 100 86.6"
            preserveAspectRatio="none"
          >
            <polygon
              points="50,0 100,86.6 0,86.6"
              fill={isDragOver ? 'rgba(34,211,238,0.2)' : 'transparent'}
              stroke="#22d3ee"
              strokeWidth="4"
            />
          </svg>
          <div className="opacity-30">
            <DraggableShape type={slot.type} size={slot.size || 'medium'} isDropped={true} />
          </div>
          {slot.active && (
            <div className="absolute left-1/2 top-[-4rem] -translate-x-1/2 px-4 py-2 bg-cyan-400/80 text-cyan-900 font-bold rounded-xl border border-cyan-300 text-lg shadow-lg pointer-events-none animate-float-prompt">
              {promptMap[slot.type]}
            </div>
          )}
        </div>
      ) : slot.type === 'circle' ? (
        <div
          className={`relative flex items-center justify-center transition-all duration-300 min-w-0 min-h-0
            ${showError ? 'bg-red-200/20 animate-subtle-shake' : isDragOver ? 'bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-blueprint-pulse' : 'bg-transparent shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-blueprint-pulse'}
          `}
          style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px`, boxShadow: slot.active ? '0 0 16px 4px #22d3ee' : undefined }}
        >
          {/* Circle outline placeholder (no rectangular border) */}
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill={isDragOver ? 'rgba(34,211,238,0.2)' : 'transparent'}
              stroke="#22d3ee"
              strokeWidth="4"
            />
          </svg>
          <div className="opacity-30">
            <DraggableShape type={slot.type} size={slot.size || 'medium'} isDropped={true} />
          </div>
          {slot.active && (
            <div className="absolute left-1/2 top-[-4rem] -translate-x-1/2 px-4 py-2 bg-cyan-400/80 text-cyan-900 font-bold rounded-xl border border-cyan-300 text-lg shadow-lg pointer-events-none animate-float-prompt">
              {promptMap[slot.type]}
            </div>
          )}
        </div>
      ) : slot.type === 'pentagon' ? (
        <div
          className={`relative flex items-center justify-center transition-all duration-300 min-w-0 min-h-0
            ${showError ? 'bg-red-200/20 animate-subtle-shake' : isDragOver ? 'bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-blueprint-pulse' : 'bg-transparent shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-blueprint-pulse'}
          `}
          style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px`, boxShadow: slot.active ? '0 0 16px 4px #22d3ee' : undefined }}
        >
          {/* Pentagon outline placeholder (no rectangular border) */}
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="50,5 95,38 77,90 23,90 5,38"
              fill={isDragOver ? 'rgba(34,211,238,0.2)' : 'transparent'}
              stroke="#22d3ee"
              strokeWidth="4"
            />
          </svg>
          <div className="opacity-30">
            <DraggableShape type={slot.type} size={slot.size || 'medium'} isDropped={true} />
          </div>
          {slot.active && (
            <div className="absolute left-1/2 top-[-4rem] -translate-x-1/2 px-4 py-2 bg-cyan-400/80 text-cyan-900 font-bold rounded-xl border border-cyan-300 text-lg shadow-lg pointer-events-none animate-float-prompt">
              {promptMap[slot.type]}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-4 flex items-center justify-center relative transition-all duration-300 min-w-0 min-h-0
            ${showError ? 'border-red-400 bg-red-200/20 animate-subtle-shake' : isDragOver ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-blueprint-pulse' : 'border-cyan-300/80 bg-transparent shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-blueprint-pulse'}
          `}
          style={{ width: `${slotSize.width}px`, height: `${slotSize.height}px`, boxShadow: slot.active ? '0 0 16px 4px #22d3ee' : undefined }}
        >
          <div className="opacity-30">
            <DraggableShape type={slot.type} size={slot.size || 'medium'} isDropped={true} />
          </div>
          {slot.active && (
            <div className="absolute left-1/2 top-[-4rem] -translate-x-1/2 px-4 py-2 bg-cyan-400/80 text-cyan-900 font-bold rounded-xl border border-cyan-300 text-lg shadow-lg pointer-events-none animate-float-prompt">
              {promptMap[slot.type]}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
