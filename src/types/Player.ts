import { Tile } from './Tile';

export interface Player {
  id: string;
  name: string;
  chips: number;
  currentBet: number;
  hand: Tile[];
  highHand: Tile[];
  lowHand: Tile[];
  isActive: boolean;
  isDealer: boolean;
  position: number;
  avatar?: string;
  stats: PlayerStats;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalWinnings: number;
  bestHand: string;
  winRate: number;
}

export interface PlayerAction {
  type: 'bet' | 'arrange' | 'fold' | 'ready';
  amount?: number;
  tiles?: [Tile, Tile];
}

export interface PlayerPosition {
  x: number;
  y: number;
  angle: number;
  seatNumber: number;
}