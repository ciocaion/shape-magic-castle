
import React, { useState } from 'react';
import { DraggableShape } from './DraggableShape';
import type { ShapeType } from './ShapeShifterCastle';

interface ComparisonTaskProps {
  question: {
    shapes: { type: ShapeType; size?: 'small' | 'large'; is3D?: boolean }[];
    task: 'bigger' | 'more-corners' | '3d-shape';
  };
  onComplete: () => void;
}

export const ComparisonTask: React.FC<ComparisonTaskProps> = ({ question, onComplete }) => {
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const getTaskTitle = () => {
    switch (question.task) {
      case 'bigger':
        return 'Which shape is BIGGER?';
      case 'more-corners':
        return 'Which shape has MORE CORNERS?';
      case '3d-shape':
        return 'Which shape is 3D (has depth)?';
      default:
        return 'Compare the shapes';
    }
  };

  const getTaskIcon = () => {
    switch (question.task) {
      case 'bigger':
        return (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <div className="text-3xl text-primary">VS</div>
            <div className="w-12 h-12 bg-primary rounded-lg"></div>
            <div className="text-2xl">📏</div>
          </div>
        );
      case 'more-corners':
        return (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-primary" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
              <span className="text-xs mt-1">3 corners</span>
            </div>
            <div className="text-3xl text-primary">VS</div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-primary"></div>
              <span className="text-xs mt-1">4 corners</span>
            </div>
            <div className="text-2xl">📐</div>
          </div>
        );
      case '3d-shape':
        return (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-primary rounded"></div>
              <span className="text-xs mt-1">Flat (2D)</span>
            </div>
            <div className="text-3xl text-primary">VS</div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-primary rounded shadow-lg" style={{ 
                background: 'linear-gradient(45deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 70%, hsl(var(--primary)/0.7) 100%)'
              }}></div>
              <span className="text-xs mt-1">Solid (3D)</span>
            </div>
            <div className="text-2xl">🔄</div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleShapeClick = (shapeIndex: number) => {
    const shape = question.shapes[shapeIndex];
    let isCorrect = false;

    switch (question.task) {
      case 'bigger':
        isCorrect = shape.size === 'large';
        break;
      case 'more-corners':
        const corners = getShapeCorners(shape.type);
        const otherCorners = getShapeCorners(question.shapes[1 - shapeIndex].type);
        isCorrect = corners > otherCorners;
        break;
      case '3d-shape':
        isCorrect = shape.is3D === true;
        break;
    }

    if (isCorrect) {
      setShowFeedback('correct');
      setTimeout(() => {
        setShowFeedback(null);
        onComplete();
      }, 1500);
    } else {
      setShowFeedback('wrong');
      setTimeout(() => setShowFeedback(null), 1000);
    }
  };

  const getShapeCorners = (type: ShapeType): number => {
    switch (type) {
      case 'circle': return 0;
      case 'triangle': return 3;
      case 'square': return 4;
      case 'rectangle': return 4;
      case 'star': return 10;
      case 'heart': return 0;
      default: return 0;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="bg-card rounded-gradeaid p-8 shadow-gradeaid border-l-[10px] border-b-[10px] border-foreground max-w-lg w-full text-center">
        
        {/* Clear Task Title */}
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {getTaskTitle()}
        </h2>

        {/* Visual Instructions */}
        <div className="flex justify-center mb-8">
          {getTaskIcon()}
        </div>

        {/* Instruction Text */}
        <p className="text-muted-foreground mb-8 text-lg">
          👆 Click on the correct shape below
        </p>

        {/* Shape Options with Clear Labels */}
        <div className="flex justify-center gap-12 mb-8">
          {question.shapes.map((shape, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => handleShapeClick(index)}
                className={`transform hover:scale-110 transition-all duration-300 hover:shadow-gentle
                           active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-2xl p-6
                           min-w-[80px] min-h-[80px] border-2 border-transparent hover:border-primary/30
                           ${showFeedback === 'correct' && isCorrectShape(shape, index) ? 'border-green-500 bg-green-100' : ''}
                           ${showFeedback === 'wrong' && !isCorrectShape(shape, index) ? 'border-red-500 bg-red-100' : ''}`}
                aria-label={`Select ${shape.type} shape`}
                disabled={showFeedback !== null}
              >
                <DraggableShape
                  type={shape.type}
                  size={shape.size === 'large' ? 'large' : shape.size === 'small' ? 'small' : 'medium'}
                  is3D={shape.is3D}
                />
              </button>
              
              {/* Shape Labels */}
              <div className="mt-2 text-sm text-muted-foreground">
                {shape.size === 'large' && 'Large'}
                {shape.size === 'small' && 'Small'}
                {shape.is3D && '3D'}
                {question.task === 'more-corners' && (
                  <div className="text-xs">
                    {getShapeCorners(shape.type)} corners
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Messages */}
        {showFeedback && (
          <div className={`text-xl font-bold ${
            showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'
          }`}>
            {showFeedback === 'correct' ? '✅ Correct! Well done!' : '❌ Try again!'}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="w-16 h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  function isCorrectShape(shape: any, index: number): boolean {
    switch (question.task) {
      case 'bigger':
        return shape.size === 'large';
      case 'more-corners':
        const corners = getShapeCorners(shape.type);
        const otherCorners = getShapeCorners(question.shapes[1 - index].type);
        return corners > otherCorners;
      case '3d-shape':
        return shape.is3D === true;
      default:
        return false;
    }
  }
};
