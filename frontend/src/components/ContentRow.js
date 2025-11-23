import React, { useRef } from 'react';
import ContentCard from './ContentCard';
import './ContentRow.css';

const ContentRow = ({ title, contents }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 300;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!contents || contents.length === 0) {
    return null;
  }

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button
          className="row-arrow row-arrow-left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className="row-content" ref={rowRef}>
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
        <button
          className="row-arrow row-arrow-right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ContentRow;

