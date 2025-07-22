import React, { useState } from 'react';
import type { ShapeType } from './ShapeShifterCastle';

interface DraggableShapeProps {
  type: ShapeType;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  is3D?: boolean;
  onClick?: () => void;
}

export const DraggableShape: React.FC<DraggableShapeProps> = ({
  type,
  className = '',
  size = 'medium',
  is3D = false,
  onClick
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const shapeColors = {
    square: 'bg-shape-square',
    rectangle: 'bg-shape-rectangle',
    triangle: 'bg-shape-triangle',
    circle: 'bg-shape-circle',
    star: 'bg-shape-star',
    heart: 'bg-shape-heart'
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify({ type }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const renderShape = () => {
    const baseClasses = `${sizeClasses[size]} ${shapeColors[type]} cursor-pointer select-none relative
      ${isDragging ? 'opacity-50' : 'opacity-100'} 
      ${is3D ? 'animate-transform-3d shadow-shape' : ''} 
      transition-all duration-300 hover:shadow-glow`;

    switch (type) {
      case 'square':
        return (
          <div className={`${baseClasses} rounded-lg`}>
            {is3D && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg" />
            )}
          </div>
        );
      
      case 'rectangle':
        return (
          <div className={`${baseClasses} rounded-lg`} style={{ aspectRatio: '3/2' }}>
            {is3D && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg" />
            )}
          </div>
        );
      
      case 'triangle':
        return (
          <div className={`relative ${sizeClasses[size]} cursor-pointer select-none`}>
            <div 
              className={`w-0 h-0 ${isDragging ? 'opacity-50' : 'opacity-100'} 
                transition-all duration-300 hover:drop-shadow-glow`}
              style={{
                borderLeft: size === 'small' ? '24px solid transparent' : 
                           size === 'medium' ? '32px solid transparent' : '40px solid transparent',
                borderRight: size === 'small' ? '24px solid transparent' : 
                            size === 'medium' ? '32px solid transparent' : '40px solid transparent',
                borderBottom: size === 'small' ? '48px solid hsl(var(--shape-triangle))' : 
                             size === 'medium' ? '64px solid hsl(var(--shape-triangle))' : 
                             '80px solid hsl(var(--shape-triangle))',
                filter: is3D ? 'brightness(1.1) drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' : 'none'
              }}
            />
          </div>
        );
      
      case 'circle':
        return (
          <div className={`${baseClasses} rounded-full`}>
            {is3D && (
              <div className="absolute inset-0 bg-gradient-radial from-white/40 to-transparent rounded-full" />
            )}
          </div>
        );
      
      case 'star':
        return (
          <div className={`relative ${sizeClasses[size]} cursor-pointer select-none`}>
            <svg 
              viewBox="0 0 24 24" 
              className={`w-full h-full fill-current text-shape-star ${isDragging ? 'opacity-50' : 'opacity-100'} 
                transition-all duration-300 hover:drop-shadow-glow`}
              style={{ filter: is3D ? 'brightness(1.1) drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' : 'none' }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      
      case 'heart':
        return (
          <div className={`relative ${sizeClasses[size]} cursor-pointer select-none`}>
            <svg 
              viewBox="0 0 24 24" 
              className={`w-full h-full fill-current text-shape-heart ${isDragging ? 'opacity-50' : 'opacity-100'} 
                transition-all duration-300 hover:drop-shadow-glow`}
              style={{ filter: is3D ? 'brightness(1.1) drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' : 'none' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      className={className}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      {renderShape()}
    </div>
  );
};