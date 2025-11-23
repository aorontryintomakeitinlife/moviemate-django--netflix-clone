import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ content }) => {
  const navigate = useNavigate();

  if (!content) return null;

  const handleClick = () => {
    navigate(`/content/${content.id}`);
  };

  return (
    <div className="hero-section">
      <div
        className="hero-background"
        style={{
          backgroundImage: content.poster_url
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${content.poster_url})`
            : 'linear-gradient(to bottom, rgba(20,20,20,0.9), rgba(0,0,0,0.9))',
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{content.title}</h1>
          <div className="hero-meta">
            {content.release_year && (
              <span className="hero-year">{content.release_year}</span>
            )}
            <span className="hero-genre">{content.genre}</span>
            {content.average_rating && (
              <span className="hero-rating">⭐ {content.average_rating}/10</span>
            )}
          </div>
          {content.description && (
            <p className="hero-description">{content.description}</p>
          )}
          <div className="hero-buttons">
            <button className="hero-button hero-button-primary" onClick={handleClick}>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

