import React from 'react';
import { DraggableShape } from './DraggableShape';
import type { ShapeType } from './ShapeShifterCastle';

interface ShapePaletteProps {
  className?: string;
}

export const ShapePalette: React.FC<ShapePaletteProps> = ({ className = '' }) => {
  const shapes: ShapeType[] = ['square', 'rectangle', 'triangle', 'circle', 'star', 'heart'];

  return (
    <div className={`bg-card rounded-gradeaid p-6 shadow-gradeaid border-l-[10px] border-b-[10px] border-foreground ${className}`}>
      {/* Blueprint Tool Belt Header */}
      <div className="text-center mb-4">
        <div className="inline-block px-4 py-2 bg-primary/10 rounded-gradeaid-button border border-primary/20">
          <span className="text-primary-foreground font-semibold text-sm tracking-wider">CONSTRUCTION TOOLS</span>
        </div>
      </div>
      
      {/* Shape Tools with Purposeful Display */}
      <div className="flex justify-center items-center gap-8 flex-wrap">
        {shapes.map((shape) => (
          <div key={shape} className="relative group">
            <DraggableShape
              type={shape}
              className="transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-2xl animate-blueprint-pulse"
              size="large"
            />
            {/* Tool readiness indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-gentle-float opacity-70" />
          </div>
        ))}
      </div>
    </div>
  );
};