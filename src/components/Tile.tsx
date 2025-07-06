import React from 'react';
import styled from 'styled-components';
import { Tile as TileType } from '../types';
import { TILE_DIMENSIONS, TILE_COLORS } from '../constants';

interface TileProps {
  tile: TileType;
  isSelected?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  backgroundColor?: string;
}

const TileContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'isFlipped', 'isClickable', 'backgroundColor'].includes(prop),
})<{ 
  isSelected: boolean; 
  isFlipped: boolean; 
  isClickable: boolean; 
  backgroundColor?: string;
}>`
  width: ${TILE_DIMENSIONS.WIDTH}px;
  height: ${TILE_DIMENSIONS.HEIGHT}px;
  background-color: ${props => 
    props.isFlipped ? '#654321' : (props.backgroundColor || TILE_COLORS.BACKGROUND)};
  border: ${TILE_DIMENSIONS.BORDER_WIDTH}px solid ${props => 
    props.isSelected ? TILE_COLORS.SELECTED : TILE_COLORS.BORDER};
  border-radius: ${TILE_DIMENSIONS.BORDER_RADIUS}px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  box-shadow: ${props => props.isSelected ? '0 0 10px rgba(255, 215, 0, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)'};
  user-select: none;
  position: relative;
  overflow: hidden; /* Ensure image doesn't overflow rounded corners */
  
  &:hover {
    ${props => props.isClickable && !props.isFlipped && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `}
  }
`;

const TileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; /* Contain the image within the tile area */
`;

export const Tile: React.FC<TileProps> = ({ 
  tile, 
  isSelected = false, 
  isFlipped = false, 
  onClick, 
  style,
  backgroundColor
}) => {
  const isClickable = !!onClick;
  
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
      backgroundColor={backgroundColor}
    >
      {isFlipped ? (
        <TileImage src={TILE_COLORS.BACK_IMAGE_PATH} alt="Tile Back" />
      ) : (
        <TileImage src={tile.imagePath} alt={tile.name} />
      )}
    </TileContainer>
  );
};
