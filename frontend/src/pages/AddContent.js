import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentAPI, movieAPI, tvShowAPI } from '../services/api';
import './AddContent.css';

const AddContent = () => {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState('movie');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: '',
    platform: '',
    status: 'wishlist',
    poster_url: '',
    description: '',
    release_year: '',
    duration: '',
    total_seasons: '1',
    total_episodes: '1',
    seasons_watched: '0',
    episodes_watched: '0',
    average_episode_duration: '45',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        title: formData.title,
        director: formData.director,
        genre: formData.genre,
        platform: formData.platform,
        status: formData.status,
        poster_url: formData.poster_url,
        description: formData.description,
        content_type: contentType,
        release_year: formData.release_year ? parseInt(formData.release_year) : null,
      };

      let response;
      if (contentType === 'movie') {
        data.duration = formData.duration ? parseInt(formData.duration) : null;
        response = await movieAPI.create(data);
      } else {
        data.total_seasons = parseInt(formData.total_seasons);
        data.total_episodes = parseInt(formData.total_episodes);
        data.seasons_watched = parseInt(formData.seasons_watched);
        data.episodes_watched = parseInt(formData.episodes_watched);
        data.average_episode_duration = parseInt(formData.average_episode_duration);
        response = await tvShowAPI.create(data);
      }

      navigate(`/content/${response.data.id}`);
    } catch (err) {
      console.error('Error adding content:', err);
      console.error('Error response:', err.response);
      
      // Get detailed error message
      let errorMessage = 'Failed to add content. Please try again.';
      if (err.response) {
        const data = err.response.data;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors.join(', ');
        } else if (typeof data === 'object') {
          // Format field errors
          const fieldErrors = Object.entries(data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          errorMessage = fieldErrors || errorMessage;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-content">
      <div className="add-content-container">
        <h1>Add New Content</h1>

        <div className="content-type-selector">
          <button
            className={`type-btn ${contentType === 'movie' ? 'active' : ''}`}
            onClick={() => setContentType('movie')}
          >
            Movie
          </button>
          <button
            className={`type-btn ${contentType === 'tv_show' ? 'active' : ''}`}
            onClick={() => setContentType('tv_show')}
          >
            TV Show
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="content-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Director</label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Genre *</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                <option value="">Select Genre</option>
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="horror">Horror</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="thriller">Thriller</option>
                <option value="romance">Romance</option>
                <option value="documentary">Documentary</option>
                <option value="animation">Animation</option>
                <option value="fantasy">Fantasy</option>
                <option value="crime">Crime</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Platform *</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="">Select Platform</option>
                <option value="netflix">Netflix</option>
                <option value="prime">Prime Video</option>
                <option value="disney">Disney+</option>
                <option value="hulu">Hulu</option>
                <option value="hbo">HBO Max</option>
                <option value="apple">Apple TV+</option>
                <option value="paramount">Paramount+</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="wishlist">Wishlist</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Release Year</label>
              <input
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                min="1900"
                max="2030"
              />
            </div>

            {contentType === 'movie' ? (
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Total Episodes</label>
                <input
                  type="number"
                  name="total_episodes"
                  value={formData.total_episodes}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            )}
          </div>

          {contentType === 'tv_show' && (
            <div className="form-row">
              <div className="form-group">
                <label>Total Seasons</label>
                <input
                  type="number"
                  name="total_seasons"
                  value={formData.total_seasons}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Episodes Watched</label>
                <input
                  type="number"
                  name="episodes_watched"
                  value={formData.episodes_watched}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Average Episode Duration (minutes)</label>
                <input
                  type="number"
                  name="average_episode_duration"
                  value={formData.average_episode_duration}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Poster URL</label>
            <input
              type="url"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Content'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContent;

