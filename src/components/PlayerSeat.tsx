import React from 'react';
import styled from 'styled-components';
import { Player } from '../types';
import { Tile } from './Tile';
import { TILE_DIMENSIONS } from '../constants/tiles';

interface PlayerSeatProps {
  player?: Player;
  position: number;
  isCurrentPlayer: boolean;
  onAction: (action: any) => void;
}


const SeatContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isActive', 'isCurrentPlayer'].includes(prop),
})<{ isActive: boolean; isCurrentPlayer: boolean }>`
  width: 240px;
  min-height: 320px;
  background: ${props => props.isActive 
    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)'
    : 'rgba(0, 0, 0, 0.2)'};
  border: 2px solid ${props => props.isCurrentPlayer 
    ? '#FFD700' 
    : props.isActive 
      ? 'rgba(255, 215, 0, 0.3)' 
      : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  position: relative;
  transition: all 0.3s ease;
  overflow: visible;
  z-index: 1;
  
  ${props => props.isCurrentPlayer && `
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    z-index: 10;
  `}
`;

const PlayerInfo = styled.div`
  color: white;
  text-align: center;
  margin-bottom: 8px;
  font-size: 12px;
`;

const PlayerName = styled.div`
  font-weight: bold;
  margin-bottom: 2px;
`;

const PlayerChips = styled.div`
  color: #FFD700;
  font-size: 11px;
`;

const PlayerBet = styled.div`
  color: #90EE90;
  font-size: 11px;
`;

const HandArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  flex: 1;
  width: 100%;
  overflow: visible;
`;

const HandRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const HandLabel = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  width: 40px;
  text-align: center;
`;

const EmptySlot = styled.div`
  width: 40px;
  height: 55px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
`;

const EmptySeat = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  border: 2px solid #FFD700;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  
  &:hover {
    background: linear-gradient(135deg, #FFA500, #FFD700);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  
  &:disabled {
    background: rgba(128, 128, 128, 0.5);
    color: rgba(255, 255, 255, 0.5);
    border-color: rgba(128, 128, 128, 0.5);
    cursor: not-allowed;
    transform: none;
  }
`;

export const PlayerSeat: React.FC<PlayerSeatProps> = ({ 
  player, 
  position, 
  isCurrentPlayer, 
  onAction 
}) => {
  const [selectedTiles, setSelectedTiles] = React.useState<string[]>([]);
  
  // Debug logging
  console.log('PlayerSeat render:', { 
    playerName: player?.name, 
    handSize: player?.hand?.length || 0, 
    position, 
    isCurrentPlayer,
    selectedTiles: selectedTiles.length
  });
  
  const handleTileClick = (tileId: string) => {
    setSelectedTiles(prev => {
      if (prev.includes(tileId)) {
        return prev.filter(id => id !== tileId);
      } else {
        return [...prev, tileId];
      }
    });
  };
  
  const handleHandAreaClick = (handType: 'high' | 'low') => {
    if (selectedTiles.length === 0) return;
    
    const targetHandSize = handType === 'high' ? player?.highHand.length || 0 : player?.lowHand.length || 0;
    const maxTiles = 2 - targetHandSize;
    
    if (selectedTiles.length <= maxTiles) {
      onAction({ 
        type: 'move_tiles_to_hand', 
        tileIds: selectedTiles, 
        targetHand: handType 
      });
      setSelectedTiles([]);
    }
  };
  
  const handleTileRemove = (tileId: string, fromHand: 'high' | 'low') => {
    onAction({ 
      type: 'remove_tile_from_hand', 
      tileId, 
      fromHand 
    });
  };
  
  if (!player) {
    return (
      <SeatContainer isActive={false} isCurrentPlayer={false}>
        <EmptySeat>
          Seat {position + 1}<br />
          <small>Click to Join</small>
        </EmptySeat>
      </SeatContainer>
    );
  }
  
  return (
    <SeatContainer isActive={player.isActive} isCurrentPlayer={isCurrentPlayer}>
      <PlayerInfo>
        <PlayerName>{player.name}</PlayerName>
        <PlayerChips>${player.chips}</PlayerChips>
        {player.currentBet > 0 && (
          <PlayerBet>Bet: ${player.currentBet}</PlayerBet>
        )}
      </PlayerInfo>
      
      <HandArea>
        <HandRow>
          <HandLabel style={{ fontSize: '12px', fontWeight: 'bold' }}>High ({player.highHand.length}/2)</HandLabel>
          <div 
            style={{ 
              display: 'flex', 
              gap: '6px', 
              minHeight: '60px', 
              padding: '6px',
              border: selectedTiles.length > 0 ? '3px dashed #FFD700' : '2px solid rgba(255,255,255,0.4)',
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.3)',
              cursor: selectedTiles.length > 0 && player.highHand.length < 2 ? 'pointer' : 'default'
            }}
            onClick={() => handleHandAreaClick('high')}
          >
            {player.highHand.length > 0 ? (
              player.highHand.map((tile) => (
                <Tile
                  key={tile.id}
                  tile={tile}
                  onClick={() => handleTileRemove(tile.id, 'high')}
                  style={{
                    width: `${TILE_DIMENSIONS.WIDTH * 0.7}px`,
                    height: `${TILE_DIMENSIONS.HEIGHT * 0.7}px`,
                  }}
                />
              ))
            ) : (
              <div style={{ 
                display: 'flex', 
                gap: '2px', 
                opacity: 0.5 
              }}>
                <EmptySlot />
                <EmptySlot />
              </div>
            )}
          </div>
        </HandRow>
        
        <HandRow>
          <HandLabel style={{ fontSize: '12px', fontWeight: 'bold' }}>Low ({player.lowHand.length}/2)</HandLabel>
          <div 
            style={{ 
              display: 'flex', 
              gap: '6px', 
              minHeight: '60px', 
              padding: '6px',
              border: selectedTiles.length > 0 ? '3px dashed #FFD700' : '2px solid rgba(255,255,255,0.4)',
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.3)',
              cursor: selectedTiles.length > 0 && player.lowHand.length < 2 ? 'pointer' : 'default'
            }}
            onClick={() => handleHandAreaClick('low')}
          >
            {player.lowHand.length > 0 ? (
              player.lowHand.map((tile) => (
                <Tile
                  key={tile.id}
                  tile={tile}
                  onClick={() => handleTileRemove(tile.id, 'low')}
                  style={{
                    width: `${TILE_DIMENSIONS.WIDTH * 0.7}px`,
                    height: `${TILE_DIMENSIONS.HEIGHT * 0.7}px`,
                  }}
                />
              ))
            ) : (
              <div style={{ 
                display: 'flex', 
                gap: '2px', 
                opacity: 0.5 
              }}>
                <EmptySlot />
                <EmptySlot />
              </div>
            )}
          </div>
        </HandRow>
        
        <div style={{ width: '100%', marginBottom: '8px', position: 'relative', zIndex: 20 }}>
          <HandLabel style={{ marginBottom: '6px', fontSize: '12px' }}>Hand({player.hand.length})</HandLabel>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '6px', 
            minHeight: '80px', 
            border: '2px solid rgba(255,255,255,0.5)', 
            borderRadius: '8px',
            padding: '6px',
            background: 'rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'visible'
          }}>
            {player.hand.length > 0 ? (
              player.hand.map((tile, index) => {
                const isSelected = selectedTiles.includes(tile.id);
                console.log('Rendering tile:', tile, 'selected:', isSelected);
                return (
                  <Tile 
                    key={tile.id || index}
                    tile={tile}
                    isSelected={isSelected}
                    onClick={() => handleTileClick(tile.id)}
                    style={{
                      width: '100%',
                      height: '55px',
                      boxShadow: isSelected 
                        ? '0 6px 12px rgba(255,215,0,0.6)'
                        : '0 2px 4px rgba(0,0,0,0.2)',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      zIndex: isSelected ? 10 : 1,
                    }}
                  />
                );
              })
            ) : (
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '10px', 
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '8px'
              }}>No cards</div>
            )}
          </div>
        </div>
      </HandArea>
      
      <ActionButtons>
        {player.hand.length > 0 && (
          <ActionButton 
            onClick={() => {
              console.log('Auto arrange clicked for:', player.name);
              onAction({ type: 'auto_arrange' });
              setSelectedTiles([]); // Clear selection after auto arrange
            }}
          >
            Auto
          </ActionButton>
        )}
        {selectedTiles.length > 0 && (
          <ActionButton 
            onClick={() => {
              setSelectedTiles([]);
            }}
            style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)' }}
          >
            Clear
          </ActionButton>
        )}
        {(player.highHand.length === 2 && player.lowHand.length === 2) && (
          <ActionButton 
            onClick={() => {
              console.log('Ready clicked for:', player.name, { highHand: player.highHand.length, lowHand: player.lowHand.length });
              onAction({ type: 'ready' });
            }}
          >
            Ready
          </ActionButton>
        )}
      </ActionButtons>
    </SeatContainer>
  );
};