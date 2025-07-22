import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, className = '' }) => {
  const progress = Math.round((completed / total) * 100);

  return (
    <div className={`bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-castle ${className}`}>
      <div className="flex items-center gap-4">
        {/* Castle icon */}
        <div className="flex-shrink-0">
          <div className="relative w-8 h-8">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-castle-tower rounded-t-lg" />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-castle-roof" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden relative">
          <div 
            className="h-full bg-gradient-magic transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           animate-pulse" />
          </div>
          
          {/* Progress sparkles */}
          {progress > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-primary-glow rounded-full animate-sparkle" />
            </div>
          )}
        </div>

        {/* Progress segments */}
        <div className="flex gap-1">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < completed 
                  ? 'bg-gradient-magic shadow-glow animate-bounce-in' 
                  : 'bg-muted border border-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};