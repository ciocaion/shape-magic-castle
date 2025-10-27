import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect }) => {
  return (
    <div className="absolute top-16 left-4 z-10 bg-card rounded-gradeaid p-3 shadow-gradeaid border-l-[4px] border-b-[4px] border-foreground">
      <div className="text-foreground font-medium text-xs mb-2">Choose Color</div>
      <div className="grid grid-cols-4 gap-2">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
              selectedColor === color.value 
                ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card scale-110' 
                : ''
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
};
