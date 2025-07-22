import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, className = '' }) => {
  const progress = Math.round((completed / total) * 100);

  return (
    <div className={`bg-card rounded-gradeaid p-4 shadow-gradeaid border-l-[10px] border-b-[10px] border-foreground ${className}`}>
      <div className="flex items-center gap-4">
        {/* Castle icon */}
        <div className="flex-shrink-0" aria-label="Castle progress">
          <div className="relative w-8 h-8">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-primary rounded-t-lg" />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-secondary" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden relative" aria-label={`Progress: ${progress}%`}>
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Gentle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           animate-gentle-float" />
          </div>
          
          {/* Progress sparkles */}
          {progress > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-primary rounded-full animate-soft-glow" />
            </div>
          )}
        </div>

        {/* Progress segments */}
        <div className="flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}>
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < completed 
                  ? 'bg-primary shadow-gentle animate-gentle-bounce' 
                  : 'bg-muted border border-border'
              }`}
              aria-label={`Section ${i + 1}: ${i < completed ? 'completed' : 'pending'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};