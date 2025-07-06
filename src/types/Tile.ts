export interface Tile {
  id: string;
  name: string;
  dots: number;
  type: 'civil' | 'military';
  value: number;
  rank: number;
  redDots?: boolean;
  pair?: string;
  imagePath: string;
}

export interface TilePosition {
  x: number;
  y: number;
  rotation?: number;
}

export interface TilePair {
  name: string;
  tiles: [Tile, Tile];
  rank: number;
  isSpecial: boolean;
}

export type TileType = 'civil' | 'military';
export type TileState = 'deck' | 'hand' | 'high' | 'low' | 'dealer';