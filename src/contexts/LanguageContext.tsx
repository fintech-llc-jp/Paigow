import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Game Title
    'game.title': 'Paigow Casino',
    'game.subtitle': 'Traditional Chinese Tile Game',
    
    // Game Phases
    'phase.betting': 'Place Your Bets',
    'phase.dealing': 'Dealing Cards',
    'phase.arranging': 'Arrange Your Hand',
    'phase.comparing': 'Comparing Hands',
    'phase.result': 'Round Results',
    'phase.ready': 'Game Ready',
    
    // Buttons
    'button.dealCards': 'Deal Cards',
    'button.addPlayer': 'Add Player',
    'button.sound': 'Sound',
    'button.resetGame': 'Reset Game',
    'button.nextRound': 'Next Round',
    'button.ready': 'Ready',
    'button.auto': 'Auto',
    'button.language': 'Language',
    
    // Game Instructions
    'instruction.arrange': 'Arrange Your Hand',
    'instruction.tiles': 'You have 4 tiles. Arrange them into High and Low hands (2 tiles each).',
    'instruction.manual': 'Manual: Click tiles to select, then click High/Low area to move them',
    'instruction.autoArrange': 'Auto: Click "Auto" to arrange automatically',
    'instruction.readyWhen': 'Click "Ready" when both hands have 2 tiles',
    'instruction.comparing': 'Comparing Hands...',
    'instruction.dealerRevealing': 'Dealer is revealing their tiles',
    
    // Game Status
    'status.gameStatus': 'Game Status',
    'status.placeYourBets': 'Place Your Bets',
    'status.chips': 'Chips',
    'status.bet': 'Bet',
    'status.hand': 'Hand',
    'status.tiles': 'tiles',
    
    // Round Results
    'result.roundResults': 'Round Results',
    'result.dealer': 'Dealer',
    'result.highHand': 'High Hand',
    'result.lowHand': 'Low Hand',
    'result.gamesWon': 'Games Won',
    
    // Player
    'player.default': 'You',
    'player.number': 'Player',
    
    // Round
    'round.number': 'Round',
    
    // Sound Status
    'sound.on': 'ON',
    'sound.off': 'OFF',
    
    // Languages
    'language.english': 'English',
    'language.japanese': '日本語'
  },
  ja: {
    // Game Title
    'game.title': '牌九カジノ',
    'game.subtitle': '中国伝統タイルゲーム',
    
    // Game Phases
    'phase.betting': 'ベットしてください',
    'phase.dealing': 'カード配布中',
    'phase.arranging': '手札を整理してください',
    'phase.comparing': '手札比較中',
    'phase.result': 'ラウンド結果',
    'phase.ready': 'ゲーム準備完了',
    
    // Buttons
    'button.dealCards': 'カードを配る',
    'button.addPlayer': 'プレイヤー追加',
    'button.sound': 'サウンド',
    'button.resetGame': 'ゲームリセット',
    'button.nextRound': '次のラウンド',
    'button.ready': '準備完了',
    'button.auto': '自動',
    'button.language': '言語',
    
    // Game Instructions
    'instruction.arrange': '手札を整理してください',
    'instruction.tiles': '4つのタイルがあります。高手と低手に2つずつ分けてください。',
    'instruction.manual': '手動：タイルをクリックして選択し、高手/低手エリアをクリックして移動',
    'instruction.autoArrange': '自動：「自動」をクリックして自動配置',
    'instruction.readyWhen': '両方の手に2つのタイルがあるときに「準備完了」をクリック',
    'instruction.comparing': '手札比較中...',
    'instruction.dealerRevealing': 'ディーラーがタイルを公開しています',
    
    // Game Status
    'status.gameStatus': 'ゲーム状況',
    'status.placeYourBets': 'ベットしてください',
    'status.chips': 'チップ',
    'status.bet': 'ベット',
    'status.hand': '手札',
    'status.tiles': 'タイル',
    
    // Round Results
    'result.roundResults': 'ラウンド結果',
    'result.dealer': 'ディーラー',
    'result.highHand': '高手',
    'result.lowHand': '低手',
    'result.gamesWon': '勝利数',
    
    // Player
    'player.default': 'あなた',
    'player.number': 'プレイヤー',
    
    // Round
    'round.number': 'ラウンド',
    
    // Sound Status
    'sound.on': 'オン',
    'sound.off': 'オフ',
    
    // Languages
    'language.english': 'English',
    'language.japanese': '日本語'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja'); // デフォルトは日本語

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};