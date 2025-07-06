import { Tile } from '../types';
import { TILE_DEFINITIONS, SPECIAL_PAIRS } from '../constants';

export const createDeck = (): Tile[] => {
  return [...TILE_DEFINITIONS];
};

export const shuffleDeck = (deck: Tile[]): Tile[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getTileById = (id: string): Tile | undefined => {
  return TILE_DEFINITIONS.find(tile => tile.id === id);
};

export const getTilesByPair = (pairName: string): Tile[] => {
  return TILE_DEFINITIONS.filter(tile => tile.pair === pairName);
};

export const isPair = (tile1: Tile, tile2: Tile): boolean => {
  return tile1.pair === tile2.pair;
};

export const isSpecialPair = (tile1: Tile, tile2: Tile): boolean => {
  const pairKey = Object.keys(SPECIAL_PAIRS).find(key => {
    const pair = SPECIAL_PAIRS[key as keyof typeof SPECIAL_PAIRS];
    return (pair.tiles.includes(tile1.id) && pair.tiles.includes(tile2.id));
  });
  return !!pairKey;
};

export const getSpecialPairName = (tile1: Tile, tile2: Tile): string | null => {
  const pairKey = Object.keys(SPECIAL_PAIRS).find(key => {
    const pair = SPECIAL_PAIRS[key as keyof typeof SPECIAL_PAIRS];
    return (pair.tiles.includes(tile1.id) && pair.tiles.includes(tile2.id));
  });
  
  if (pairKey) {
    return SPECIAL_PAIRS[pairKey as keyof typeof SPECIAL_PAIRS].name;
  }
  return null;
};

export const calculateHandValue = (tile1: Tile, tile2: Tile): number => {
  const total = tile1.value + tile2.value;
  return total % 10;
};

export const getHandStrength = (tile1: Tile, tile2: Tile): number => {
  if (isSpecialPair(tile1, tile2)) {
    const pairKey = Object.keys(SPECIAL_PAIRS).find(key => {
      const pair = SPECIAL_PAIRS[key as keyof typeof SPECIAL_PAIRS];
      return (pair.tiles.includes(tile1.id) && pair.tiles.includes(tile2.id));
    });
    if (pairKey) {
      return 1000 - SPECIAL_PAIRS[pairKey as keyof typeof SPECIAL_PAIRS].rank;
    }
  }
  
  // For non-pair hands, return the hand value (0-9)
  return calculateHandValue(tile1, tile2);
};

export const compareHands = (
  hand1: [Tile, Tile],
  hand2: [Tile, Tile]
): number => {
  const strength1 = getHandStrength(hand1[0], hand1[1]);
  const strength2 = getHandStrength(hand2[0], hand2[1]);
  
  if (strength1 > strength2) return 1;
  if (strength1 < strength2) return -1;
  
  // If same strength, compare individual tile ranks
  const maxRank1 = Math.max(hand1[0].rank, hand1[1].rank);
  const maxRank2 = Math.max(hand2[0].rank, hand2[1].rank);
  
  if (maxRank1 < maxRank2) return 1; // Lower rank number = higher strength
  if (maxRank1 > maxRank2) return -1;
  
  return 0; // Tie - dealer wins
};

export const getHandDescription = (tile1: Tile, tile2: Tile): string => {
  // Check for special pairs first
  const specialPairName = getSpecialPairName(tile1, tile2);
  if (specialPairName) {
    return specialPairName;
  }
  
  // Check for regular pairs
  if (isPair(tile1, tile2)) {
    return `双${tile1.name.replace('牌', '')}`;
  }
  
  // Regular hand value
  const value = calculateHandValue(tile1, tile2);
  return `${value}点`;
};

export const getOptimalHandArrangement = (tiles: Tile[]): {
  highHand: [Tile, Tile];
  lowHand: [Tile, Tile];
} => {
  if (tiles.length !== 4) {
    throw new Error('Must have exactly 4 tiles');
  }
  
  const [tile1, tile2, tile3, tile4] = tiles;
  
  // Generate all possible combinations
  const combinations = [
    { high: [tile1, tile2], low: [tile3, tile4] },
    { high: [tile1, tile3], low: [tile2, tile4] },
    { high: [tile1, tile4], low: [tile2, tile3] },
  ];
  
  // Evaluate each combination
  let bestCombination = combinations[0];
  let bestScore = -1;
  
  for (const combo of combinations) {
    const highStrength = getHandStrength(combo.high[0], combo.high[1]);
    const lowStrength = getHandStrength(combo.low[0], combo.low[1]);
    
    // High hand must be stronger than or equal to low hand
    if (highStrength >= lowStrength) {
      const score = highStrength * 100 + lowStrength;
      if (score > bestScore) {
        bestScore = score;
        bestCombination = combo;
      }
    }
  }
  
  return {
    highHand: [bestCombination.high[0], bestCombination.high[1]],
    lowHand: [bestCombination.low[0], bestCombination.low[1]],
  };
};