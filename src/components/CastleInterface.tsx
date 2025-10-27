import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BlueprintCastleSlot } from './BlueprintCastleSlot';
import { ThreeDCastleScene } from './ThreeDCastleScene';
import { ColorPicker } from './ColorPicker';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface CastleInterfaceProps {
  slots: CastleSlotType[];
  onShapePlaced: (slotId: string, shapeType: ShapeType) => void;
  onExploreShapePlaced?: (position: { x: number; y: number }, shapeType: ShapeType) => void;
  onExploreShapeRemoved?: (shapeId: string) => void;
  onExploreShapeMoved?: (shapeId: string, newPosition: { x: number; y: number }) => void;
  onExploreShapeRotated?: (shapeId: string) => void;
  onColorChange?: (slotId: string, color: string) => void;
  isExploreMode?: boolean;
  isCompleted?: boolean;
  onStartExplore?: () => void;
}

export const CastleInterface: React.FC<CastleInterfaceProps> = ({ 
  slots, 
  onShapePlaced, 
  onExploreShapePlaced,
  onExploreShapeRemoved,
  onExploreShapeMoved,
  onExploreShapeRotated,
  onColorChange,
  isExploreMode = false,
  isCompleted = false,
  onStartExplore
}) => {
  const [dragError, setDragError] = useState<string | null>(null);
  const [view3D, setView3D] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const { t } = useTranslation();

  // Force reset to blueprint view when entering explore mode
  useEffect(() => {
    if (isExploreMode) {
      setView3D(false);
    }
  }, [isExploreMode]);

  // Calculate if all slots are completed
  const blueprintSlots = slots.filter(slot => !slot.isExploreMode);
  const exploreSlots = slots.filter(slot => slot.isExploreMode);
  const allSlotsCompleted = blueprintSlots.every(slot => slot.filled);
  const filledCount = blueprintSlots.filter(slot => slot.filled).length;
  
  console.log('CastleInterface render:', { 
    allSlotsCompleted, 
    filledCount, 
    totalSlots: blueprintSlots.length,
    view3D,
    isExploreMode,
    exploreSlots: exploreSlots.length,
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

  const handleExploreShapeMove = (shapeId: string, newPosition: { x: number; y: number }) => {
    if (onExploreShapeMoved) {
      onExploreShapeMoved(shapeId, newPosition);
    }
  };

  const handleExploreShapeRotate = (shapeId: string) => {
    if (onExploreShapeRotated) {
      onExploreShapeRotated(shapeId);
    }
  };

  const handleShapeClick = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot && slot.filled && !isExploreMode) {
      setSelectedShapeId(slotId);
    }
  };

  const handleColorSelect = (color: string) => {
    if (selectedShapeId && onColorChange) {
      onColorChange(selectedShapeId, color);
      setSelectedShapeId(null);
    }
  };

  const selectedSlot = slots.find(s => s.id === selectedShapeId);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-1 md:p-4 lg:p-8">
      {/* View Toggle with Explore Mode - responsive button layout */}
      <div className="mb-2 md:mb-4 flex flex-col sm:flex-row gap-2 z-30 relative w-full max-w-lg justify-center">
        <button
          onClick={() => setView3D(false)}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base ${
            !view3D 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {t('ui.blueprint')}
        </button>
        <button
          onClick={() => setView3D(true)}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base ${
            view3D 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <span className="hidden sm:inline">
            {isExploreMode 
              ? t('ui.view_3d_with_count', { count: exploreSlots.length }) 
              : t('ui.view_3d_with_progress', { filled: filledCount, total: blueprintSlots.length })}
          </span>
          <span className="sm:hidden">
            {isExploreMode 
              ? t('ui.view_3d_short_with_count', { count: exploreSlots.length }) 
              : t('ui.view_3d_short_with_progress', { filled: filledCount, total: blueprintSlots.length })}
          </span>
        </button>
        
        {/* Explore Mode Button - responsive sizing and text */}
        {isCompleted && !isExploreMode && (
          <button
            onClick={onStartExplore}
            className="px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg text-sm md:text-base"
          >
            <span className="hidden sm:inline">{t('ui.explore_shapes')}</span>
            <span className="sm:hidden">{t('ui.explore')}</span>
          </button>
        )}
      </div>
      
      <div 
        className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl aspect-video bg-slate-800/90 backdrop-blur-sm rounded-gradeaid shadow-gentle border-2 border-cyan-400/30 overflow-hidden"
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
      >
        {view3D ? (
          /* 3D Scene View - show explore shapes in explore mode, blueprint shapes otherwise */
          <ThreeDCastleScene slots={isExploreMode ? exploreSlots : blueprintSlots} />
        ) : (
          /* Blueprint View */
          <>
            {/* Blueprint Construction Grid - responsive grid size */}
            <div 
              className="absolute inset-0 opacity-20 md:hidden"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '15px 15px' // Smaller on mobile
              }}
            />
            <div 
              className="absolute inset-0 opacity-20 hidden md:block lg:hidden"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '25px 25px' // Medium on tablet
              }}
            />
            <div 
              className="absolute inset-0 opacity-20 hidden lg:block"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '30px 30px' // Larger on desktop
              }}
            />
            
            {/* Responsive overlay labels */}
            <div className="absolute top-1 left-1 md:top-2 md:left-2 lg:top-4 lg:left-4 px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-xs md:text-sm tracking-wider">
                <span className="hidden sm:inline">
                  {isExploreMode ? t('ui.explore_mode_drop_anywhere') : t('ui.castle_blueprint')}
                </span>
                <span className="sm:hidden">
                  {isExploreMode ? t('ui.explore_mode_short') : t('ui.blueprint_short')}
                </span>
              </span>
            </div>
            <div className="absolute top-1 right-1 md:top-2 md:right-2 lg:top-4 lg:right-4 px-2 py-1 md:px-3 md:py-1 bg-cyan-400/10 rounded border border-cyan-400/30">
              <span className="text-cyan-400 font-mono text-xs">REV 001</span>
            </div>
            
            {/* Render Blueprint Castle Slots */}
            {slots.map((slot) => (
              <BlueprintCastleSlot
                key={slot.id}
                slot={slot}
                onShapeDrop={handleShapeDrop}
                onRemove={slot.isExploreMode ? handleExploreShapeRemove : undefined}
                onMove={slot.isExploreMode ? handleExploreShapeMove : undefined}
                onRotate={slot.isExploreMode ? handleExploreShapeRotate : undefined}
                onClick={handleShapeClick}
                isSelected={selectedShapeId === slot.id}
                hasError={dragError === slot.id}
                isExploreMode={isExploreMode}
              />
            ))}
            
            {/* Color Picker */}
            {selectedShapeId && selectedSlot && !isExploreMode && (
              <ColorPicker
                selectedColor={selectedSlot.color}
                onColorSelect={handleColorSelect}
                onClose={() => setSelectedShapeId(null)}
              />
            )}
            
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
