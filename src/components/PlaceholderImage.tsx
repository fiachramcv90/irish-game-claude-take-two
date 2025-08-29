import React from 'react';
import './PlaceholderImage.css';

interface PlaceholderImageProps {
  imageId: string;
  irishWord: string;
  englishTranslation: string;
  category: string;
  alt: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  irishWord,
  englishTranslation,
  category,
  alt
}) => {
  // Color mapping for different categories and words
  const getBackgroundStyle = () => {
    if (category === 'colors') {
      switch (irishWord) {
        case 'dearg': return { backgroundColor: '#FF0000' };
        case 'gorm': return { backgroundColor: '#0000FF' };
        case 'bán': return { backgroundColor: '#FFFFFF', color: '#000000' };
        case 'dubh': return { backgroundColor: '#000000' };
        case 'glas': return { backgroundColor: '#228B22' };
        case 'uaine': return { backgroundColor: '#00FF00' };
        case 'buí': return { backgroundColor: '#FFD700', color: '#000000' };
        case 'oráiste': return { backgroundColor: '#FFA500' };
        case 'corcra': return { backgroundColor: '#800080' };
        case 'donn': return { backgroundColor: '#8B4513' };
        case 'liath': return { backgroundColor: '#808080' };
        case 'bándearg': return { backgroundColor: '#FFC0CB', color: '#000000' };
        default: return { backgroundColor: '#4CAF50' };
      }
    } else if (category === 'animals') {
      // Use green theme for animals
      return { 
        background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
        color: '#FFFFFF'
      };
    }
    return { backgroundColor: '#4CAF50', color: '#FFFFFF' };
  };

  // Get emoji for animals
  const getEmoji = () => {
    if (category === 'animals') {
      switch (irishWord) {
        case 'madra': return '🐕';
        case 'cat': return '🐱';
        case 'bó': return '🐄';
        case 'capall': return '🐎';
        case 'muc': return '🐷';
        case 'caora': return '🐑';
        case 'gabhar': return '🐐';
        case 'coinín': return '🐰';
        case 'éan': return '🐦';
        case 'iasc': return '🐠';
        case 'luch': return '🐭';
        case 'sionnach': return '🦊';
        case 'francach': return '🐀';
        case 'béar': return '🐻';
        case 'giorria': return '🐇';
        default: return '🐾';
      }
    }
    return '';
  };

  return (
    <div 
      className="placeholder-image"
      style={getBackgroundStyle()}
      role="img"
      aria-label={alt}
    >
      <div className="placeholder-image__content">
        {category === 'animals' && (
          <div className="placeholder-image__emoji">{getEmoji()}</div>
        )}
        <div className="placeholder-image__irish">{irishWord}</div>
        <div className="placeholder-image__english">({englishTranslation})</div>
      </div>
    </div>
  );
};

export default PlaceholderImage;