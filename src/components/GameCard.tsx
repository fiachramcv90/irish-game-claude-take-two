import React from 'react';
import type { GameCardProps } from '../types/irish.types';
import PlaceholderImage from './PlaceholderImage';
import './GameCard.css';

const GameCard: React.FC<GameCardProps> = ({
  id,
  type,
  content,
  irishWord,
  englishTranslation,
  isSelected,
  isMatched,
  isDisabled = false,
  culturalContext,
  onSelect,
  size = 'medium',
  animationDelay = 0
}) => {
  const handleClick = () => {
    if (!isDisabled && !isMatched) {
      onSelect(id);
    }
  };

  const cardClasses = [
    'game-card',
    `game-card--${type}`,
    `game-card--${size}`,
    isSelected && 'game-card--selected',
    isMatched && 'game-card--matched',
    isDisabled && 'game-card--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      style={{ animationDelay: `${animationDelay}ms` }}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={type === 'word' ? `Irish word: ${irishWord}, English: ${englishTranslation}` : `Image for ${englishTranslation}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="game-card__content">
        {type === 'picture' ? (
          <div className="game-card__image-container">
            <PlaceholderImage
              imageId={typeof content === 'string' ? content : content.id || ''}
              irishWord={irishWord || ''}
              englishTranslation={englishTranslation || ''}
              category={id.includes('animals') ? 'animals' : id.includes('colors') ? 'colors' : 'unknown'}
              alt={englishTranslation || ''}
            />
          </div>
        ) : (
          <div className="game-card__text-container">
            <div className="game-card__irish-word">{irishWord}</div>
            <div className="game-card__english-translation">{englishTranslation}</div>
          </div>
        )}
      </div>
      
      {culturalContext && (
        <div className="game-card__cultural-note" title={culturalContext}>
          <span className="game-card__cultural-icon">ℹ️</span>
        </div>
      )}
      
      {isMatched && (
        <div className="game-card__match-indicator">
          <span className="game-card__match-icon">✓</span>
        </div>
      )}
    </div>
  );
};

export default GameCard;