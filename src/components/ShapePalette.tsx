import React from 'react';
import { DraggableShape } from './DraggableShape';
import type { ShapeType } from './ShapeShifterCastle';

interface ShapePaletteProps {
  className?: string;
}

export const ShapePalette: React.FC<ShapePaletteProps> = ({ className = '' }) => {
  const shapes: ShapeType[] = ['square', 'rectangle', 'triangle', 'circle', 'star', 'heart'];

  return (
    <div className={`bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-castle border border-border/50 ${className}`}>
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {shapes.map((shape) => (
          <DraggableShape
            key={shape}
            type={shape}
            className="transform hover:scale-110 transition-transform duration-200"
          />
        ))}
      </div>
    </div>
  );
};