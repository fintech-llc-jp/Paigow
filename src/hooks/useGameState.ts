import { create } from 'zustand';
import { GameState, Player, Tile } from '../types';
import { createDeck, shuffleDeck, getOptimalHandArrangement } from '../utils';
import { GAME_RULES } from '../constants';
import { determineGameResult, calculatePayout } from '../utils/gameLogic';
import { soundManager, initializeSounds } from '../utils/soundUtils';

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void;
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  placeBet: (playerId: string, amount: number) => void;
  dealCards: () => void;
  arrangePlayerHand: (playerId: string, highHand: Tile[], lowHand: Tile[]) => void;
  autoArrangePlayerHand: (playerId: string) => void;
  setPlayerReady: (playerId: string) => void;
  compareHands: () => void;
  nextRound: () => void;
  resetGame: () => void;
  moveTilesToHand: (playerId: string, tileIds: string[], targetHand: 'high' | 'low') => void;
  removeTileFromHand: (playerId: string, tileId: string, fromHand: 'high' | 'low') => void;
}

const createInitialState = (): GameState => ({
  phase: 'betting',
  players: [],
  dealer: {
    tiles: [],
    highHand: [],
    lowHand: [],
    isRevealed: false,
  },
  deck: createDeck(),
  currentPlayer: 0,
  pot: 0,
  round: 1,
  isGameActive: false,
});

export const useGameState = create<GameStore>((set, get) => ({
  ...createInitialState(),
  
  initializeGame: () => {
    const shuffled = shuffleDeck(createDeck());
    set({
      ...createInitialState(),
      deck: shuffled,
      isGameActive: true,
    });
  },
  
  addPlayer: (name: string) => {
    const { players } = get();
    if (players.length >= GAME_RULES.MAX_PLAYERS) return;
    
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random()}`,
      name,
      chips: GAME_RULES.BETTING.DEFAULT_CHIPS,
      currentBet: 0,
      hand: [],
      highHand: [],
      lowHand: [],
      isActive: true,
      isDealer: false,
      position: players.length,
      isReady: false,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalWinnings: 0,
        bestHand: '',
        winRate: 0,
      },
    };
    
    set({ players: [...players, newPlayer] });
  },
  
  removePlayer: (playerId: string) => {
    const { players } = get();
    const updatedPlayers = players.filter(p => p.id !== playerId)
      .map((p, index) => ({ ...p, position: index }));
    set({ players: updatedPlayers });
  },
  
  placeBet: (playerId: string, amount: number) => {
    const { players, phase } = get();
    if (phase !== 'betting') return;
    
    const updatedPlayers = players.map(player => {
      if (player.id === playerId && player.chips >= amount) {
        return {
          ...player,
          currentBet: player.currentBet + amount,
          chips: player.chips - amount,
        };
      }
      return player;
    });
    
    const totalBets = updatedPlayers.reduce((sum, p) => sum + p.currentBet, 0);
    set({ players: updatedPlayers, pot: totalBets });
  },
  
  dealCards: () => {
    const { players, deck, phase } = get();
    console.log('dealCards called', { phase, playersCount: players.length, deckSize: deck.length });
    
    // Initialize sounds on first user interaction
    initializeSounds();
    
    if (phase !== 'betting') {
      console.log('Wrong phase for dealing:', phase);
      return;
    }
    
    const activePlayers = players.filter(p => p.isActive && p.currentBet > 0);
    console.log('Active players with bets:', activePlayers.length);
    
    if (activePlayers.length === 0) {
      console.log('No active players with bets');
      return;
    }
    
    // Play deal sound
    soundManager.playSound('deal');
    
    let currentDeck = [...deck];
    console.log('Shuffled deck size:', currentDeck.length);
    
    const updatedPlayers = players.map(player => {
      if (player.isActive && player.currentBet > 0) {
        const playerTiles = currentDeck.splice(0, GAME_RULES.TILES_PER_PLAYER);
        console.log(`Dealing ${playerTiles.length} tiles to ${player.name}`);
        return {
          ...player,
          hand: playerTiles,
          highHand: [],
          lowHand: [],
          isReady: false,
        };
      }
      return player;
    });
    
    // Deal dealer cards
    const dealerTiles = currentDeck.splice(0, GAME_RULES.TILES_PER_PLAYER);
    console.log('Dealing dealer tiles:', dealerTiles.length);
    
    console.log('Setting new game state to arranging phase');
    set({
      players: updatedPlayers,
      dealer: {
        tiles: dealerTiles,
        highHand: [],
        lowHand: [],
        isRevealed: false,
      },
      deck: currentDeck,
      phase: 'arranging',
    });
  },
  
  arrangePlayerHand: (playerId: string, highHand: Tile[], lowHand: Tile[]) => {
    const { players, phase } = get();
    console.log('arrangePlayerHand called:', { playerId, phase, highHandSize: highHand.length, lowHandSize: lowHand.length });
    
    if (phase !== 'arranging') {
      console.log('Wrong phase for arranging:', phase);
      return;
    }
    
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        const newPlayer = {
          ...player,
          highHand,
          lowHand,
          hand: player.hand.filter(tile => 
            !highHand.includes(tile) && !lowHand.includes(tile)
          ),
        };
        console.log('Updated player:', { 
          name: newPlayer.name,
          handSize: newPlayer.hand.length,
          highHandSize: newPlayer.highHand.length,
          lowHandSize: newPlayer.lowHand.length
        });
        return newPlayer;
      }
      return player;
    });
    
    set({ players: updatedPlayers });
  },
  
  autoArrangePlayerHand: (playerId: string) => {
    const { players } = get();
    const player = players.find(p => p.id === playerId);
    console.log('autoArrangePlayerHand called for:', { playerId, player: player?.name, handSize: player?.hand.length });
    
    if (!player || player.hand.length !== 4) {
      console.log('Cannot auto arrange - invalid player or hand size');
      return;
    }
    
    const arrangement = getOptimalHandArrangement(player.hand);
    console.log('Optimal arrangement:', { 
      highHand: arrangement.highHand.map(t => t.name), 
      lowHand: arrangement.lowHand.map(t => t.name) 
    });
    
    get().arrangePlayerHand(playerId, Array.from(arrangement.highHand), Array.from(arrangement.lowHand));
  },
  
  setPlayerReady: (playerId: string) => {
    const { players } = get();
    const player = players.find(p => p.id === playerId);
    console.log('setPlayerReady called for:', { 
      playerId, 
      playerName: player?.name, 
      highHand: player?.highHand.length, 
      lowHand: player?.lowHand.length,
      isReady: player?.isReady
    });
    
    if (!player || player.highHand.length !== 2 || player.lowHand.length !== 2 || player.isReady) {
      console.log('Player not ready - invalid hand arrangement or already ready');
      return;
    }
    
    // Mark player as ready
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, isReady: true } : p
    );
    
    set({ players: updatedPlayers });
    
    // Check if all players are ready
    const activePlayers = updatedPlayers.filter(p => p.isActive && p.currentBet > 0);
    const readyPlayers = activePlayers.filter(p => 
      p.highHand.length === 2 && p.lowHand.length === 2 && p.isReady
    );
    
    console.log('Ready check:', { activePlayers: activePlayers.length, readyPlayers: readyPlayers.length });
    
    if (readyPlayers.length === activePlayers.length) {
      console.log('All players ready - moving to comparing phase');
      set({ phase: 'comparing' });
      setTimeout(() => {
        console.log('Starting hand comparison');
        get().compareHands();
      }, 1500);
    }
  },
  
  compareHands: () => {
    const { players, dealer } = get();
    console.log('compareHands started');
    
    // Arrange dealer hand
    const dealerArrangement = getOptimalHandArrangement(dealer.tiles);
    console.log('Dealer arrangement:', {
      highHand: dealerArrangement.highHand.map(t => t.name),
      lowHand: dealerArrangement.lowHand.map(t => t.name)
    });
    
    // Update dealer
    const updatedDealer = {
      ...dealer,
      highHand: Array.from(dealerArrangement.highHand),
      lowHand: Array.from(dealerArrangement.lowHand),
      isRevealed: true,
    };
    
    // Calculate results and update players
    const updatedPlayers = players.map(player => {
      if (player.isActive && player.currentBet > 0) {
        if (player.highHand.length !== 2 || player.lowHand.length !== 2) {
          // Player hasn't arranged their hand properly - automatic loss
          const payout = -player.currentBet;
          
          console.log('Player result (invalid hand):', { 
            name: player.name, 
            result: 'lose', 
            payout,
            originalBet: player.currentBet 
          });
          
          return {
            ...player,
            chips: player.chips + payout,
            currentBet: 0,
            stats: {
              ...player.stats,
              gamesPlayed: player.stats.gamesPlayed + 1,
              gamesWon: player.stats.gamesWon,
              totalWinnings: player.stats.totalWinnings + payout,
              winRate: (player.stats.gamesWon / (player.stats.gamesPlayed + 1)) * 100,
            },
          };
        }
        
        // Use proper Paigow logic
        const playerHighHand: [Tile, Tile] = [player.highHand[0], player.highHand[1]];
        const playerLowHand: [Tile, Tile] = [player.lowHand[0], player.lowHand[1]];
        const dealerHighHand: [Tile, Tile] = [updatedDealer.highHand[0], updatedDealer.highHand[1]];
        const dealerLowHand: [Tile, Tile] = [updatedDealer.lowHand[0], updatedDealer.lowHand[1]];
        
        const gameResult = determineGameResult(
          playerHighHand,
          playerLowHand,
          dealerHighHand,
          dealerLowHand
        );
        
        const payout = calculatePayout(player.currentBet, gameResult.result);
        
        console.log('Player result:', { 
          name: player.name, 
          result: gameResult.result,
          highWin: gameResult.highWin,
          lowWin: gameResult.lowWin,
          payout,
          originalBet: player.currentBet 
        });
        
        return {
          ...player,
          chips: player.chips + payout + (gameResult.result !== 'lose' ? player.currentBet : 0),
          currentBet: 0,
          stats: {
            ...player.stats,
            gamesPlayed: player.stats.gamesPlayed + 1,
            gamesWon: player.stats.gamesWon + (gameResult.result === 'win' ? 1 : 0),
            totalWinnings: player.stats.totalWinnings + payout,
            winRate: ((player.stats.gamesWon + (gameResult.result === 'win' ? 1 : 0)) / (player.stats.gamesPlayed + 1)) * 100,
          },
        };
      }
      return player;
    });
    
    // Play sound effects based on results
    const activeResults = updatedPlayers
      .filter(p => p.isActive)
      .map(p => {
        const originalPlayer = players.find(orig => orig.id === p.id);
        if (!originalPlayer) return null;
        
        // Determine result by comparing chips change
        const chipsChange = p.chips - originalPlayer.chips;
        if (chipsChange > 0) return 'win';
        if (chipsChange < 0) return 'lose';
        return 'push';
      })
      .filter(Boolean);
    
    // Play sound for the most common result, or win if player won
    if (activeResults.includes('win')) {
      soundManager.playSound('win');
    } else if (activeResults.includes('push')) {
      soundManager.playSound('push');
    } else if (activeResults.includes('lose')) {
      soundManager.playSound('lose');
    }
    
    console.log('Setting phase to result');
    set({
      players: updatedPlayers,
      dealer: updatedDealer,
      phase: 'result',
      pot: 0,
    });
  },
  
  nextRound: () => {
    const { round } = get();
    const shuffled = shuffleDeck(createDeck());
    
    set({
      phase: 'betting',
      dealer: {
        tiles: [],
        highHand: [],
        lowHand: [],
        isRevealed: false,
      },
      deck: shuffled,
      round: round + 1,
      players: get().players.map(player => ({
        ...player,
        hand: [],
        highHand: [],
        lowHand: [],
        currentBet: 0,
        isReady: false,
      })),
    });
  },
  
  resetGame: () => {
    set(createInitialState());
  },
  
  moveTilesToHand: (playerId: string, tileIds: string[], targetHand: 'high' | 'low') => {
    const { players, phase } = get();
    if (phase !== 'arranging') return;
    
    console.log('moveTilesToHand:', { playerId, tileIds, targetHand });
    
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        const tilesToMove = player.hand.filter(tile => tileIds.includes(tile.id));
        const currentTargetHand = targetHand === 'high' ? player.highHand : player.lowHand;
        
        if (currentTargetHand.length + tilesToMove.length > 2) {
          console.log('Cannot move tiles - would exceed 2 tiles per hand');
          return player;
        }
        
        const newHand = player.hand.filter(tile => !tileIds.includes(tile.id));
        const newHighHand = targetHand === 'high' 
          ? [...player.highHand, ...tilesToMove]
          : player.highHand;
        const newLowHand = targetHand === 'low' 
          ? [...player.lowHand, ...tilesToMove]
          : player.lowHand;
        
        return {
          ...player,
          hand: newHand,
          highHand: newHighHand,
          lowHand: newLowHand,
        };
      }
      return player;
    });
    
    set({ players: updatedPlayers });
  },
  
  removeTileFromHand: (playerId: string, tileId: string, fromHand: 'high' | 'low') => {
    const { players, phase } = get();
    if (phase !== 'arranging') return;
    
    console.log('removeTileFromHand:', { playerId, tileId, fromHand });
    
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        const sourceHand = fromHand === 'high' ? player.highHand : player.lowHand;
        const tileToMove = sourceHand.find(tile => tile.id === tileId);
        
        if (!tileToMove) return player;
        
        const newHighHand = fromHand === 'high' 
          ? player.highHand.filter(tile => tile.id !== tileId)
          : player.highHand;
        const newLowHand = fromHand === 'low' 
          ? player.lowHand.filter(tile => tile.id !== tileId)
          : player.lowHand;
        
        return {
          ...player,
          hand: [...player.hand, tileToMove],
          highHand: newHighHand,
          lowHand: newLowHand,
        };
      }
      return player;
    });
    
    set({ players: updatedPlayers });
  },
}));