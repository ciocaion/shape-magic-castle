import type { ShapeType } from './ShapeShifterCastle';

export interface BlueprintSlot {
  id: string;
  type: ShapeType;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
}

export type BlueprintType = 'castle' | 'airplane' | 'minecraft' | 'roblox' | 'unicorn' | 'house';

// Castle blueprint (original)
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
  { id: 'body', type: 'rectangle', position: { x: 400, y: 300 }, size: 'large' },
  { id: 'nose', type: 'triangle', position: { x: 450, y: 300 }, size: 'medium' },
  { id: 'wing-top', type: 'rectangle', position: { x: 400, y: 260 }, size: 'medium' },
  { id: 'wing-bottom', type: 'rectangle', position: { x: 400, y: 340 }, size: 'medium' },
  { id: 'tail', type: 'triangle', position: { x: 350, y: 280 }, size: 'small' },
  { id: 'tail-fin', type: 'triangle', position: { x: 350, y: 320 }, size: 'small' },
  { id: 'window-1', type: 'circle', position: { x: 410, y: 300 }, size: 'small' },
  { id: 'window-2', type: 'circle', position: { x: 390, y: 300 }, size: 'small' },
  { id: 'cloud', type: 'circle', position: { x: 200, y: 200 }, size: 'medium' },
];

// Minecraft Character (Creeper-style)
export const minecraftBlueprint: BlueprintSlot[] = [
  { id: 'head', type: 'square', position: { x: 400, y: 280 }, size: 'large' },
  { id: 'body', type: 'rectangle', position: { x: 400, y: 340 }, size: 'medium' },
  { id: 'leg-left', type: 'rectangle', position: { x: 380, y: 380 }, size: 'small' },
  { id: 'leg-right', type: 'rectangle', position: { x: 420, y: 380 }, size: 'small' },
  { id: 'eye-left', type: 'square', position: { x: 385, y: 270 }, size: 'small' },
  { id: 'eye-right', type: 'square', position: { x: 415, y: 270 }, size: 'small' },
  { id: 'mouth-top', type: 'square', position: { x: 400, y: 290 }, size: 'small' },
  { id: 'grass-block', type: 'square', position: { x: 550, y: 350 }, size: 'medium' },
];

// Roblox Character
export const robloxBlueprint: BlueprintSlot[] = [
  { id: 'head', type: 'square', position: { x: 400, y: 260 }, size: 'medium' },
  { id: 'body', type: 'rectangle', position: { x: 400, y: 320 }, size: 'large' },
  { id: 'arm-left', type: 'rectangle', position: { x: 360, y: 320 }, size: 'small' },
  { id: 'arm-right', type: 'rectangle', position: { x: 440, y: 320 }, size: 'small' },
  { id: 'leg-left', type: 'rectangle', position: { x: 380, y: 370 }, size: 'small' },
  { id: 'leg-right', type: 'rectangle', position: { x: 420, y: 370 }, size: 'small' },
  { id: 'face-circle', type: 'circle', position: { x: 400, y: 260 }, size: 'small' },
  { id: 'gear', type: 'pentagon', position: { x: 550, y: 300 }, size: 'medium' },
];

// Unicorn
export const unicornBlueprint: BlueprintSlot[] = [
  { id: 'body', type: 'circle', position: { x: 400, y: 320 }, size: 'large' },
  { id: 'head', type: 'circle', position: { x: 450, y: 280 }, size: 'medium' },
  { id: 'horn', type: 'triangle', position: { x: 450, y: 250 }, size: 'small' },
  { id: 'leg-1', type: 'rectangle', position: { x: 380, y: 360 }, size: 'small' },
  { id: 'leg-2', type: 'rectangle', position: { x: 400, y: 360 }, size: 'small' },
  { id: 'leg-3', type: 'rectangle', position: { x: 410, y: 360 }, size: 'small' },
  { id: 'leg-4', type: 'rectangle', position: { x: 430, y: 360 }, size: 'small' },
  { id: 'tail', type: 'triangle', position: { x: 360, y: 320 }, size: 'medium' },
  { id: 'star', type: 'pentagon', position: { x: 200, y: 200 }, size: 'small' },
  { id: 'rainbow', type: 'circle', position: { x: 600, y: 250 }, size: 'medium' },
];

// House
export const houseBlueprint: BlueprintSlot[] = [
  { id: 'base', type: 'square', position: { x: 400, y: 330 }, size: 'large' },
  { id: 'roof', type: 'triangle', position: { x: 400, y: 270 }, size: 'large' },
  { id: 'door', type: 'rectangle', position: { x: 400, y: 350 }, size: 'small' },
  { id: 'window-left', type: 'square', position: { x: 370, y: 320 }, size: 'small' },
  { id: 'window-right', type: 'square', position: { x: 430, y: 320 }, size: 'small' },
  { id: 'chimney', type: 'rectangle', position: { x: 370, y: 280 }, size: 'small' },
  { id: 'smoke', type: 'circle', position: { x: 370, y: 260 }, size: 'small' },
  { id: 'sun', type: 'circle', position: { x: 150, y: 150 }, size: 'medium' },
  { id: 'tree', type: 'triangle', position: { x: 580, y: 320 }, size: 'medium' },
  { id: 'tree-trunk', type: 'rectangle', position: { x: 580, y: 360 }, size: 'small' },
];

export const blueprints: Record<BlueprintType, BlueprintSlot[]> = {
  castle: castleBlueprint,
  airplane: airplaneBlueprint,
  minecraft: minecraftBlueprint,
  roblox: robloxBlueprint,
  unicorn: unicornBlueprint,
  house: houseBlueprint,
};
