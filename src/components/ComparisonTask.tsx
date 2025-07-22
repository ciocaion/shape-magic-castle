import React from 'react';
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
  const getTaskIcon = () => {
    switch (question.task) {
      case 'bigger':
        return (
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <div className="text-2xl">→</div>
            <div className="w-12 h-12 bg-primary rounded-lg"></div>
          </div>
        );
      case 'more-corners':
        return (
          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full"></div>
              ))}
            </div>
            <div className="text-2xl">📐</div>
          </div>
        );
      case '3d-shape':
        return (
          <div className="mb-8 transform perspective-1000 rotateX-12 rotateY-12">
            <div className="w-12 h-12 bg-primary rounded-lg shadow-magic"></div>
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
      // Show success feedback and complete
      setTimeout(onComplete, 1000);
    } else {
      // Show error feedback
      console.log('Wrong answer, try again!');
    }
  };

  const getShapeCorners = (type: ShapeType): number => {
    switch (type) {
      case 'circle': return 0;
      case 'triangle': return 3;
      case 'square': return 4;
      case 'rectangle': return 4;
      case 'star': return 10; // 5 outer + 5 inner points
      case 'heart': return 0; // Curved shape
      default: return 0;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="bg-card rounded-gradeaid p-8 shadow-gradeaid border-l-[10px] border-b-[10px] border-foreground max-w-md w-full text-center">
        {/* Task indicator */}
        <div className="flex justify-center mb-8">
          {getTaskIcon()}
        </div>

        {/* Shape options */}
        <div className="flex justify-center gap-8 mb-8">
          {question.shapes.map((shape, index) => (
            <button
              key={index}
              onClick={() => handleShapeClick(index)}
              className="transform hover:scale-105 transition-all duration-300 hover:shadow-gentle
                         active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-2xl p-4
                         min-w-[44px] min-h-[44px]"
              aria-label={`Select ${shape.type} shape`}
            >
              <DraggableShape
                type={shape.type}
                size={shape.size === 'large' ? 'large' : shape.size === 'small' ? 'small' : 'medium'}
                is3D={shape.is3D}
              />
            </button>
          ))}
        </div>

        {/* Visual hint */}
        <div className="text-center text-muted-foreground">
          <div className="w-8 h-8 mx-auto bg-primary/20 rounded-full animate-soft-glow" />
        </div>
      </div>
    </div>
  );
};