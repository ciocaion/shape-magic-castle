import React, { useState } from 'react';
import { DraggableShape } from './DraggableShape';
import type { ShapeType } from './ShapeShifterCastle';
import magicalChest from '@/assets/magical-chest.jpg';

interface MagicalShapePaletteProps {
  className?: string;
}

export const MagicalShapePalette: React.FC<MagicalShapePaletteProps> = ({ className = '' }) => {
  const shapes: ShapeType[] = ['square', 'rectangle', 'triangle', 'circle', 'star', 'heart'];
  const [chestOpen, setChestOpen] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {/* Magical Chest Background */}
      <div 
        className="relative bg-cover bg-center rounded-gradeaid shadow-gradeaid border-l-[10px] border-b-[10px] border-foreground overflow-hidden"
        style={{ 
          backgroundImage: `url(${magicalChest})`,
          minHeight: '140px'
        }}
      >
        {/* Magical Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-secondary/10" />
        
        {/* Glowing Runes Animation */}
        <div className="absolute top-2 left-4 w-6 h-6 bg-primary/30 rounded-full animate-soft-glow" />
        <div className="absolute top-4 right-6 w-4 h-4 bg-secondary/40 rounded-full animate-gentle-float" />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-accent/30 rounded-full animate-soft-glow" style={{ animationDelay: '1s' }} />

        {/* Shape Collection Area */}
        <div className="relative z-10 p-6">
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {shapes.map((shape) => (
              <div key={shape} className="relative">
                {/* Magical Shimmer Effect around shapes */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 rounded-full animate-gentle-float opacity-60" />
                
                <DraggableShape
                  type={shape}
                  className="relative transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-2xl z-10"
                  size="large"
                />
              </div>
            ))}
          </div>
          
          {/* Magical Sparkles */}
          <div className="absolute top-1 left-8 w-1 h-1 bg-primary rounded-full animate-gentle-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1 right-8 w-1 h-1 bg-secondary rounded-full animate-gentle-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-2 w-1 h-1 bg-accent rounded-full animate-gentle-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Chest Handle/Lock Detail */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-secondary to-primary rounded-full shadow-gentle" />
      </div>

      {/* Magical Aura Underneath */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full blur-md" />
    </div>
  );
};