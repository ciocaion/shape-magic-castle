import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BlueprintCastleSlot } from './BlueprintCastleSlot';
import { ThreeDCastleScene } from './ThreeDCastleScene';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';

interface CastleInterfaceProps {
  slots: CastleSlotType[];
  onShapePlaced: (slotId: string, shapeType: ShapeType) => void;
}

export const CastleInterface: React.FC<CastleInterfaceProps> = ({ 
  slots, 
  onShapePlaced,
}) => {
  const [dragError, setDragError] = useState<string | null>(null);
  const [view3D, setView3D] = useState(false);
  const { t } = useTranslation();

  const filledCount = slots.filter(slot => slot.filled).length;
  
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
    <div className="flex-1 flex flex-col items-center justify-center p-1 md:p-4 lg:p-8">
      {/* View Toggle - responsive button layout */}
      <div className="mb-2 md:mb-4 flex flex-row gap-2 z-30 relative w-full max-w-lg justify-center">
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
            {t('ui.view_3d_with_progress', { filled: filledCount, total: slots.length })}
          </span>
          <span className="sm:hidden">
            {t('ui.view_3d_short_with_progress', { filled: filledCount, total: slots.length })}
          </span>
        </button>
      </div>
      
      <div 
        className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl aspect-video bg-slate-800/90 backdrop-blur-sm rounded-gradeaid shadow-gentle border-2 border-cyan-400/30 overflow-hidden"
      >
        {view3D ? (
          /* 3D Scene View */
          <div className="relative w-full h-full">
            <ThreeDCastleScene slots={slots} />
            <div className="absolute top-1 left-1 md:top-2 md:left-2 lg:top-4 lg:left-4 px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-xs md:text-sm tracking-wider">
                <span className="hidden sm:inline">{t('ui.view_label_3d_castle')}</span>
                <span className="sm:hidden">{t('ui.view_label_3d_castle_short')}</span>
              </span>
            </div>
          </div>
        ) : (
          /* Blueprint View */
          <>
            {/* Blueprint Construction Grid - responsive grid size */}
            <div 
              className="absolute inset-0 opacity-20 md:hidden"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '15px 15px'
              }}
            />
            <div 
              className="absolute inset-0 opacity-20 hidden md:block lg:hidden"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '25px 25px'
              }}
            />
            <div 
              className="absolute inset-0 opacity-20 hidden lg:block"
              style={{
                backgroundImage: 'var(--blueprint-grid)',
                backgroundSize: '30px 30px'
              }}
            />
            
            {/* Responsive overlay labels */}
            <div className="absolute top-1 left-1 md:top-2 md:left-2 lg:top-4 lg:left-4 px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 bg-cyan-400/20 rounded border border-cyan-400/40">
              <span className="text-cyan-300 font-mono text-xs md:text-sm tracking-wider">
                <span className="hidden sm:inline">{t('ui.castle_blueprint')}</span>
                <span className="sm:hidden">{t('ui.blueprint_short')}</span>
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
