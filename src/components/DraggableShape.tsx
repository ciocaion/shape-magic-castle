
import React, { useState } from 'react';
import type { ShapeType } from './ShapeShifterCastle';

interface DraggableShapeProps {
  type: ShapeType;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  is3D?: boolean;
  isDropped?: boolean;
  onClick?: () => void;
}

export const DraggableShape: React.FC<DraggableShapeProps> = ({
  type,
  className = '',
  size = 'medium',
  is3D = false,
  isDropped = false,
  onClick
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    small: type === 'rectangle' ? 'w-[16px] h-[64px]' : 'w-[32px] h-[32px]', // thin and tall for tree trunk, normal for others
    medium: type === 'rectangle' ? (isDropped ? 'w-[32px] h-[96px]' : 'w-[64px] h-[40px]') : 'w-[48px] h-[48px]', // rectangles are wide in palette, tall when dropped, others are square
    large: 'w-[80px] h-[80px]' // significantly bigger for castle base
  };

  const shapeColors = {
    square: 'bg-shape-square',
    rectangle: 'bg-shape-rectangle', 
    triangle: '',
    circle: 'bg-shape-circle',
    pentagon: '',
    hexagon: ''
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
    const isSVGShape = ['triangle', 'circle', 'pentagon', 'hexagon'].includes(type);
    
    const baseClasses = `${sizeClasses[size]} cursor-pointer select-none relative
      ${isDragging ? 'opacity-50' : 'opacity-100'} 
      ${is3D ? 'animate-transform-to-3d' : ''} 
      transition-all duration-300 ${!isSVGShape ? 'hover:shadow-gentle' : ''}`;

    switch (type) {
      case 'square':
        return (
          <div
            className={`${baseClasses} ${shapeColors[type]}`}
            aria-label="Square shape"
            style={{ aspectRatio: '1 / 1', borderRadius: '0.25rem' }}
          />
        );
      case 'rectangle':
        return (
          <div
            className={`${baseClasses} ${shapeColors[type]}`}
            aria-label="Rectangle shape"
            style={{ 
              borderRadius: '0.25rem' 
            }}
          />
        );
      case 'triangle':
        return (
          <svg
            viewBox="0 0 100 86.6"
            className={baseClasses}
            aria-label="Triangle shape"
            style={{ background: 'transparent', overflow: 'visible' }}
          >
            <polygon points="50,0 100,86.6 0,86.6" fill="hsl(var(--shape-triangle))" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          </svg>
        );
      case 'circle':
        return (
          <svg
            viewBox="0 0 100 100"
            className={baseClasses}
            aria-label="Circle shape"
            style={{ background: 'transparent', overflow: 'visible' }}
          >
            <circle cx="50" cy="50" r="50" fill="hsl(var(--shape-circle))" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          </svg>
        );
      case 'pentagon':
        return (
          <svg
            viewBox="0 0 100 100"
            className={baseClasses}
            aria-label="Pentagon shape"
            style={{ background: 'transparent', overflow: 'visible' }}
          >
            <polygon points="50,5 95,38 77,90 23,90 5,38" fill="hsl(var(--shape-star))" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          </svg>
        );
      case 'hexagon':
        return (
          <svg
            viewBox="0 0 100 100"
            className={baseClasses}
            aria-label="Hexagon shape"
            style={{ background: 'transparent', overflow: 'visible' }}
          >
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="hsl(var(--shape-heart))" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          </svg>
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
