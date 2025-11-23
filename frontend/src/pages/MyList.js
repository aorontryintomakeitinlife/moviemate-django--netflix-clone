import React, { useState, useEffect } from 'react';
import { contentAPI } from '../services/api';
import ContentCard from '../components/ContentCard';
import './MyList.css';

const MyList = () => {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: '',
    platform: '',
    status: '',
    content_type: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [content, filters, sortBy, sortOrder]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAll();
      const data = response.data.results || response.data;
      setContent(data);
      setFilteredContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...content];

    // Apply filters
    if (filters.genre) {
      filtered = filtered.filter(item => item.genre === filters.genre);
    }
    if (filters.platform) {
      filtered = filtered.filter(item => item.platform === filters.platform);
    }
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    if (filters.content_type) {
      filtered = filtered.filter(item => item.content_type === filters.content_type);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        (item.director && item.director.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'title') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredContent(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      platform: '',
      status: '',
      content_type: '',
      search: '',
    });
    setSortBy('created_at');
    setSortOrder('desc');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const genres = [...new Set(content.map(item => item.genre))];
  const platforms = [...new Set(content.map(item => item.platform))];

  return (
    <div className="my-list">
      <div className="list-header">
        <h1>My Collection</h1>
        <div className="list-stats">
          <span>Total: {content.length}</span>
          <span>Showing: {filteredContent.length}</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by title or director..."
            className="search-input"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
          >
            <option value="">All Platforms</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="wishlist">Wishlist</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.content_type}
            onChange={(e) => handleFilterChange('content_type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv_show">TV Shows</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="release_year-desc">Year (Newest)</option>
            <option value="release_year-asc">Year (Oldest)</option>
          </select>
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="content-grid">
        {filteredContent.length > 0 ? (
          filteredContent.map(item => (
            <ContentCard key={item.id} content={item} />
          ))
        ) : (
          <div className="no-results">
            <p>No content found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;

