import React, { useState, useEffect } from 'react';
import type { ShapeType } from './ShapeShifterCastle';

interface WOWTransformationShapeProps {
  type: ShapeType;
  size?: 'small' | 'medium' | 'large';
  isTransforming?: boolean;
  showSymmetry?: boolean;
  onClick?: () => void;
}

export const WOWTransformationShape: React.FC<WOWTransformationShapeProps> = ({
  type,
  size = 'medium',
  isTransforming = false,
  showSymmetry = false,
  onClick
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [transformationStage, setTransformationStage] = useState<'2d' | 'transforming' | '3d'>('2d');

  useEffect(() => {
    if (isTransforming) {
      setTransformationStage('transforming');
      setTimeout(() => setTransformationStage('3d'), 400);
    }
  }, [isTransforming]);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const shapeColors = {
    square: 'bg-shape-square',
    rectangle: 'bg-shape-rectangle',
    triangle: '',
    circle: 'bg-shape-circle',
    star: '',
    heart: ''
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
    const is3D = transformationStage === '3d';
    const isAnimating = transformationStage === 'transforming';
    
    const baseClasses = `${sizeClasses[size]} cursor-pointer select-none relative
      ${isDragging ? 'opacity-50' : 'opacity-100'} 
      ${isAnimating ? 'animate-transform-to-3d' : ''} 
      ${is3D ? 'transform-gpu' : ''}
      transition-all duration-300 hover:shadow-gentle min-w-[44px] min-h-[44px]`;

    const render3DEffects = () => {
      if (!is3D) return null;
      
      return (
        <>
          {/* 3D Shadow/Depth Layer */}
          <div className="absolute -top-2 -left-2 w-full h-full opacity-40 -z-10" />
          
          {/* Magical Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg" />
          
          {/* Symmetry Lines */}
          {showSymmetry && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Horizontal Symmetry Line */}
              <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-soft-glow" />
              {/* Vertical Symmetry Line */}
              <div className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent animate-soft-glow" />
              
              {/* Sparkling Symmetry Points */}
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary rounded-full animate-gentle-bounce transform -translate-x-1/2 -translate-y-1/2" />
              
              {/* Radiating Magic Lines for Complex Shapes */}
              {(type === 'star' || type === 'heart') && (
                <>
                  <div className="absolute top-1/4 left-1/4 bottom-3/4 right-3/4 border border-primary/30 animate-gentle-float" />
                  <div className="absolute top-1/4 right-1/4 bottom-3/4 left-3/4 border border-primary/30 animate-gentle-float" style={{ animationDelay: '0.5s' }} />
                </>
              )}
            </div>
          )}
        </>
      );
    };

    switch (type) {
      case 'square':
        return (
          <div className={`${baseClasses} ${shapeColors[type]} rounded-lg`} 
               style={{ 
                 perspective: '200px',
                 transform: is3D ? 'rotateX(15deg) rotateY(15deg)' : 'none',
                 filter: is3D ? 'brightness(1.2) drop-shadow(4px 4px 12px rgba(47, 46, 65, 0.4))' : 'none'
               }}
               aria-label="Square - transforms into a magical cube">
            {render3DEffects()}
            {/* Cube Face Highlights for 3D Effect */}
            {is3D && (
              <>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/20 rounded-r-lg" />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black/10 rounded-b-lg" />
              </>
            )}
          </div>
        );
      
      case 'rectangle':
        return (
          <div className={`${baseClasses} ${shapeColors[type]} rounded-lg`} 
               style={{ 
                 aspectRatio: '3/2',
                 perspective: '200px',
                 transform: is3D ? 'rotateX(10deg) rotateY(10deg)' : 'none',
                 filter: is3D ? 'brightness(1.2) drop-shadow(4px 4px 12px rgba(47, 46, 65, 0.4))' : 'none'
               }}
               aria-label="Rectangle - transforms into a magical doorway">
            {render3DEffects()}
            {/* Door Frame Effect for 3D */}
            {is3D && (
              <div className="absolute inset-2 border-2 border-white/30 rounded-md" />
            )}
          </div>
        );
      
      case 'triangle':
        return (
          <div className={`relative ${sizeClasses[size]} cursor-pointer select-none`} 
               aria-label="Triangle - transforms into a magical pyramid">
            <div 
              className={`w-0 h-0 ${isDragging ? 'opacity-50' : 'opacity-100'} 
                transition-all duration-300 hover:drop-shadow-lg relative mx-auto`}
              style={{
                borderLeft: size === 'small' ? '24px solid transparent' : 
                           size === 'medium' ? '32px solid transparent' : '40px solid transparent',
                borderRight: size === 'small' ? '24px solid transparent' : 
                            size === 'medium' ? '32px solid transparent' : '40px solid transparent',
                borderBottom: size === 'small' ? '48px solid hsl(var(--shape-triangle))' : 
                             size === 'medium' ? '64px solid hsl(var(--shape-triangle))' : 
                             '80px solid hsl(var(--shape-triangle))',
                filter: is3D ? 'brightness(1.2) drop-shadow(6px 6px 16px rgba(47, 46, 65, 0.4))' : 'none',
                transform: is3D ? 'perspective(200px) rotateX(20deg)' : 'none'
              }}
            />
            
            {/* 3D Pyramid Effects */}
            {is3D && (
              <>
                {/* Left Face */}
                <div 
                  className="absolute w-0 h-0 opacity-60"
                  style={{
                    top: size === 'medium' ? '32px' : '40px',
                    left: size === 'medium' ? '16px' : '20px',
                    borderLeft: size === 'medium' ? '16px solid hsl(var(--shape-triangle))' : '20px solid hsl(var(--shape-triangle))',
                    borderBottom: size === 'medium' ? '32px solid transparent' : '40px solid transparent',
                    filter: 'brightness(0.8)'
                  }}
                />
                {/* Right Face */}
                <div 
                  className="absolute w-0 h-0 opacity-60"
                  style={{
                    top: size === 'medium' ? '32px' : '40px',
                    right: size === 'medium' ? '16px' : '20px',
                    borderRight: size === 'medium' ? '16px solid hsl(var(--shape-triangle))' : '20px solid hsl(var(--shape-triangle))',
                    borderBottom: size === 'medium' ? '32px solid transparent' : '40px solid transparent',
                    filter: 'brightness(0.9)'
                  }}
                />
              </>
            )}
            
            {render3DEffects()}
          </div>
        );
      
      case 'circle':
        return (
          <div className={`${baseClasses} ${shapeColors[type]} rounded-full`} 
               style={{ 
                 perspective: '200px',
                 transform: is3D ? 'perspective(200px) rotateX(10deg) rotateY(10deg)' : 'none',
                 filter: is3D ? 'brightness(1.2) drop-shadow(4px 4px 16px rgba(47, 46, 65, 0.4))' : 'none'
               }}
               aria-label="Circle - transforms into a magical sphere">
            {render3DEffects()}
            {/* Sphere Highlight */}
            {is3D && (
              <div className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/40 rounded-full" />
            )}
          </div>
        );
      
      case 'star':
        return (
          <div className={`relative ${sizeClasses[size]} cursor-pointer select-none`} 
               aria-label="Star - transforms into a magical royal crest">
            <svg 
              viewBox="0 0 24 24" 
              className={`w-full h-full fill-current text-shape-star ${isDragging ? 'opacity-50' : 'opacity-100'} 
                transition-all duration-300 hover:drop-shadow-lg`}
              style={{ 
                filter: is3D ? 'brightness(1.3) drop-shadow(4px 4px 16px rgba(47, 46, 65, 0.4))' : 'none',
                transform: is3D ? 'perspective(200px) rotateX(10deg) rotateY(10deg) scale(1.1)' : 'none'
              }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            
            {/* 3D Star Layers */}
            {is3D && (
              <>
                <svg 
                  viewBox="0 0 24 24" 
                  className="absolute -top-1 -left-1 w-full h-full fill-current text-shape-star opacity-40 -z-10"
                  style={{ filter: 'brightness(0.7)' }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                
                {/* Magical Starburst Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-4 bg-primary/30 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${i * 72}deg) translateY(-50%)`,
                        transformOrigin: '50% 100%'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            
            {render3DEffects()}
          </div>
        );
      
      case 'heart':
        return (
          <div className={`relative ${sizeClasses[size]} cursor-pointer select-none`} 
               aria-label="Heart - transforms into a magical portal">
            <svg 
              viewBox="0 0 24 24" 
              className={`w-full h-full fill-current text-shape-heart ${isDragging ? 'opacity-50' : 'opacity-100'} 
                transition-all duration-300 hover:drop-shadow-lg`}
              style={{ 
                filter: is3D ? 'brightness(1.3) drop-shadow(4px 4px 16px rgba(47, 46, 65, 0.4))' : 'none',
                transform: is3D ? 'perspective(200px) rotateX(5deg) rotateY(5deg) scale(1.1)' : 'none'
              }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            
            {/* 3D Heart Portal Effects */}
            {is3D && (
              <>
                <svg 
                  viewBox="0 0 24 24" 
                  className="absolute -top-1 -left-1 w-full h-full fill-current text-shape-heart opacity-30 -z-10"
                  style={{ filter: 'brightness(0.6)' }}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                
                {/* Magical Portal Glow */}
                <div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-full" />
              </>
            )}
            
            {render3DEffects()}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      {renderShape()}
    </div>
  );
};