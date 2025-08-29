import React from 'react';
import type { CategoryCardProps } from '../types/irish.types';
import './CategoryCard.css';

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  progress,
  onSelect,
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled && !category.isLocked) {
      onSelect(category.id);
    }
  };

  const cardClasses = [
    'category-card',
    category.isLocked && 'category-card--locked',
    disabled && 'category-card--disabled',
    progress.currentLevel > 1 && 'category-card--advanced'
  ].filter(Boolean).join(' ');

  const progressPercentage = Math.round((progress.unlockedWords.length / category.totalWords) * 100);

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      style={{ '--category-color': category.colorTheme } as React.CSSProperties}
      role="button"
      tabIndex={disabled || category.isLocked ? -1 : 0}
      aria-label={`${category.nameEnglish} category, ${progressPercentage}% complete, ${category.isLocked ? 'locked' : 'available'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="category-card__header">
        <div className="category-card__icon">{category.icon}</div>
        {category.isLocked && (
          <div className="category-card__lock-indicator">
            <span className="category-card__lock-icon">🔒</span>
          </div>
        )}
      </div>

      <div className="category-card__content">
        <h3 className="category-card__title-irish">{category.nameIrish}</h3>
        <h4 className="category-card__title-english">{category.nameEnglish}</h4>
        <p className="category-card__description">{category.description}</p>
        
        {category.isLocked ? (
          <div className="category-card__unlock-requirement">
            <p className="category-card__unlock-text">
              {category.unlockRequirement || 'Complete previous categories to unlock'}
            </p>
          </div>
        ) : (
          <div className="category-card__stats">
            <div className="category-card__progress">
              <div className="category-card__progress-bar">
                <div 
                  className="category-card__progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="category-card__progress-text">
                {progress.unlockedWords.length}/{category.totalWords} words
              </span>
            </div>
            
            <div className="category-card__metrics">
              <div className="category-card__metric">
                <span className="category-card__metric-label">Level</span>
                <span className="category-card__metric-value">{progress.currentLevel}</span>
              </div>
              <div className="category-card__metric">
                <span className="category-card__metric-label">Best Score</span>
                <span className="category-card__metric-value">{progress.bestScore}</span>
              </div>
              <div className="category-card__metric">
                <span className="category-card__metric-label">Play Time</span>
                <span className="category-card__metric-value">{category.estimatedPlayTime}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="category-card__footer">
        <div className="category-card__difficulty">
          <span className="category-card__difficulty-label">Difficulty:</span>
          <div className="category-card__difficulty-stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star}
                className={`category-card__star ${star <= category.difficultyLevel ? 'category-card__star--filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        {!category.isLocked && (
          <button 
            className="category-card__play-button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={disabled}
          >
            {progress.unlockedWords.length > 0 ? 'Continue' : 'Start Learning'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;