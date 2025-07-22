import React, { useState, useEffect } from 'react';
import { EnchantedCastleSlot } from './EnchantedCastleSlot';
import type { CastleSlot as CastleSlotType, ShapeType } from './ShapeShifterCastle';
import magicalBackground from '@/assets/magical-background.jpg';

interface EnchantedCastleInterfaceProps {
  slots: CastleSlotType[];
  onShapePlaced: (slotId: string, shapeType: ShapeType) => void;
}

export const EnchantedCastleInterface: React.FC<EnchantedCastleInterfaceProps> = ({ 
  slots, 
  onShapePlaced 
}) => {
  const [dragError, setDragError] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [celebrationElements, setCelebrationElements] = useState<string[]>([]);

  // Highlight the next available slot
  useEffect(() => {
    const nextEmptySlot = slots.find(slot => !slot.filled);
    setActiveSlot(nextEmptySlot?.id || null);
  }, [slots]);

  // Trigger celebrations for completed elements
  useEffect(() => {
    const completedSlots = slots.filter(slot => slot.filled);
    setCelebrationElements(completedSlots.map(slot => slot.id));
  }, [slots]);

  const handleShapeDrop = (slotId: string, shapeType: ShapeType) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    if (slot.type === shapeType && !slot.filled) {
      onShapePlaced(slotId, shapeType);
      setDragError(null);
      
      // Trigger mini celebration
      setTimeout(() => {
        setCelebrationElements(prev => [...prev, slotId]);
      }, 600);
    } else {
      setDragError(slotId);
      setTimeout(() => setDragError(null), 800);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      {/* Enchanted Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${magicalBackground})` }}
      />
      
      {/* Floating Islands Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-8 bg-primary/10 rounded-full animate-gentle-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-12 h-6 bg-secondary/10 rounded-full animate-gentle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-10 bg-accent/10 rounded-full animate-gentle-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative w-full max-w-5xl h-96 mx-auto">
        {/* Magical Castle Structure */}
        
        {/* Main Castle Base */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-48 bg-gradient-to-t from-muted to-card rounded-t-[2rem] shadow-gradeaid border-l-[8px] border-b-[8px] border-foreground/20" />
        
        {/* Central Tower */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gradient-to-t from-primary/20 to-card rounded-t-[1.5rem] shadow-card border-l-[6px] border-b-[6px] border-primary/30" />
        
        {/* Side Towers */}
        <div className="absolute bottom-0 left-12 w-24 h-36 bg-gradient-to-t from-secondary/20 to-card rounded-t-[1.5rem] shadow-card border-l-[6px] border-b-[6px] border-secondary/30" />
        <div className="absolute bottom-0 right-12 w-24 h-36 bg-gradient-to-t from-secondary/20 to-card rounded-t-[1.5rem] shadow-card border-l-[6px] border-b-[6px] border-secondary/30" />

        {/* Gate Structure */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-gradient-to-t from-accent/20 to-card/80 rounded-t-[1rem] shadow-gentle" />

        {/* Magical Connecting Bridges */}
        <div className="absolute bottom-24 left-1/4 w-24 h-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full shadow-gentle" />
        <div className="absolute bottom-24 right-1/4 w-24 h-4 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-full shadow-gentle" />

        {/* Render Enchanted Castle Slots */}
        {slots.map((slot) => (
          <EnchantedCastleSlot
            key={slot.id}
            slot={slot}
            onShapeDrop={handleShapeDrop}
            hasError={dragError === slot.id}
            isActive={activeSlot === slot.id}
            hasCelebration={celebrationElements.includes(slot.id)}
          />
        ))}

        {/* Magical Environmental Details */}
        
        {/* Floating Magic Orbs */}
        <div className="absolute top-8 left-1/4 w-3 h-3 bg-primary/50 rounded-full animate-gentle-float shadow-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-12 right-1/3 w-4 h-4 bg-secondary/50 rounded-full animate-gentle-float shadow-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-40 left-1/6 w-2 h-2 bg-accent/50 rounded-full animate-gentle-float shadow-glow" style={{ animationDelay: '5s' }} />

        {/* Magical Grass/Garden Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-success/20 to-transparent rounded-b-lg" />
        
        {/* Starlit Sky Elements */}
        <div className="absolute top-4 left-8 w-1 h-1 bg-primary rounded-full animate-soft-glow" />
        <div className="absolute top-8 left-20 w-1 h-1 bg-secondary rounded-full animate-soft-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-2 right-16 w-1 h-1 bg-accent rounded-full animate-soft-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-12 right-32 w-1 h-1 bg-primary rounded-full animate-soft-glow" style={{ animationDelay: '2.5s' }} />
      </div>
    </div>
  );
};