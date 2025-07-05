export const GAME_RULES = {
  MAX_PLAYERS: 4,
  TILES_PER_PLAYER: 4,
  TOTAL_TILES: 32,
  HANDS_PER_PLAYER: 2,
  TILES_PER_HAND: 2,
  
  BETTING: {
    MIN_BET: 10,
    MAX_BET: 1000,
    DEFAULT_CHIPS: 1000,
    CHIP_DENOMINATIONS: [5, 10, 25, 50, 100, 500],
  },
  
  PAYOUT: {
    WIN_RATE: 0.95, // 5% house edge
    PUSH_RATE: 0,
    LOSE_RATE: -1,
  },
  
  ANIMATION: {
    DEAL_SPEED: 300,
    FLIP_SPEED: 200,
    MOVE_SPEED: 400,
    FADE_SPEED: 150,
  },
  
  DEALER_RULES: {
    ALWAYS_PLAY_HIGHEST: true,
    SPLIT_STRATEGY: 'house_way',
  },
} as const;

export const GAME_PHASES = {
  BETTING: 'betting',
  DEALING: 'dealing',
  ARRANGING: 'arranging',
  COMPARING: 'comparing',
  RESULT: 'result',
} as const;