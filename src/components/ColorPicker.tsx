import React from 'react';
import { useTranslation } from 'react-i18next';

interface ColorPickerProps {
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const colors = [
  { name: 'Red', value: 'hsl(0, 84%, 60%)' },
  { name: 'Blue', value: 'hsl(200, 90%, 50%)' },
  { name: 'Green', value: 'hsl(142, 76%, 36%)' },
  { name: 'Yellow', value: 'hsl(43, 96%, 56%)' },
  { name: 'Purple', value: 'hsl(280, 67%, 55%)' },
  { name: 'Orange', value: 'hsl(30, 95%, 55%)' },
  { name: 'Pink', value: 'hsl(330, 81%, 60%)' },
  { name: 'Teal', value: 'hsl(175, 60%, 45%)' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-cyan-400/30 p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-cyan-300 font-semibold text-sm">
          {t('ui.choose_color') || 'Choose Color'}
        </h3>
        <button
          onClick={onClose}
          className="text-cyan-400 hover:text-cyan-300 text-lg font-bold w-6 h-6 flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={`w-10 h-10 rounded-lg transition-all hover:scale-110 ${
              selectedColor === color.value
                ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-800'
                : ''
            }`}
            style={{ backgroundColor: color.value }}
            aria-label={color.name}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};
