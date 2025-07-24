import React, { useState, useEffect } from 'react';
import { BlueprintCastleSlot } from './BlueprintCastleSlot';
import { ThreeDCastleScene } from './ThreeDCastleScene';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface CastleInterfaceProps {
  slots: CastleSlotType[];
  onShapePlaced: (slotId: string, shapeType: ShapeType) => void;
  onExploreShapePlaced?: (position: { x: number; y: number }, shapeType: ShapeType) => void;
  onExploreShapeRemoved?: (shapeId: string) => void;
  isExploreMode?: boolean;
  isCompleted?: boolean;
  onStartExplore?: () => void;
}

export const CastleInterface: React.FC<CastleInterfaceProps> = ({ 
  slots, 
  onShapePlaced, 
  onExploreShapePlaced,
  onExploreShapeRemoved,
  isExploreMode = false,
  isCompleted = false,
  onStartExplore
}) => {
  const [dragError, setDragError] = useState<string | null>(null);
  const [view3D, setView3D] = useState(false);

  // Reset to blueprint view when entering explore mode
  useEffect(() => {
    if (isExploreMode) {
      setView3D(false);
    }
  }, [isExploreMode]);

  // Calculate if all slots are completed
  const blueprintSlots = slots.filter(slot => !slot.isExploreMode);
  const allSlotsCompleted = blueprintSlots.every(slot => slot.filled);
  const filledCount = blueprintSlots.filter(slot => slot.filled).length;
  
  console.log('CastleInterface render:', { 
    allSlotsCompleted, 
    filledCount, 
    totalSlots: blueprintSlots.length,
    view3D,
    isExploreMode,
    slotsStatus: slots.map(s => ({ id: s.id, filled: s.filled, type: s.type, isExploreMode: s.isExploreMode }))
  });

  const handleShapeDrop = (slotId: string, shapeType: ShapeType) => {
    if (isExploreMode) return;
    
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

  const handleCanvasDrop = (e: React.DragEvent) => {
    if (!isExploreMode || !onExploreShapePlaced) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      onExploreShapePlaced({ x, y }, data.type);
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    if (isExploreMode) {
      e.preventDefault();
    }
  };

  const handleExploreShapeRemove = (shapeId: string) => {
    if (onExploreShapeRemoved) {
      onExploreShapeRemoved(shapeId);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* View Toggle with Explore Mode - all in same line */}
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
          3D View ({filledCount}/{blueprintSlots.length})
        </button>
        
        {/* Explore Mode Button - in same line, green color */}
        {isCompleted && !isExploreMode && (
          <button
            onClick={onStartExplore}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            Explore Shapes
          </button>
        )}
      </div>
      
      <div 
        className="relative w-full max-w-4xl aspect-video bg-slate-800/90 backdrop-blur-sm rounded-gradeaid shadow-gentle border-2 border-cyan-400/30 overflow-hidden"
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
      >
        {view3D ? (
          /* 3D Scene View */
          <div className="relative w-full h-full">
            <ThreeDCastleScene slots={slots} />
            <div className="absolute top-4 left-4 px-4 py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-sm tracking-wider">
                3D CASTLE VIEW
              </span>
            </div>
          </div>
        ) : (
          /* Blueprint View */
          <>
            {/* Blueprint Construction Grid */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '30px 30px'
              }}
            />
            <div className="absolute top-4 left-4 px-4 py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-sm tracking-wider">
                {isExploreMode ? 'EXPLORE MODE - DROP SHAPES ANYWHERE' : 'CASTLE CONSTRUCTION BLUEPRINT'}
              </span>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-400/10 rounded border border-cyan-400/30">
              <span className="text-cyan-400 font-mono text-xs">REV 001</span>
            </div>
            
            {/* Render Blueprint Castle Slots */}
            {slots.map((slot) => (
              <BlueprintCastleSlot
                key={slot.id}
                slot={slot}
                onShapeDrop={handleShapeDrop}
                onRemove={slot.isExploreMode ? handleExploreShapeRemove : undefined}
                hasError={dragError === slot.id}
                isExploreMode={isExploreMode}
              />
            ))}
            
            {/* Blueprint measurement lines - only show in blueprint mode */}
            {!isExploreMode && (
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400" />
                <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400" />
                <div className="absolute left-1/4 top-0 bottom-0 w-px bg-cyan-400" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400" />
                <div className="absolute left-3/4 top-0 bottom-0 w-px bg-cyan-400" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
