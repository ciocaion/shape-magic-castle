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
      <div className="flex justify-center items-center gap-6 flex-wrap">
        {shapes.map((shape) => (
          <DraggableShape
            key={shape}
            type={shape}
            className="transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-2xl"
            size="large"
          />
        ))}
      </div>
    </div>
  );
};