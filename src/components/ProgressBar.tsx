import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, className = '' }) => {
  const progress = Math.round((completed / total) * 100);

  return (
    <div className={`bg-card rounded-gradeaid p-2 md:p-3 lg:p-4 shadow-gradeaid border-l-[6px] md:border-l-[8px] lg:border-l-[10px] border-b-[6px] md:border-b-[8px] lg:border-b-[10px] border-foreground ${className}`}>
      <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
        {/* Castle icon - responsive sizing */}
        <div className="flex-shrink-0" aria-label="Castle progress">
          <div className="relative w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-3 md:w-5 md:h-3.5 lg:w-6 lg:h-4 bg-primary rounded-t-lg" />
            <div className="absolute bottom-1.5 md:bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-secondary" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
        </div>

        {/* Progress bar - responsive height */}
        <div className="flex-1 bg-muted rounded-full h-3 md:h-3.5 lg:h-4 overflow-hidden relative" aria-label={`Progress: ${progress}%`}>
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Gentle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           animate-gentle-float" />
          </div>
          
          {/* Progress sparkles - responsive positioning */}
          {progress > 0 && (
            <div className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-soft-glow" />
            </div>
          )}
        </div>

        {/* Progress segments - responsive sizing and hide on very small screens */}
        <div className="hidden sm:flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}>
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                i < completed 
                  ? 'bg-primary shadow-gentle animate-gentle-bounce' 
                  : 'bg-muted border border-border'
              }`}
              aria-label={`Section ${i + 1}: ${i < completed ? 'completed' : 'pending'}`}
            />
          ))}
        </div>

        {/* Mobile-only progress text */}
        <div className="sm:hidden flex-shrink-0">
          <span className="text-xs font-medium text-muted-foreground">
            {completed}/{total}
          </span>
        </div>
      </div>
    </div>
  );
};