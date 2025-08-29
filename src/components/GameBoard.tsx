import React, { useEffect } from 'react';
import GameCard from './GameCard';
import type { Card, VocabularyItem, GameStatus } from '../types/irish.types';
import './GameBoard.css';

interface GameBoardProps {
  cards: Card[];
  vocabulary: VocabularyItem[];
  gameStatus: GameStatus;
  onCardSelect: (cardId: string) => void;
  selectedCards: string[];
  matchedPairs: string[];
  attempts: number;
  score: number;
  timeElapsed?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  vocabulary,
  gameStatus,
  onCardSelect,
  selectedCards,
  matchedPairs,
  attempts,
  score,
  timeElapsed
}) => {
  useEffect(() => {
    if (gameStatus === 'starting') {
      // Cards will appear with CSS animation delays
      // No need for state management here
    }
  }, [gameStatus, cards]);

  const getVocabularyForCard = (card: Card): VocabularyItem | undefined => {
    return vocabulary.find(item => item.id === card.vocabularyId);
  };

  const isCardSelected = (cardId: string): boolean => {
    return selectedCards.includes(cardId);
  };

  const isCardMatched = (cardId: string): boolean => {
    return matchedPairs.includes(cardId);
  };

  const isCardDisabled = (cardId: string): boolean => {
    return gameStatus === 'checking' || 
           gameStatus === 'completed' || 
           gameStatus === 'failed' ||
           isCardMatched(cardId);
  };

  const boardClasses = [
    'game-board',
    `game-board--${gameStatus}`,
    cards.length <= 8 && 'game-board--small',
    cards.length > 16 && 'game-board--large'
  ].filter(Boolean).join(' ');

  if (gameStatus === 'initializing') {
    return (
      <div className="game-board game-board--loading">
        <div className="game-board__loader">
          <div className="game-board__spinner"></div>
          <p>Loading Irish vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={boardClasses}>
      {gameStatus === 'ready' && (
        <div className="game-board__start-message">
          <h2>Ready to Start!</h2>
          <p>Match Irish words with their pictures</p>
        </div>
      )}
      
      {(gameStatus === 'playing' || gameStatus === 'starting' || gameStatus === 'checking' || gameStatus === 'celebrating' || gameStatus === 'correcting') && (
        <>
          <div className="game-board__status">
            <div className="game-board__stats">
              <div className="game-board__stat">
                <span className="game-board__stat-label">Score</span>
                <span className="game-board__stat-value">{score}</span>
              </div>
              <div className="game-board__stat">
                <span className="game-board__stat-label">Attempts</span>
                <span className="game-board__stat-value">{attempts}</span>
              </div>
              {timeElapsed && (
                <div className="game-board__stat">
                  <span className="game-board__stat-label">Time</span>
                  <span className="game-board__stat-value">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
              <div className="game-board__stat">
                <span className="game-board__stat-label">Matched</span>
                <span className="game-board__stat-value">
                  {matchedPairs.length / 2}/{cards.length / 2}
                </span>
              </div>
            </div>
          </div>

          <div className="game-board__grid">
            {cards.map((card, index) => {
              const vocab = getVocabularyForCard(card);
              
              return (
                <GameCard
                  key={card.id}
                  id={card.id}
                  type={card.type}
                  content={card.type === 'picture' ? vocab?.imageId || '' : vocab?.irishWord || ''}
                  irishWord={vocab?.irishWord}
                  englishTranslation={vocab?.englishTranslation}
                  isSelected={isCardSelected(card.id)}
                  isMatched={isCardMatched(card.id)}
                  isDisabled={isCardDisabled(card.id)}
                  culturalContext={vocab?.culturalNotes}
                  onSelect={onCardSelect}
                  size="medium"
                  animationDelay={index * 50}
                />
              );
            })}
          </div>
        </>
      )}

      {gameStatus === 'completed' && (
        <div className="game-board__completion">
          <div className="game-board__success-message">
            <h2>🎉 Comhghairdeas! (Congratulations!)</h2>
            <p>You completed all matches!</p>
            <div className="game-board__final-stats">
              <div className="game-board__final-stat">
                <strong>Final Score: {score}</strong>
              </div>
              <div className="game-board__final-stat">
                Total Attempts: {attempts}
              </div>
              <div className="game-board__final-stat">
                Accuracy: {Math.round((matchedPairs.length / 2 / attempts) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {gameStatus === 'failed' && (
        <div className="game-board__failure">
          <div className="game-board__failure-message">
            <h2>Game Over</h2>
            <p>Don't worry! Learning takes practice.</p>
            <div className="game-board__encourage">
              <p>You matched {matchedPairs.length / 2} pairs!</p>
            </div>
          </div>
        </div>
      )}

      {gameStatus === 'error' && (
        <div className="game-board__error">
          <div className="game-board__error-message">
            <h2>Oops! Something went wrong</h2>
            <p>Please try refreshing the page.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;