import type { ShapeType } from '../components/ShapeShifterCastle';

export interface BlueprintSlot {
  id: string;
  type: ShapeType;
  position: { x: number; y: number };
  size?: 'small' | 'medium' | 'large';
}

// Castle blueprint - existing
export const castleBlueprint: BlueprintSlot[] = [
  { id: 'tower-center', type: 'rectangle', position: { x: 400, y: 320 }, size: 'medium' },
  { id: 'castle-base', type: 'square', position: { x: 400, y: 350 }, size: 'large' },
  { id: 'tower-left', type: 'rectangle', position: { x: 340, y: 350 }, size: 'medium' },
  { id: 'tower-right', type: 'rectangle', position: { x: 460, y: 350 }, size: 'medium' },
  { id: 'roof-left', type: 'triangle', position: { x: 340, y: 302 }, size: 'medium' },
  { id: 'roof-right', type: 'triangle', position: { x: 460, y: 302 }, size: 'medium' },
  { id: 'roof-center', type: 'triangle', position: { x: 400, y: 272 }, size: 'medium' },
  { id: 'sun', type: 'circle', position: { x: 120, y: 150 }, size: 'medium' },
  { id: 'tree-trunk', type: 'rectangle', position: { x: 580, y: 350 }, size: 'small' },
  { id: 'tree-top', type: 'pentagon', position: { x: 580, y: 318 }, size: 'medium' },
];

// Airplane blueprint
export const airplaneBlueprint: BlueprintSlot[] = [
  // Fuselage (body)
  { id: 'fuselage', type: 'rectangle', position: { x: 400, y: 300 }, size: 'large' },
  
  // Wings
  { id: 'wing-left', type: 'triangle', position: { x: 340, y: 300 }, size: 'medium' },
  { id: 'wing-right', type: 'triangle', position: { x: 460, y: 300 }, size: 'medium' },
  
  // Tail
  { id: 'tail-base', type: 'square', position: { x: 400, y: 240 }, size: 'small' },
  { id: 'tail-fin', type: 'triangle', position: { x: 400, y: 210 }, size: 'small' },
  
  // Nose/Cockpit
  { id: 'cockpit', type: 'circle', position: { x: 400, y: 350 }, size: 'medium' },
  
  // Windows
  { id: 'window-1', type: 'circle', position: { x: 380, y: 290 }, size: 'small' },
  { id: 'window-2', type: 'circle', position: { x: 420, y: 290 }, size: 'small' },
  
  // Propeller
  { id: 'propeller', type: 'hexagon', position: { x: 400, y: 380 }, size: 'small' },
];

// House blueprint
export const houseBlueprint: BlueprintSlot[] = [
  // Main structure
  { id: 'house-base', type: 'square', position: { x: 400, y: 330 }, size: 'large' },
  
  // Roof
  { id: 'roof', type: 'triangle', position: { x: 400, y: 260 }, size: 'large' },
  
  // Door
  { id: 'door', type: 'rectangle', position: { x: 400, y: 360 }, size: 'small' },
  
  // Windows
  { id: 'window-left', type: 'square', position: { x: 360, y: 310 }, size: 'small' },
  { id: 'window-right', type: 'square', position: { x: 440, y: 310 }, size: 'small' },
  
  // Chimney
  { id: 'chimney', type: 'rectangle', position: { x: 440, y: 260 }, size: 'small' },
  
  // Garden elements
  { id: 'tree-trunk', type: 'rectangle', position: { x: 540, y: 360 }, size: 'small' },
  { id: 'tree-leaves', type: 'circle', position: { x: 540, y: 330 }, size: 'medium' },
  { id: 'sun', type: 'circle', position: { x: 150, y: 180 }, size: 'medium' },
];

// Minecraft Character blueprint (Steve/Alex style)
export const minecraftBlueprint: BlueprintSlot[] = [
  // Head
  { id: 'head', type: 'square', position: { x: 400, y: 250 }, size: 'medium' },
  
  // Body
  { id: 'body', type: 'rectangle', position: { x: 400, y: 310 }, size: 'medium' },
  
  // Arms
  { id: 'arm-left', type: 'rectangle', position: { x: 360, y: 310 }, size: 'small' },
  { id: 'arm-right', type: 'rectangle', position: { x: 440, y: 310 }, size: 'small' },
  
  // Legs
  { id: 'leg-left', type: 'rectangle', position: { x: 385, y: 360 }, size: 'small' },
  { id: 'leg-right', type: 'rectangle', position: { x: 415, y: 360 }, size: 'small' },
  
  // Eyes
  { id: 'eye-left', type: 'square', position: { x: 390, y: 245 }, size: 'small' },
  { id: 'eye-right', type: 'square', position: { x: 410, y: 245 }, size: 'small' },
  
  // Tool/Pickaxe (optional decorative elements)
  { id: 'tool-handle', type: 'rectangle', position: { x: 320, y: 310 }, size: 'small' },
  { id: 'tool-head', type: 'triangle', position: { x: 305, y: 295 }, size: 'small' },
];

export type BlueprintType = 'castle' | 'airplane' | 'house' | 'minecraft';

export const blueprints: Record<BlueprintType, BlueprintSlot[]> = {
  castle: castleBlueprint,
  airplane: airplaneBlueprint,
  house: houseBlueprint,
  minecraft: minecraftBlueprint,
};

export const getBlueprintName = (type: BlueprintType): string => {
  const names: Record<BlueprintType, string> = {
    castle: 'blueprints.castle.title',
    airplane: 'blueprints.airplane.title',
    house: 'blueprints.house.title',
    minecraft: 'blueprints.minecraft.title',
  };
  return names[type];
};
