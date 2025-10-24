import React from 'react';
import { useTranslation } from 'react-i18next';

export type BlueprintType = 'airplane' | 'house' | 'minecraft';

interface BlueprintSelectorProps {
  onSelect: (blueprintType: BlueprintType) => void;
}

export const BlueprintSelector: React.FC<BlueprintSelectorProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  const blueprints = [
    {
      type: 'airplane' as BlueprintType,
      title: t('blueprints.airplane.title'),
      description: t('blueprints.airplane.description'),
      icon: '✈️',
    },
    {
      type: 'house' as BlueprintType,
      title: t('blueprints.house.title'),
      description: t('blueprints.house.description'),
      icon: '🏠',
    },
    {
      type: 'minecraft' as BlueprintType,
      title: t('blueprints.minecraft.title'),
      description: t('blueprints.minecraft.description'),
      icon: '⛏️',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
          {t('blueprints.choose_next')}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {t('blueprints.select_project')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
        {blueprints.map((blueprint) => (
          <button
            key={blueprint.type}
            onClick={() => onSelect(blueprint.type)}
            className="group relative bg-card rounded-gradeaid p-6 shadow-gradeaid border-l-[6px] border-b-[6px] border-foreground hover:bg-card/90 hover:scale-105 transition-all duration-300 text-left"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
              {blueprint.icon}
            </div>
            <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-2">
              {blueprint.title}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {blueprint.description}
            </p>
            <div className="absolute top-3 right-3 text-primary text-xl opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
