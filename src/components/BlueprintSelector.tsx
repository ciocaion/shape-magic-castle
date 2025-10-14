import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Card } from './ui/card';

export type BlueprintType = 'airplane' | 'minecraft' | 'roblox' | 'unicorn' | 'house';

interface BlueprintOption {
  id: BlueprintType;
  icon: string;
  color: string;
}

interface BlueprintSelectorProps {
  onSelect: (blueprint: BlueprintType) => void;
}

const blueprintOptions: BlueprintOption[] = [
  { id: 'airplane', icon: '✈️', color: 'from-blue-400 to-cyan-400' },
  { id: 'minecraft', icon: '⛏️', color: 'from-green-400 to-emerald-400' },
  { id: 'roblox', icon: '🎮', color: 'from-red-400 to-orange-400' },
  { id: 'unicorn', icon: '🦄', color: 'from-pink-400 to-purple-400' },
  { id: 'house', icon: '🏠', color: 'from-yellow-400 to-amber-400' },
];

export const BlueprintSelector: React.FC<BlueprintSelectorProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <Card className="p-8 bg-white/95 max-w-4xl w-full mx-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-primary">
          {t('blueprint_selector.title')}
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          {t('blueprint_selector.subtitle')}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {blueprintOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="group relative overflow-hidden rounded-xl border-4 border-cyan-300 bg-white hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-xl aspect-square"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
              <div className="relative h-full flex flex-col items-center justify-center p-4">
                <span className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">
                  {option.icon}
                </span>
                <span className="font-bold text-lg text-gray-800 capitalize">
                  {t(`blueprint_selector.${option.id}`)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};
