import React from 'react';
import styled from 'styled-components';
import { Tile as TileType } from '../types';
import { TILE_COLORS, TILE_DIMENSIONS } from '../constants';

interface TileProps {
  tile: TileType;
  isSelected?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const TileContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'isFlipped', 'isClickable'].includes(prop),
})<{ 
  isSelected: boolean; 
  isFlipped: boolean; 
  isClickable: boolean; 
}>`
  width: ${TILE_DIMENSIONS.WIDTH}px;
  height: ${TILE_DIMENSIONS.HEIGHT}px;
  background-color: ${props => 
    props.isFlipped ? '#654321' : TILE_COLORS.BACKGROUND};
  border: ${TILE_DIMENSIONS.BORDER_WIDTH}px solid ${props => 
    props.isSelected ? TILE_COLORS.SELECTED : TILE_COLORS.BORDER};
  border-radius: ${TILE_DIMENSIONS.BORDER_RADIUS}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  box-shadow: ${props => props.isSelected ? '0 0 10px rgba(255, 215, 0, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)'};
  user-select: none;
  position: relative;
  
  &:hover {
    ${props => props.isClickable && !props.isFlipped && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `}
  }
`;

const DotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 2px;
  width: 90%;
  height: 90%;
  padding: 4px;
`;

const Dot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isRed',
})<{ isRed?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.isRed ? TILE_COLORS.DOT_RED : TILE_COLORS.DOT_BLACK};
`;

const TileName = styled.div`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  font-weight: bold;
  color: ${TILE_COLORS.BORDER};
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1px 3px;
  border-radius: 2px;
  white-space: nowrap;
`;

const BackPattern = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #654321 25%, transparent 25%), 
              linear-gradient(-45deg, #654321 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #654321 75%), 
              linear-gradient(-45deg, transparent 75%, #654321 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  border-radius: ${TILE_DIMENSIONS.BORDER_RADIUS - 2}px;
`;

const generateDotPattern = (dots: number): boolean[] => {
  const pattern: boolean[] = new Array(12).fill(false);
  
  switch (dots) {
    case 1:
      pattern[5] = true;
      break;
    case 2:
      pattern[0] = true;
      pattern[11] = true;
      break;
    case 3:
      pattern[0] = true;
      pattern[5] = true;
      pattern[11] = true;
      break;
    case 4:
      pattern[0] = true;
      pattern[2] = true;
      pattern[9] = true;
      pattern[11] = true;
      break;
    case 5:
      pattern[0] = true;
      pattern[2] = true;
      pattern[5] = true;
      pattern[9] = true;
      pattern[11] = true;
      break;
    case 6:
      pattern[0] = true;
      pattern[2] = true;
      pattern[3] = true;
      pattern[8] = true;
      pattern[9] = true;
      pattern[11] = true;
      break;
    case 7:
      pattern[0] = true;
      pattern[2] = true;
      pattern[3] = true;
      pattern[5] = true;
      pattern[8] = true;
      pattern[9] = true;
      pattern[11] = true;
      break;
    case 8:
      pattern[0] = true;
      pattern[2] = true;
      pattern[3] = true;
      pattern[5] = true;
      pattern[6] = true;
      pattern[8] = true;
      pattern[9] = true;
      pattern[11] = true;
      break;
    case 9:
      pattern[0] = true;
      pattern[1] = true;
      pattern[2] = true;
      pattern[3] = true;
      pattern[5] = true;
      pattern[8] = true;
      pattern[9] = true;
      pattern[10] = true;
      pattern[11] = true;
      break;
    case 10:
      pattern[0] = true;
      pattern[1] = true;
      pattern[2] = true;
      pattern[3] = true;
      pattern[5] = true;
      pattern[6] = true;
      pattern[8] = true;
      pattern[9] = true;
      pattern[10] = true;
      pattern[11] = true;
      break;
    case 11:
      pattern[0] = true;
      pattern[1] = true;
      pattern[2] = true;
      pattern[3] = true;
      pattern[4] = true;
      pattern[5] = true;
      pattern[6] = true;
      pattern[8] = true;
      pattern[9] = true;
      pattern[10] = true;
      pattern[11] = true;
      break;
    case 12:
      pattern.fill(true);
      break;
  }
  
  return pattern;
};

export const Tile: React.FC<TileProps> = ({ 
  tile, 
  isSelected = false, 
  isFlipped = false, 
  onClick, 
  style 
}) => {
  const isClickable = !!onClick;
  const dotPattern = generateDotPattern(tile.dots);
  
  const handleClick = () => {
    if (onClick && !isFlipped) {
      onClick();
    }
  };
  
  return (
    <TileContainer
      isSelected={isSelected}
      isFlipped={isFlipped}
      isClickable={isClickable}
      onClick={handleClick}
      style={style}
    >
      {isFlipped ? (
        <BackPattern />
      ) : (
        <>
          <DotsContainer>
            {dotPattern.map((hasDot, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {hasDot && <Dot isRed={tile.redDots && (index === 0 || index === 3)} />}
              </div>
            ))}
          </DotsContainer>
          <TileName>{tile.name}</TileName>
        </>
      )}
    </TileContainer>
  );
};