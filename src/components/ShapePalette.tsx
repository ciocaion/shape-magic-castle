import React from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableShape } from './DraggableShape';
import type { ShapeType } from './ShapeShifterCastle';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShapePaletteProps {
  className?: string;
  activeShapeType?: ShapeType | null;
  onShapeClick?: (shapeType: ShapeType) => void;
}

export const ShapePalette: React.FC<ShapePaletteProps> = ({ 
  className = '', 
  activeShapeType = null,
  onShapeClick
}) => {
  const shapes: ShapeType[] = ['square', 'rectangle', 'triangle', 'circle', 'pentagon'];
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const handleShapeClick = (shapeType: ShapeType) => {
    if (onShapeClick && activeShapeType === shapeType) {
      onShapeClick(shapeType);
    }
  };

  return (
    <div className={`bg-card rounded-gradeaid p-3 md:p-4 lg:p-6 shadow-gradeaid border-l-[6px] md:border-l-[8px] lg:border-l-[10px] border-b-[6px] md:border-b-[8px] lg:border-b-[10px] border-foreground ${className}`}>
      {/* Blueprint Tool Belt Header - responsive sizing */}
      <div className="text-center mb-2 md:mb-3 lg:mb-4">
        <div className="inline-block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 bg-primary/10 rounded-gradeaid-button border border-primary/20">
          <span className="text-primary-foreground font-semibold text-xs md:text-sm tracking-wider">
            <span className="hidden sm:inline">{t('ui.construction_tools')}</span>
            <span className="sm:hidden">{t('ui.tools_short')}</span>
          </span>
        </div>
      </div>
      
      {/* Shape Tools with Responsive Display */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 flex-wrap">
        {shapes.map((shape) => {
          const isActive = activeShapeType === shape;
          return (
            <div 
              key={shape} 
              className={`relative group w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 ${
                isActive ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleShapeClick(shape)}
            >
              <DraggableShape
                type={shape}
                className={`transform hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-primary/50 rounded-2xl touch-manipulation ${
                  isActive ? 'ring-2 ring-cyan-400 animate-gentle-pulse' : ''
                }`}
                size={isMobile ? "small" : "medium"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};