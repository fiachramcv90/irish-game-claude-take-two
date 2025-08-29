import React, { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { CategoryCard, GameBoard } from './components';
import { useCategories } from './hooks/useCategories';
import './App.css';

const GameApp: React.FC = () => {
  const { categories, loading, error, getCategoryProgress } = useCategories();
  const { state, initializeGame, selectCard, resetGame } = useGame();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    await initializeGame(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    resetGame();
  };

  if (loading) {
    return (
      <div className="app">
        <div className="app__loading">
          <div className="app__spinner"></div>
          <p>Loading Irish Language Game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="app__error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <span className="app__title-irish">Cluiche Meaitseála Gaeilge</span>
          <span className="app__title-english">Irish Language Matching Game</span>
        </h1>
        {selectedCategoryId && (
          <button 
            className="app__back-button"
            onClick={handleBackToCategories}
          >
            ← Back to Categories
          </button>
        )}
      </header>

      <main className="app__content">
        {!selectedCategoryId ? (
          <div className="app__category-selection">
            <div className="app__intro">
              <p className="app__description">
                Learn Irish vocabulary through fun matching games. 
                Choose a category to begin your journey!
              </p>
            </div>
            
            <div className="app__categories">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  progress={getCategoryProgress(category.id)}
                  onSelect={handleCategorySelect}
                  disabled={false}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="app__game">
            <GameBoard
              cards={state.cards}
              vocabulary={state.vocabulary}
              gameStatus={state.gameStatus}
              onCardSelect={selectCard}
              selectedCards={state.selectedCards}
              matchedPairs={state.matchedPairs}
              attempts={state.attempts}
              score={state.score}
              timeElapsed={state.timeElapsed}
            />
            
            {(state.gameStatus === 'completed' || state.gameStatus === 'failed') && (
              <div className="app__game-actions">
                <button 
                  className="app__action-button app__action-button--primary"
                  onClick={() => initializeGame(selectedCategoryId)}
                >
                  Play Again
                </button>
                <button 
                  className="app__action-button app__action-button--secondary"
                  onClick={handleBackToCategories}
                >
                  Choose Different Category
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Built with ❤️ for Irish language learners | 
          <a href="https://github.com/fiachramcvicker" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App
