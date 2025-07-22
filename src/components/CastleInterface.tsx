
import React, { useState, useEffect } from 'react';
import { BlueprintCastleSlot } from './BlueprintCastleSlot';
import { ThreeDCastleScene } from './ThreeDCastleScene';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface CastleInterfaceProps {
  slots: CastleSlotType[];
  onShapePlaced: (slotId: string, shapeType: ShapeType) => void;
}

export const CastleInterface: React.FC<CastleInterfaceProps> = ({ slots, onShapePlaced }) => {
  const [dragError, setDragError] = useState<string | null>(null);
  const [view3D, setView3D] = useState(false);

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

  // Force 3D view when all slots are completed
  useEffect(() => {
    console.log('Effect running - checking completion:', { 
      allSlotsCompleted, 
      view3D, 
      filledCount, 
      totalSlots: slots.length
    });
    
    if (allSlotsCompleted) {
      console.log('All slots completed! Forcing 3D view...');
      if (!view3D) {
        // Add a small delay to ensure the last shape animation completes
        setTimeout(() => {
          console.log('Setting view3D to true NOW');
          setView3D(true);
        }, 500);
      }
    }
  }, [allSlotsCompleted, filledCount, view3D]);

  // Force 3D view immediately if all slots are already completed on mount
  useEffect(() => {
    if (allSlotsCompleted && !view3D) {
      console.log('Mount effect: All slots completed, forcing 3D view');
      setView3D(true);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* View Toggle - Hide when castle is completed to force 3D view */}
      {!allSlotsCompleted && (
        <div className="mb-4 flex gap-2">
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
            disabled={filledCount === 0}
          >
            3D View ({filledCount}/{slots.length})
          </button>
        </div>
      )}

      {/* Show completion message above when all done */}
      {allSlotsCompleted && (
        <div className="mb-4 px-6 py-3 bg-green-500/20 rounded-lg border border-green-400/40">
          <span className="text-green-300 font-mono text-xl tracking-wider">🎉 CASTLE COMPLETED! 🎉</span>
        </div>
      )}

      <div className="relative w-full max-w-4xl aspect-video bg-slate-800/90 backdrop-blur-sm rounded-gradeaid shadow-gentle border-2 border-cyan-400/30 overflow-hidden">
        {/* Always show 3D view when completed, regardless of view3D state */}
        {(allSlotsCompleted || view3D) ? (
          /* 3D Scene View - Force this view when completed */
          <div className="absolute inset-0">
            <ThreeDCastleScene slots={slots} />
            {/* 3D View Overlay */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-sm tracking-wider">
                {allSlotsCompleted ? 'COMPLETED CASTLE - 3D VIEW' : '3D CASTLE VIEW'}
              </span>
            </div>
            {/* Allow manual return to blueprint only if not completed */}
            {!allSlotsCompleted && (
              <button
                onClick={() => setView3D(false)}
                className="absolute top-4 right-4 px-3 py-1 bg-cyan-400/20 rounded border border-cyan-400/40 text-cyan-300 text-sm hover:bg-cyan-400/30"
              >
                Back to Blueprint
              </button>
            )}
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
            
            {/* Blueprint Title Banner */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-sm tracking-wider">CASTLE CONSTRUCTION BLUEPRINT</span>
            </div>
            
            {/* Blueprint revision marker */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-400/10 rounded border border-cyan-400/30">
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

            {/* Blueprint measurement lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400" />
              <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400" />
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-cyan-400" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400" />
              <div className="absolute left-3/4 top-0 bottom-0 w-px bg-cyan-400" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
