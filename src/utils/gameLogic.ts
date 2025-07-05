import { Tile, Player, GameResult, GameState } from '../types';
import { compareHands, getOptimalHandArrangement } from './tileUtils';

export const determineGameResult = (
  playerHighHand: [Tile, Tile],
  playerLowHand: [Tile, Tile],
  dealerHighHand: [Tile, Tile],
  dealerLowHand: [Tile, Tile]
): { highWin: boolean; lowWin: boolean; result: 'win' | 'lose' | 'push' } => {
  const highComparison = compareHands(playerHighHand, dealerHighHand);
  const lowComparison = compareHands(playerLowHand, dealerLowHand);
  
  const highWin = highComparison > 0;
  const lowWin = lowComparison > 0;
  
  if (highWin && lowWin) {
    return { highWin: true, lowWin: true, result: 'win' };
  } else if (!highWin && !lowWin) {
    return { highWin: false, lowWin: false, result: 'lose' };
  } else {
    return { highWin, lowWin, result: 'push' };
  }
};

export const calculatePayout = (
  betAmount: number,
  result: 'win' | 'lose' | 'push'
): number => {
  switch (result) {
    case 'win':
      return betAmount * 0.95; // 5% house edge
    case 'lose':
      return -betAmount;
    case 'push':
      return 0;
    default:
      return 0;
  }
};

export const processGameResults = (
  players: Player[],
  dealerHighHand: [Tile, Tile],
  dealerLowHand: [Tile, Tile]
): GameResult[] => {
  return players
    .filter(player => player.isActive && player.currentBet > 0)
    .map(player => {
      if (player.highHand.length !== 2 || player.lowHand.length !== 2) {
        return {
          playerId: player.id,
          playerHighWin: false,
          playerLowWin: false,
          result: 'lose' as const,
          payout: -player.currentBet,
        };
      }
      
      const playerHighHand: [Tile, Tile] = [player.highHand[0], player.highHand[1]];
      const playerLowHand: [Tile, Tile] = [player.lowHand[0], player.lowHand[1]];
      
      const gameResult = determineGameResult(
        playerHighHand,
        playerLowHand,
        dealerHighHand,
        dealerLowHand
      );
      
      const payout = calculatePayout(player.currentBet, gameResult.result);
      
      return {
        playerId: player.id,
        playerHighWin: gameResult.highWin,
        playerLowWin: gameResult.lowWin,
        result: gameResult.result,
        payout,
      };
    });
};

export const dealerArrangeHand = (tiles: Tile[]): {
  highHand: [Tile, Tile];
  lowHand: [Tile, Tile];
} => {
  return getOptimalHandArrangement(tiles);
};

export const validatePlayerHandArrangement = (
  highHand: [Tile, Tile],
  lowHand: [Tile, Tile]
): boolean => {
  const highStrength = compareHands(highHand, [highHand[0], highHand[1]]);
  const lowStrength = compareHands(lowHand, [lowHand[0], lowHand[1]]);
  
  return highStrength >= lowStrength;
};

export const updatePlayerStats = (
  player: Player,
  result: GameResult
): Player => {
  const newStats = {
    ...player.stats,
    gamesPlayed: player.stats.gamesPlayed + 1,
    gamesWon: player.stats.gamesWon + (result.result === 'win' ? 1 : 0),
    totalWinnings: player.stats.totalWinnings + result.payout,
    winRate: ((player.stats.gamesWon + (result.result === 'win' ? 1 : 0)) / 
              (player.stats.gamesPlayed + 1)) * 100,
  };
  
  return {
    ...player,
    chips: player.chips + result.payout,
    stats: newStats,
  };
};

export const isGameReady = (gameState: GameState): boolean => {
  const activePlayers = gameState.players.filter(p => p.isActive);
  return activePlayers.length > 0 && activePlayers.every(p => p.currentBet > 0);
};

export const canPlayerAffordBet = (player: Player, betAmount: number): boolean => {
  return player.chips >= betAmount;
};