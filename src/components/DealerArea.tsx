import React from 'react';
import styled from 'styled-components';
import { Tile } from './Tile';
import { Tile as TileType } from '../types';

interface DealerAreaProps {
  tiles: TileType[];
  isRevealed: boolean;
  highHand?: TileType[];
  lowHand?: TileType[];
}

const DealerContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px;
`;

const DealerLabel = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #FFD700;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid rgba(255, 215, 0, 0.5);
`;

const HandsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

const HandRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const HandLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  width: 40px;
  text-align: center;
`;

const TilesRow = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const DealerArea: React.FC<DealerAreaProps> = ({ 
  tiles, 
  isRevealed, 
  highHand, 
  lowHand 
}) => {
  if (!isRevealed && (!highHand || !lowHand)) {
    return (
      <DealerContainer>
        <DealerLabel>Dealer</DealerLabel>
        <TilesRow>
          {tiles.map((tile, idx) => (
            <Tile 
              key={`${tile.id}-${idx}`} 
              tile={tile} 
              isFlipped={true}
              style={{ transform: 'scale(0.8)' }}
            />
          ))}
        </TilesRow>
      </DealerContainer>
    );
  }
  
  return (
    <DealerContainer>
      <DealerLabel>Dealer</DealerLabel>
      <HandsContainer>
        {highHand && (
          <HandRow>
            <HandLabel>High</HandLabel>
            <TilesRow>
              {highHand.map((tile, idx) => (
                <Tile 
                  key={`high-${tile.id}-${idx}`} 
                  tile={tile} 
                  style={{ transform: 'scale(0.8)' }}
                />
              ))}
            </TilesRow>
          </HandRow>
        )}
        
        {lowHand && (
          <HandRow>
            <HandLabel>Low</HandLabel>
            <TilesRow>
              {lowHand.map((tile, idx) => (
                <Tile 
                  key={`low-${tile.id}-${idx}`} 
                  tile={tile} 
                  style={{ transform: 'scale(0.8)' }}
                />
              ))}
            </TilesRow>
          </HandRow>
        )}
        
        {!highHand && !lowHand && isRevealed && (
          <TilesRow>
            {tiles.map((tile, idx) => (
              <Tile 
                key={`${tile.id}-${idx}`} 
                tile={tile} 
                style={{ transform: 'scale(0.8)' }}
              />
            ))}
          </TilesRow>
        )}
      </HandsContainer>
    </DealerContainer>
  );
};