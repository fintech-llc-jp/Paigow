import React from 'react';
import styled from 'styled-components';
import { PlayerSeat } from './PlayerSeat';
import { DealerArea } from './DealerArea';
import { Player } from '../types';

interface GameTableProps {
  players: Player[];
  dealerTiles: any[];
  currentPlayer: number;
  onPlayerAction: (playerId: string, action: any) => void;
  phase: string;
  dealer: any;
}

const TableContainer = styled.div`
  width: min(1200px, 95vw);
  height: min(900px, 70vh);
  background: linear-gradient(135deg, #0F5132 0%, #1a6b47 100%);
  border: 4px solid #FFD700;
  border-radius: 400px 400px 50px 50px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: visible;
  
  @media (max-width: 768px) {
    width: 95vw;
    height: 60vh;
    min-height: 400px;
    border-radius: 200px 200px 25px 25px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    width: 98vw;
    height: 50vh;
    min-height: 350px;
    border-radius: 150px 150px 20px 20px;
  }
`;

const TableSurface = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, #0F5132 0%, #0a3d26 100%);
  border-radius: 396px 396px 46px 46px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 80%;
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 300px 300px 30px 30px;
  }
`;

const PlayerSeatsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 380px;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 0 40px 10px 40px;
  overflow: visible;
`;

const DealerContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 150px;
`;

const GameInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  
  h3 {
    margin: 0 0 5px 0;
    color: #FFD700;
  }
  
  div {
    margin: 2px 0;
  }
`;

const ActionPanel = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 15px;
  border-radius: 8px;
  min-width: 200px;
`;

export const GameTable: React.FC<GameTableProps> = ({
  players,
  dealerTiles,
  currentPlayer,
  onPlayerAction,
  phase,
  dealer
}) => {
  const maxSeats = 4;
  const seatPositions = Array.from({ length: maxSeats }, (_, i) => i);
  
  console.log('GameTable render:', { 
    playersCount: players.length, 
    currentPlayer, 
    activePlayers: players.filter(p => p.isActive).length 
  });
  
  return (
    <TableContainer>
      <TableSurface>
        <GameInfo>
          <h3>牌九 - Paigow</h3>
          <div>Round: 1</div>
          <div>Players: {players.filter(p => p.isActive).length}/4</div>
          <div>Pot: $0</div>
        </GameInfo>
        
        <DealerContainer>
          <DealerArea 
            tiles={dealerTiles}
            isRevealed={phase === 'comparing' || phase === 'result'}
            highHand={dealer.highHand}
            lowHand={dealer.lowHand}
          />
        </DealerContainer>
        
        <PlayerSeatsContainer>
          {seatPositions.map(position => {
            const player = players.find(p => p.position === position);
            return (
              <PlayerSeat
                key={position}
                player={player}
                position={position}
                isCurrentPlayer={true} // For single player mode, always true
                onAction={(action) => player && onPlayerAction(player.id, action)}
              />
            );
          })}
        </PlayerSeatsContainer>
        
        <ActionPanel>
          <div>Actions</div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            Select tiles to arrange your hand
          </div>
        </ActionPanel>
      </TableSurface>
    </TableContainer>
  );
};