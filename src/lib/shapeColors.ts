import type { ShapeType } from '../components/ShapeShifterCastle';

// Color variants for each shape type (HSL format for consistency)
export const shapeColorVariants: Record<ShapeType, string[]> = {
  square: [
    'hsl(0, 84%, 60%)',    // Red
    'hsl(280, 67%, 55%)',  // Purple
    'hsl(200, 90%, 50%)',  // Blue
    'hsl(30, 95%, 55%)',   // Orange
  ],
  rectangle: [
    'hsl(271, 77%, 63%)',  // Purple
    'hsl(340, 75%, 55%)',  // Pink
    'hsl(220, 90%, 60%)',  // Blue
    'hsl(160, 70%, 45%)',  // Teal
  ],
  triangle: [
    'hsl(142, 76%, 36%)',  // Green
    'hsl(175, 60%, 45%)',  // Cyan
    'hsl(80, 70%, 45%)',   // Lime
    'hsl(190, 75%, 40%)',  // Turquoise
  ],
  circle: [
    'hsl(43, 96%, 56%)',   // Yellow
    'hsl(25, 95%, 53%)',   // Orange
    'hsl(45, 100%, 51%)',  // Gold
    'hsl(35, 90%, 55%)',   // Amber
  ],
  pentagon: [
    'hsl(142, 71%, 45%)',  // Green
    'hsl(120, 65%, 50%)',  // Light Green
    'hsl(85, 60%, 45%)',   // Yellow-Green
    'hsl(160, 65%, 42%)',  // Sea Green
  ],
  hexagon: [
    'hsl(330, 81%, 60%)',  // Pink
    'hsl(290, 70%, 58%)',  // Magenta
    'hsl(340, 75%, 55%)',  // Rose
    'hsl(310, 75%, 60%)',  // Fuchsia
  ],
};

/**
 * Get color for a shape based on its type and color index
 */
export const getShapeColor = (type: ShapeType, colorIndex: number = 0): string => {
  const colors = shapeColorVariants[type];
  return colors[colorIndex % colors.length];
};
