import React from 'react';
import { DraggableShape } from './DraggableShape';
import type { ShapeType } from './ShapeShifterCastle';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShapePaletteProps {
  className?: string;
}

export const ShapePalette: React.FC<ShapePaletteProps> = ({ className = '' }) => {
  const shapes: ShapeType[] = ['square', 'rectangle', 'triangle', 'circle', 'pentagon'];
  const isMobile = useIsMobile();

  return (
    <div className={`bg-card rounded-gradeaid p-3 md:p-4 lg:p-6 shadow-gradeaid border-l-[6px] md:border-l-[8px] lg:border-l-[10px] border-b-[6px] md:border-b-[8px] lg:border-b-[10px] border-foreground ${className}`}>
      {/* Blueprint Tool Belt Header - responsive sizing */}
      <div className="text-center mb-2 md:mb-3 lg:mb-4">
        <div className="inline-block px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 bg-primary/10 rounded-gradeaid-button border border-primary/20">
          <span className="text-primary-foreground font-semibold text-xs md:text-sm tracking-wider">
            <span className="hidden sm:inline">CONSTRUCTION TOOLS</span>
            <span className="sm:hidden">TOOLS</span>
          </span>
        </div>
      </div>
      
      {/* Shape Tools with Responsive Display */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 flex-wrap">
        {shapes.map((shape) => (
          <div 
            key={shape} 
            className="relative group w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10"
          >
            <DraggableShape
              type={shape}
              className="transform hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-primary/50 rounded-2xl touch-manipulation"
              size={isMobile ? "small" : "medium"}
            />
            {/* Tool readiness indicator - responsive sizing */}
            <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-3 md:h-3 bg-success rounded-full animate-gentle-float opacity-70" />
          </div>
        ))}
      </div>
    </div>
  );
};