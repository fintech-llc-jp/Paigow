import { Tile } from '../types';


export const TILE_DEFINITIONS: Tile[] = [
  // Civil tiles (文牌) - 22 tiles (11 pairs)
  { id: 'heaven1', name: '天牌', dots: 12, type: 'civil', value: 2, rank: 1, pair: 'heaven', imagePath: new URL('../assets/pai/heaven1.png', import.meta.url).href },
  { id: 'heaven2', name: '天牌', dots: 12, type: 'civil', value: 2, rank: 1, pair: 'heaven', imagePath: new URL('../assets/pai/heaven2.png', import.meta.url).href },
  
  { id: 'earth1', name: '地牌', dots: 2, type: 'civil', value: 2, rank: 2, pair: 'earth', imagePath: new URL('../assets/pai/earth1.png', import.meta.url).href },
  { id: 'earth2', name: '地牌', dots: 2, type: 'civil', value: 2, rank: 2, pair: 'earth', imagePath: new URL('../assets/pai/earth2.png', import.meta.url).href },
  
  { id: 'man1', name: '人牌', dots: 8, type: 'civil', value: 8, rank: 3, pair: 'man', imagePath: new URL('../assets/pai/man1.png', import.meta.url).href },
  { id: 'man2', name: '人牌', dots: 8, type: 'civil', value: 8, rank: 3, pair: 'man', imagePath: new URL('../assets/pai/man2.png', import.meta.url).href },
  
  { id: 'harmony1', name: '和牌', dots: 4, type: 'civil', value: 4, rank: 4, pair: 'harmony', imagePath: new URL('../assets/pai/harmony1.png', import.meta.url).href },
  { id: 'harmony2', name: '和牌', dots: 4, type: 'civil', value: 4, rank: 4, pair: 'harmony', imagePath: new URL('../assets/pai/harmony2.png', import.meta.url).href },
  
  { id: 'plum1', name: '梅牌', dots: 10, type: 'civil', value: 0, rank: 5, pair: 'plum', imagePath: new URL('../assets/pai/plum1.png', import.meta.url).href },
  { id: 'plum2', name: '梅牌', dots: 10, type: 'civil', value: 0, rank: 5, pair: 'plum', imagePath: new URL('../assets/pai/plum2.png', import.meta.url).href },
  
  { id: 'long1', name: '長牌', dots: 6, type: 'civil', value: 6, rank: 6, pair: 'long', imagePath: new URL('../assets/pai/long1.png', import.meta.url).href },
  { id: 'long2', name: '長牌', dots: 6, type: 'civil', value: 6, rank: 6, pair: 'long', imagePath: new URL('../assets/pai/long2.png', import.meta.url).href },
  
  { id: 'bench1', name: '板凳', dots: 4, type: 'civil', value: 4, rank: 7, pair: 'bench', imagePath: new URL('../assets/pai/bench1.png', import.meta.url).href },
  { id: 'bench2', name: '板凳', dots: 4, type: 'civil', value: 4, rank: 7, pair: 'bench', imagePath: new URL('../assets/pai/bench2.png', import.meta.url).href },
  
  { id: 'axe1', name: '斧頭', dots: 11, type: 'civil', value: 1, rank: 8, pair: 'axe', imagePath: new URL('../assets/pai/axe1.png', import.meta.url).href },
  { id: 'axe2', name: '斧頭', dots: 11, type: 'civil', value: 1, rank: 8, pair: 'axe', imagePath: new URL('../assets/pai/axe2.png', import.meta.url).href },
  
  { id: 'redhead1', name: '紅頭', dots: 10, type: 'civil', value: 0, rank: 9, pair: 'redhead', imagePath: new URL('../assets/pai/redhead1.png', import.meta.url).href },
  { id: 'redhead2', name: '紅頭', dots: 10, type: 'civil', value: 0, rank: 9, pair: 'redhead', imagePath: new URL('../assets/pai/redhead2.png', import.meta.url).href },
  
  { id: 'highleg1', name: '高脚', dots: 6, type: 'civil', value: 6, rank: 10, pair: 'highleg', imagePath: new URL('../assets/pai/highleg1.png', import.meta.url).href },
  { id: 'highleg2', name: '高脚', dots: 6, type: 'civil', value: 6, rank: 10, pair: 'highleg', imagePath: new URL('../assets/pai/highleg2.png', import.meta.url).href },
  
  { id: 'linglin1', name: '零霖', dots: 6, type: 'civil', value: 6, rank: 11, pair: 'linglin', imagePath: new URL('../assets/pai/linglin1.png', import.meta.url).href },
  { id: 'linglin2', name: '零霖', dots: 6, type: 'civil', value: 6, rank: 11, pair: 'linglin', imagePath: new URL('../assets/pai/linglin2.png', import.meta.url).href },
  
  // Military tiles (武牌) - 10 tiles
  { id: 'mixed9_1', name: '雜九', dots: 9, type: 'military', value: 9, rank: 12, pair: 'mixed9', imagePath: new URL('../assets/pai/mixed9_1.png', import.meta.url).href },
  { id: 'mixed9_2', name: '雜九', dots: 9, type: 'military', value: 9, rank: 12, pair: 'mixed9', imagePath: new URL('../assets/pai/mixed9_2.png', import.meta.url).href },
  
  { id: 'mixed8_1', name: '雜八', dots: 8, type: 'military', value: 8, rank: 13, pair: 'mixed8', imagePath: new URL('../assets/pai/mixed8_1.png', import.meta.url).href },
  { id: 'mixed8_2', name: '雜八', dots: 8, type: 'military', value: 8, rank: 13, pair: 'mixed8', imagePath: new URL('../assets/pai/mixed8_2.png', import.meta.url).href },
  
  { id: 'mixed7_1', name: '雜七', dots: 7, type: 'military', value: 7, rank: 14, pair: 'mixed7', imagePath: new URL('../assets/pai/mixed7_1.png', import.meta.url).href },
  { id: 'mixed7_2', name: '雜七', dots: 7, type: 'military', value: 7, rank: 14, pair: 'mixed7', imagePath: new URL('../assets/pai/mixed7_2.png', import.meta.url).href },
  
  { id: 'mixed5_1', name: '雜五', dots: 5, type: 'military', value: 5, rank: 15, pair: 'mixed5', imagePath: new URL('../assets/pai/mixed5_1.png', import.meta.url).href },
  { id: 'mixed5_2', name: '雜五', dots: 5, type: 'military', value: 5, rank: 15, pair: 'mixed5', imagePath: new URL('../assets/pai/mixed5_2.png', import.meta.url).href },
  
  { id: 'ding3_1', name: '丁三', dots: 6, type: 'military', value: 3, rank: 16, pair: 'ding3', imagePath: new URL('../assets/pai/ding3_1.png', import.meta.url).href },
  { id: 'ding3_2', name: '丁三', dots: 6, type: 'military', value: 3, rank: 16, pair: 'ding3', imagePath: new URL('../assets/pai/ding3_2.png', import.meta.url).href },
];

export const SPECIAL_PAIRS = {
  GONG: { name: '至尊宝', tiles: ['ding3_1', 'ding3_2'], rank: 0 },
  HEAVEN: { name: '双天', tiles: ['heaven1', 'heaven2'], rank: 1 },
  EARTH: { name: '双地', tiles: ['earth1', 'earth2'], rank: 2 },
  MAN: { name: '双人', tiles: ['man1', 'man2'], rank: 3 },
  HARMONY: { name: '双和', tiles: ['harmony1', 'harmony2'], rank: 4 },
  PLUM: { name: '双梅', tiles: ['plum1', 'plum2'], rank: 5 },
  LONG: { name: '双长', tiles: ['long1', 'long2'], rank: 6 },
  BENCH: { name: '双板凳', tiles: ['bench1', 'bench2'], rank: 7 },
  AXE: { name: '双斧头', tiles: ['axe1', 'axe2'], rank: 8 },
  REDHEAD: { name: '双红头', tiles: ['redhead1', 'redhead2'], rank: 9 },
  HIGHLEG: { name: '双高脚', tiles: ['highleg1', 'highleg2'], rank: 10 },
  LINGLIN: { name: '双零霖', tiles: ['linglin1', 'linglin2'], rank: 11 },
  MIXED9: { name: '双雜九', tiles: ['mixed9_1', 'mixed9_2'], rank: 12 },
  MIXED8: { name: '双雜八', tiles: ['mixed8_1', 'mixed8_2'], rank: 13 },
  MIXED7: { name: '双雜七', tiles: ['mixed7_1', 'mixed7_2'], rank: 14 },
  MIXED5: { name: '双雜五', tiles: ['mixed5_1', 'mixed5_2'], rank: 15 },
};

export const TILE_DIMENSIONS = {
  WIDTH: 60,
  HEIGHT: 90,
  BORDER_RADIUS: 8,
  BORDER_WIDTH: 2,
} as const;

export const TILE_COLORS = {
  BACKGROUND: '#90EE90',
  BORDER: '#8B4513',
  SELECTED: '#FFD700',
  BACK_IMAGE_PATH: new URL('../assets/pai/back.png', import.meta.url).href,
} as const;