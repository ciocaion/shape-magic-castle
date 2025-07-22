import React, { useEffect, useState } from 'react';

export const CelebrationAnimation: React.FC = () => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFireworks(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Completed Castle */}
      <div className="relative animate-bounce-in">
        <div className="text-center mb-8">
          {/* Main celebration castle */}
          <div className="relative w-64 h-48 mx-auto mb-8">
            {/* Castle base */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-24 bg-castle-stone rounded-t-3xl shadow-castle" />
            
            {/* Main tower */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-castle-tower rounded-t-2xl shadow-castle" />
            
            {/* Side towers */}
            <div className="absolute bottom-0 left-4 w-12 h-20 bg-castle-tower rounded-t-2xl shadow-castle" />
            <div className="absolute bottom-0 right-4 w-12 h-20 bg-castle-tower rounded-t-2xl shadow-castle" />

            {/* Completed elements with 3D effect */}
            {/* Windows */}
            <div className="absolute bottom-8 left-8 w-4 h-4 bg-shape-square rounded shadow-shape animate-transform-3d" />
            <div className="absolute bottom-8 right-8 w-4 h-4 bg-shape-square rounded shadow-shape animate-transform-3d" />
            
            {/* Door */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-shape-rectangle rounded-t shadow-shape animate-transform-3d" />
            
            {/* Tower domes */}
            <div className="absolute bottom-16 left-4 w-4 h-4 bg-shape-circle rounded-full shadow-shape animate-transform-3d" />
            <div className="absolute bottom-16 right-4 w-4 h-4 bg-shape-circle rounded-full shadow-shape animate-transform-3d" />
            
            {/* Roofs */}
            <div className="absolute bottom-20 left-4 w-0 h-0 animate-transform-3d"
                 style={{ 
                   borderLeft: '6px solid transparent',
                   borderRight: '6px solid transparent',
                   borderBottom: '12px solid hsl(var(--shape-triangle))',
                   filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                 }} />
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-0 h-0 animate-transform-3d"
                 style={{ 
                   borderLeft: '8px solid transparent',
                   borderRight: '8px solid transparent',
                   borderBottom: '16px solid hsl(var(--shape-triangle))',
                   filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                 }} />
            <div className="absolute bottom-20 right-4 w-0 h-0 animate-transform-3d"
                 style={{ 
                   borderLeft: '6px solid transparent',
                   borderRight: '6px solid transparent',
                   borderBottom: '12px solid hsl(var(--shape-triangle))',
                   filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                 }} />
            
            {/* Decorative elements */}
            <div className="absolute bottom-12 left-12">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-shape-star animate-celebration">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="absolute bottom-12 right-12">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-shape-heart animate-celebration">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>

          {/* Success message area (visual only) */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-success rounded-full animate-bounce-in flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            <div className="w-16 h-4 bg-gradient-success rounded-full animate-glow-pulse" />
            <div className="w-8 h-8 bg-success rounded-full animate-bounce-in flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Fireworks and celebration effects */}
      {showFireworks && (
        <>
          {/* Confetti */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: [
                  'hsl(var(--shape-square))',
                  'hsl(var(--shape-circle))',
                  'hsl(var(--shape-triangle))',
                  'hsl(var(--shape-star))',
                  'hsl(var(--shape-heart))'
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}

          {/* Magical sparkles */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute w-4 h-4 bg-primary-glow rounded-full animate-sparkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}

          {/* Success banner */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 animate-bounce-in">
            <div className="bg-gradient-success px-8 py-4 rounded-2xl shadow-magic">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-white rounded-full animate-bounce" />
                <div className="w-24 h-4 bg-white/80 rounded-full" />
                <div className="w-6 h-6 bg-white rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};