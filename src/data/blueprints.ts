import type { ShapeType } from '../components/ShapeShifterCastle';

export interface BlueprintSlot {
  id: string;
  type: ShapeType;
  position: { x: number; y: number };
  size?: 'small' | 'medium' | 'large';
  drawOrder: number;
}

// Castle blueprint - existing
export const castleBlueprint: BlueprintSlot[] = [
  { id: 'tower-center', type: 'rectangle', position: { x: 400, y: 320 }, size: 'medium', drawOrder: 5 },
  { id: 'castle-base', type: 'square', position: { x: 400, y: 350 }, size: 'large', drawOrder: 3 },
  { id: 'tower-left', type: 'rectangle', position: { x: 340, y: 350 }, size: 'medium', drawOrder: 4 },
  { id: 'tower-right', type: 'rectangle', position: { x: 460, y: 350 }, size: 'medium', drawOrder: 4 },
  { id: 'roof-left', type: 'triangle', position: { x: 340, y: 302 }, size: 'medium', drawOrder: 6 },
  { id: 'roof-right', type: 'triangle', position: { x: 460, y: 302 }, size: 'medium', drawOrder: 6 },
  { id: 'roof-center', type: 'triangle', position: { x: 400, y: 272 }, size: 'medium', drawOrder: 7 },
  { id: 'sun', type: 'circle', position: { x: 120, y: 150 }, size: 'medium', drawOrder: 0 },
  { id: 'tree-trunk', type: 'rectangle', position: { x: 580, y: 350 }, size: 'small', drawOrder: 1 },
  { id: 'tree-top', type: 'pentagon', position: { x: 580, y: 318 }, size: 'medium', drawOrder: 2 },
];

// Airplane blueprint
export const airplaneBlueprint: BlueprintSlot[] = [
  // Fuselage (body)
  { id: 'fuselage', type: 'rectangle', position: { x: 400, y: 300 }, size: 'large', drawOrder: 0 },
  
  // Wings
  { id: 'wing-left', type: 'triangle', position: { x: 340, y: 300 }, size: 'medium', drawOrder: 1 },
  { id: 'wing-right', type: 'triangle', position: { x: 460, y: 300 }, size: 'medium', drawOrder: 1 },
  
  // Tail
  { id: 'tail-base', type: 'square', position: { x: 400, y: 240 }, size: 'small', drawOrder: 2 },
  { id: 'tail-fin', type: 'triangle', position: { x: 400, y: 210 }, size: 'small', drawOrder: 3 },
  
  // Nose/Cockpit
  { id: 'cockpit', type: 'circle', position: { x: 400, y: 350 }, size: 'medium', drawOrder: 4 },
  
  // Windows
  { id: 'window-1', type: 'circle', position: { x: 380, y: 290 }, size: 'small', drawOrder: 5 },
  { id: 'window-2', type: 'circle', position: { x: 420, y: 290 }, size: 'small', drawOrder: 5 },
];

// House blueprint
export const houseBlueprint: BlueprintSlot[] = [
  // Main structure
  { id: 'house-base', type: 'square', position: { x: 400, y: 330 }, size: 'large', drawOrder: 0 },
  
  // Roof
  { id: 'roof', type: 'triangle', position: { x: 400, y: 260 }, size: 'large', drawOrder: 3 },
  
  // Door
  { id: 'door', type: 'rectangle', position: { x: 400, y: 360 }, size: 'small', drawOrder: 1 },
  
  // Windows
  { id: 'window-left', type: 'square', position: { x: 360, y: 310 }, size: 'small', drawOrder: 2 },
  { id: 'window-right', type: 'square', position: { x: 440, y: 310 }, size: 'small', drawOrder: 2 },
  
  // Chimney
  { id: 'chimney', type: 'rectangle', position: { x: 440, y: 260 }, size: 'small', drawOrder: 4 },
  
  // Garden elements (background)
  { id: 'tree-trunk', type: 'rectangle', position: { x: 540, y: 360 }, size: 'small', drawOrder: 5 },
  { id: 'tree-leaves', type: 'circle', position: { x: 540, y: 330 }, size: 'medium', drawOrder: 6 },
  { id: 'sun', type: 'circle', position: { x: 150, y: 180 }, size: 'medium', drawOrder: 7 },
];

// Minecraft Character blueprint (Steve/Alex style)
export const minecraftBlueprint: BlueprintSlot[] = [
  // Head
  { id: 'head', type: 'square', position: { x: 400, y: 250 }, size: 'medium', drawOrder: 1 },
  
  // Body
  { id: 'body', type: 'rectangle', position: { x: 400, y: 310 }, size: 'medium', drawOrder: 0 },
  
  // Arms
  { id: 'arm-left', type: 'rectangle', position: { x: 360, y: 310 }, size: 'small', drawOrder: 2 },
  { id: 'arm-right', type: 'rectangle', position: { x: 440, y: 310 }, size: 'small', drawOrder: 2 },
  
  // Legs
  { id: 'leg-left', type: 'rectangle', position: { x: 385, y: 360 }, size: 'small', drawOrder: 3 },
  { id: 'leg-right', type: 'rectangle', position: { x: 415, y: 360 }, size: 'small', drawOrder: 3 },
  
  // Eyes
  { id: 'eye-left', type: 'square', position: { x: 390, y: 245 }, size: 'small', drawOrder: 4 },
  { id: 'eye-right', type: 'square', position: { x: 410, y: 245 }, size: 'small', drawOrder: 4 },
  
  // Tool/Pickaxe (optional decorative elements)
  { id: 'tool-handle', type: 'rectangle', position: { x: 320, y: 310 }, size: 'small', drawOrder: 5 },
  { id: 'tool-head', type: 'triangle', position: { x: 305, y: 295 }, size: 'small', drawOrder: 6 },
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
