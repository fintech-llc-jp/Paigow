import { Tile } from './Tile';
import { Player } from './Player';

export type GamePhase = 'betting' | 'dealing' | 'arranging' | 'comparing' | 'result';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  dealer: DealerHand;
  deck: Tile[];
  currentPlayer: number;
  pot: number;
  round: number;
  isGameActive: boolean;
}

export interface DealerHand {
  tiles: Tile[];
  highHand: Tile[];
  lowHand: Tile[];
  isRevealed: boolean;
}

export interface GameResult {
  playerId: string;
  playerHighWin: boolean;
  playerLowWin: boolean;
  result: 'win' | 'lose' | 'push';
  payout: number;
}

export interface BettingOptions {
  minBet: number;
  maxBet: number;
  availableChips: number[];
}

export interface GameConfig {
  maxPlayers: number;
  dealerRules: 'standard' | 'house_way';
  shuffleAfterRounds: number;
  animation: {
    dealSpeed: number;
    flipSpeed: number;
    moveSpeed: number;
  };
}