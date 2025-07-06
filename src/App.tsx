import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GameTable } from './components';
import { useGameState } from './hooks';
import { GAME_RULES } from './constants';
import { getHandDescription } from './utils/tileUtils';
import { soundManager } from './utils/soundUtils';

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding: 5px;
    min-height: 100vh;
    height: auto;
  }
`;

const GameHeader = styled.div`
  margin-bottom: 15px;
  text-align: center;
  color: white;
  
  h1 {
    margin: 0;
    font-size: 2.5rem;
    background: linear-gradient(45deg, #FFD700, #FFA500);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
  
  p {
    margin: 5px 0 0 0;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const GameControls = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  padding: 0 10px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    margin-top: 10px;
    gap: 8px;
    padding: 0 5px;
  }
`;

const ControlButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 12px;
    min-width: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 11px;
    min-width: 80px;
  }
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #6c757d, #5a6268);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const GamePhaseIndicator = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #FFD700;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 15px;
    border-width: 1px;
  }
  
  @media (max-width: 480px) {
    top: 5px;
    right: 5px;
    padding: 4px 8px;
    font-size: 10px;
    border-radius: 10px;
  }
`;

const BettingPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  min-width: 280px;
  max-width: 400px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  
  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    left: auto;
    width: 90%;
    min-width: unset;
    max-width: unset;
    margin: 10px auto 0;
    padding: 12px;
    max-height: 250px;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    padding: 10px;
    margin: 5px auto 0;
    max-height: 200px;
  }
`;

const ChipButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'amount',
})<{ amount: number }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #FFD700;
  background: ${props => {
    const colors = {
      5: '#ff6b6b',
      10: '#4ecdc4',
      25: '#45b7d1',
      50: '#f9ca24',
      100: '#6c5ce7',
      500: '#fd79a8',
    };
    return colors[props.amount as keyof typeof colors] || '#95a5a6';
  }};
  color: white;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  margin: 2px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 10px;
    border-width: 2px;
    margin: 1px;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 9px;
    border-width: 1px;
  }
`;

const App: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const {
    phase,
    players,
    dealer,
    currentPlayer,
    round,
    initializeGame,
    addPlayer,
    placeBet,
    dealCards,
    nextRound,
    resetGame,
  } = useGameState();
  
  // Debug logging
  console.log('Game State:', { phase, players: players.length, activePlayers: players.filter(p => p.isActive).length });

  useEffect(() => {
    const gameState = useGameState.getState();
    if (gameState.players.length === 0) {
      initializeGame();
      // Add one demo player for single player mode
      addPlayer('You');
    }
  }, []);

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    soundManager.setEnabled(newSoundEnabled);
  };

  const handlePlayerAction = (playerId: string, action: any) => {
    const gameState = useGameState.getState();
    
    switch (action.type) {
      case 'bet':
        gameState.placeBet(playerId, action.amount);
        break;
      case 'auto_arrange':
        gameState.autoArrangePlayerHand(playerId);
        break;
      case 'ready':
        gameState.setPlayerReady(playerId);
        break;
      case 'move_tiles_to_hand':
        gameState.moveTilesToHand(playerId, action.tileIds, action.targetHand);
        break;
      case 'remove_tile_from_hand':
        gameState.removeTileFromHand(playerId, action.tileId, action.fromHand);
        break;
      default:
        break;
    }
  };

  const handlePlaceBet = (playerId: string, amount: number) => {
    placeBet(playerId, amount);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'betting':
        return 'Place Your Bets';
      case 'dealing':
        return 'Dealing Cards';
      case 'arranging':
        return 'Arrange Your Hand';
      case 'comparing':
        return 'Comparing Hands';
      case 'result':
        return 'Round Results';
      default:
        return 'Game Ready';
    }
  };

  const activePlayers = players.filter(p => p.isActive);

  return (
    <AppContainer>
      <GameHeader>
        <h1>牌九 - Paigow Casino</h1>
        <p>Traditional Chinese Tile Game</p>
      </GameHeader>
      
      <GamePhaseIndicator>
        {getPhaseText()} - Round {round}
      </GamePhaseIndicator>
      
      <GameTable
        players={players}
        dealerTiles={dealer.tiles}
        currentPlayer={currentPlayer}
        onPlayerAction={handlePlayerAction}
        phase={phase}
        dealer={dealer}
      />
      
      <GameControls>
        {phase === 'betting' && (
          <>
            <ControlButton
              variant="primary"
              onClick={dealCards}
              disabled={activePlayers.length === 0 || activePlayers.every(p => p.currentBet === 0)}
            >
              Deal Cards
            </ControlButton>
            <ControlButton onClick={() => addPlayer(`Player ${players.length + 1}`)}>
              Add Player
            </ControlButton>
          </>
        )}
        
        {phase === 'arranging' && (
          <div style={{ textAlign: 'center', color: 'white', background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px' }}>
            <h3 style={{ color: '#FFD700', margin: '0 0 10px 0' }}>Arrange Your Hand</h3>
            <p style={{ margin: '3px 0', fontSize: '13px' }}>You have 4 tiles. Arrange them into High and Low hands (2 tiles each).</p>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Manual:</strong> Click tiles to select, then click High/Low area to move them</p>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Auto:</strong> Click "Auto" to arrange automatically</p>
            <p style={{ margin: '3px 0', fontSize: '12px' }}>Click "Ready" when both hands have 2 tiles</p>
          </div>
        )}
        
        {phase === 'comparing' && (
          <div style={{ textAlign: 'center', color: 'white', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ color: '#FFD700', margin: '0 0 10px 0' }}>Comparing Hands...</h3>
            <p>Dealer is revealing their tiles</p>
          </div>
        )}
        
        {phase === 'result' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', marginBottom: '15px', color: 'white', maxWidth: '600px', margin: '0 auto 15px auto' }}>
              <h3 style={{ color: '#FFD700', margin: '0 0 15px 0' }}>Round Results</h3>
              
              {/* Dealer's Hand */}
              {dealer.highHand.length === 2 && dealer.lowHand.length === 2 && (
                <div style={{ margin: '15px 0', padding: '15px', border: '2px solid #FFD700', borderRadius: '8px', backgroundColor: 'rgba(255,215,0,0.1)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>ディーラー</div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#FFD700' }}>高手:</div>
                      <div>{getHandDescription(dealer.highHand[0], dealer.highHand[1])}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#FFD700' }}>低手:</div>
                      <div>{getHandDescription(dealer.lowHand[0], dealer.lowHand[1])}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Player Results */}
              {players.filter(p => p.isActive).map(player => {
                const hasValidHands = player.highHand.length === 2 && player.lowHand.length === 2;
                return (
                  <div key={player.id} style={{ margin: '15px 0', padding: '15px', border: '1px solid #FFD700', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>{player.name}</div>
                    
                    {hasValidHands && (
                      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#FFD700' }}>高手:</div>
                          <div>{getHandDescription(player.highHand[0], player.highHand[1])}</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#FFD700' }}>低手:</div>
                          <div>{getHandDescription(player.lowHand[0], player.lowHand[1])}</div>
                        </div>
                      </div>
                    )}
                    
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      <div>Chips: ${player.chips}</div>
                      <div>Games Won: {player.stats.gamesWon}/{player.stats.gamesPlayed}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ControlButton variant="primary" onClick={nextRound}>
              Next Round
            </ControlButton>
          </div>
        )}
        
        <ControlButton onClick={toggleSound}>
          Sound: {soundEnabled ? 'ON' : 'OFF'}
        </ControlButton>
        
        <ControlButton variant="danger" onClick={resetGame}>
          Reset Game
        </ControlButton>
      </GameControls>
      
      {(phase === 'betting' || phase === 'arranging') && activePlayers.length > 0 && (
        <BettingPanel>
          <h4>{phase === 'betting' ? 'Place Your Bets' : 'Game Status'}</h4>
          {activePlayers.map(player => (
            <div key={player.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{player.name}</div>
              <div style={{ fontSize: '12px', marginBottom: '8px' }}>Chips: ${player.chips} | Bet: ${player.currentBet}</div>
              <div style={{ fontSize: '11px', color: '#FFD700' }}>Hand: {player.hand.length} tiles</div>
              {phase === 'betting' && (
                <div>
                  {GAME_RULES.BETTING.CHIP_DENOMINATIONS.map(amount => (
                    <ChipButton
                      key={amount}
                      amount={amount}
                      onClick={() => handlePlaceBet(player.id, amount)}
                      disabled={player.chips < amount}
                    >
                      ${amount}
                    </ChipButton>
                  ))}
                </div>
              )}
            </div>
          ))}
        </BettingPanel>
      )}
    </AppContainer>
  );
};

export default App;