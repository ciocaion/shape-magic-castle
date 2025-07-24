
import React, { useState, useEffect } from 'react';
import { BlueprintCastleSlot } from './BlueprintCastleSlot';
import { ThreeDCastleScene } from './ThreeDCastleScene';
import { Button } from './ui/button';
import { DraggableShape } from './DraggableShape';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface CastleInterfaceProps {
  slots: CastleSlotType[];
  onShapePlaced: (slotId: string, shapeType: ShapeType) => void;
  onBuildAnother?: () => void;
  onShapePositionUpdate?: (slotId: string, position: { x: number; y: number }) => void;
}

export const CastleInterface: React.FC<CastleInterfaceProps> = ({ 
  slots, 
  onShapePlaced, 
  onBuildAnother,
  onShapePositionUpdate
}) => {
  const [dragError, setDragError] = useState<string | null>(null);
  const [view3D, setView3D] = useState(false);
  const [placedShapes, setPlacedShapes] = useState<Array<{
    id: string;
    type: ShapeType;
    position: { x: number; y: number };
    size: 'small' | 'medium' | 'large';
  }>>([]);

  // Calculate if all slots are completed
  const allSlotsCompleted = slots.every(slot => slot.filled);
  const filledCount = slots.filter(slot => slot.filled).length;
  
  console.log('CastleInterface render:', { 
    allSlotsCompleted, 
    filledCount, 
    totalSlots: slots.length,
    view3D,
    slotsStatus: slots.map(s => ({ id: s.id, filled: s.filled, type: s.type }))
  });

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

  const handleBlueprintDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newShape = {
        id: `free-${Date.now()}`,
        type: data.type as ShapeType,
        position: { x, y },
        size: 'medium' as const
      };
      
      setPlacedShapes(prev => [...prev, newShape]);
    } catch (error) {
      console.error('Error placing shape:', error);
    }
  };

  const handleBlueprintDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleBuildAnother = () => {
    if (onBuildAnother) {
      setPlacedShapes([]);
      onBuildAnother();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* View Toggle and Build Another Button */}
      <div className="mb-4 flex gap-2 z-30 relative">
        <button
          onClick={() => setView3D(false)}
          className={`px-4 py-2 rounded-lg transition-all ${
            !view3D 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Blueprint View
        </button>
        <button
          onClick={() => setView3D(true)}
          className={`px-4 py-2 rounded-lg transition-all ${
            view3D 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          3D View ({filledCount}/{slots.length})
        </button>
        {allSlotsCompleted && (
          <Button
            onClick={handleBuildAnother}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Build Another Shape
          </Button>
        )}
      </div>
      <div className="relative w-full max-w-4xl aspect-video bg-slate-800/90 backdrop-blur-sm rounded-gradeaid shadow-gentle border-2 border-cyan-400/30 overflow-hidden">
        {view3D ? (
          /* 3D Scene View */
          <div className="relative w-full h-full">
            <ThreeDCastleScene slots={slots} />
            {/* 3D View Overlay */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-sm tracking-wider">
                3D CASTLE VIEW
              </span>
            </div>
          </div>
        ) : (
          /* Blueprint View */
          <div 
            className="relative w-full h-full"
            onDrop={handleBlueprintDrop}
            onDragOver={handleBlueprintDragOver}
          >
            {/* Blueprint Construction Grid */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '30px 30px'
              }}
            />
            {/* Blueprint Title Banner */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-cyan-400/20 rounded border border-cyan-400/40 z-10">
              <span className="text-cyan-300 font-mono text-sm tracking-wider">CASTLE CONSTRUCTION BLUEPRINT</span>
            </div>
            {/* Blueprint revision marker */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-400/10 rounded border border-cyan-400/30 z-10">
              <span className="text-cyan-400 font-mono text-xs">REV 001</span>
            </div>
            {/* Render Blueprint Castle Slots */}
            {slots.map((slot) => (
              <BlueprintCastleSlot
                key={slot.id}
                slot={slot}
                onShapeDrop={handleShapeDrop}
                hasError={dragError === slot.id}
              />
            ))}
            {/* Render freely placed shapes */}
            {placedShapes.map((shape) => (
              <div
                key={shape.id}
                className="absolute cursor-move"
                style={{
                  left: `${shape.position.x}px`,
                  top: `${shape.position.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <DraggableShape 
                  type={shape.type}
                  size={shape.size}
                  is3D={true}
                  isDropped={true}
                />
              </div>
            ))}
            {/* Blueprint measurement lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400" />
              <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400" />
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-cyan-400" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400" />
              <div className="absolute left-3/4 top-0 bottom-0 w-px bg-cyan-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
