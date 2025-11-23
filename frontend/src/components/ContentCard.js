import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentCard.css';

const ContentCard = ({ content }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/content/${content.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'watching':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'wishlist':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      netflix: '🎬',
      prime: '📦',
      disney: '🏰',
      hulu: '🟢',
      hbo: '🔷',
      apple: '🍎',
      paramount: '🔷',
      other: '📺',
    };
    return icons[platform] || '📺';
  };

  return (
    <div className="content-card" onClick={handleClick}>
      <div className="card-image-container">
        {content.poster_url ? (
          <img src={content.poster_url} alt={content.title} className="card-image" />
        ) : (
          <div className="card-placeholder">
            <span className="placeholder-icon">🎬</span>
            <span className="placeholder-text">{content.title}</span>
          </div>
        )}
        <div className="card-overlay">
          <div className="card-info">
            <div className="card-status" style={{ backgroundColor: getStatusColor(content.status) }}>
              {content.status}
            </div>
            {content.average_rating && (
              <div className="card-rating">
                ⭐ {content.average_rating}/10
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{content.title}</h3>
        <div className="card-meta">
          <span className="card-platform">{getPlatformIcon(content.platform)} {content.platform}</span>
          <span className="card-genre">{content.genre}</span>
        </div>
        {content.content_type === 'tv_show' && content.progress_percentage !== undefined && (
          <div className="card-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${content.progress_percentage}%` }}
              />
            </div>
            <span className="progress-text">{content.progress_percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;

