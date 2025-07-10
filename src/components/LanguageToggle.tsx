import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: 2px solid #FFD700;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1000;
  min-width: 80px;
  
  &:hover {
    background: rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 12px;
    min-width: 60px;
  }
  
  @media (max-width: 480px) {
    top: 5px;
    right: 5px;
    padding: 4px 8px;
    font-size: 10px;
    min-width: 50px;
  }
`;

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <LanguageButton onClick={toggleLanguage}>
      {language === 'en' ? '日本語' : 'English'}
    </LanguageButton>
  );
};

export default LanguageToggle;