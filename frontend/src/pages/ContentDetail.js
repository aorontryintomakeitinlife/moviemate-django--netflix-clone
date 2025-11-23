import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentAPI } from '../services/api';
import './ContentDetail.css';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: '',
    review_text: '',
    notes: '',
  });
  const [progressData, setProgressData] = useState({
    episodes_watched: '',
    seasons_watched: '',
  });
  const [generatedReview, setGeneratedReview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getById(id);
      setContent(response.data);
      // Initialize edit data with current content
      setEditData({
        title: response.data.title || '',
        director: response.data.director || '',
        genre: response.data.genre || '',
        platform: response.data.platform || '',
        status: response.data.status || 'wishlist',
        poster_url: response.data.poster_url || '',
        description: response.data.description || '',
        release_year: response.data.release_year || '',
        duration: response.data.duration || '',
        total_seasons: response.data.total_seasons || '',
        total_episodes: response.data.total_episodes || '',
        seasons_watched: response.data.seasons_watched || '',
        episodes_watched: response.data.episodes_watched || '',
        average_episode_duration: response.data.average_episode_duration || '',
      });
      if (response.data.content_type === 'tv_show') {
        setProgressData({
          episodes_watched: response.data.episodes_watched || '',
          seasons_watched: response.data.seasons_watched || '',
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.addReview(id, reviewData);
      setShowReviewForm(false);
      setReviewData({ rating: '', review_text: '', notes: '' });
      fetchContent();
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review. Please try again.');
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.updateProgress(id, {
        episodes_watched: parseInt(progressData.episodes_watched),
        seasons_watched: parseInt(progressData.seasons_watched),
      });
      setShowProgressForm(false);
      fetchContent();
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  const handleGenerateReview = async () => {
    if (!reviewData.notes) {
      alert('Please add some notes first to generate a review.');
      return;
    }
    try {
      const response = await contentAPI.generateReview(id, { notes: reviewData.notes });
      setGeneratedReview(response.data.generated_review);
    } catch (error) {
      console.error('Error generating review:', error);
      alert('Failed to generate review. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await contentAPI.delete(id);
        navigate('/my-list');
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    // Reset edit data to current content
    if (content) {
      setEditData({
        title: content.title || '',
        director: content.director || '',
        genre: content.genre || '',
        platform: content.platform || '',
        status: content.status || 'wishlist',
        poster_url: content.poster_url || '',
        description: content.description || '',
        release_year: content.release_year || '',
        duration: content.duration || '',
        total_seasons: content.total_seasons || '',
        total_episodes: content.total_episodes || '',
        seasons_watched: content.seasons_watched || '',
        episodes_watched: content.episodes_watched || '',
        average_episode_duration: content.average_episode_duration || '',
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title: editData.title,
        director: editData.director,
        genre: editData.genre,
        platform: editData.platform,
        status: editData.status,
        poster_url: editData.poster_url,
        description: editData.description,
        release_year: editData.release_year ? parseInt(editData.release_year) : null,
      };

      if (content.content_type === 'movie') {
        updateData.duration = editData.duration ? parseInt(editData.duration) : null;
      } else if (content.content_type === 'tv_show') {
        updateData.total_seasons = editData.total_seasons ? parseInt(editData.total_seasons) : 1;
        updateData.total_episodes = editData.total_episodes ? parseInt(editData.total_episodes) : 1;
        updateData.seasons_watched = editData.seasons_watched ? parseInt(editData.seasons_watched) : 0;
        updateData.episodes_watched = editData.episodes_watched ? parseInt(editData.episodes_watched) : 0;
        updateData.average_episode_duration = editData.average_episode_duration ? parseInt(editData.average_episode_duration) : 45;
      }

      await contentAPI.update(id, updateData);
      setIsEditing(false);
      fetchContent(); // Refresh the content
    } catch (error) {
      console.error('Error updating content:', error);
      const errorMsg = error.response?.data?.detail || 
                       (typeof error.response?.data === 'object' ? JSON.stringify(error.response.data) : 'Failed to update content. Please try again.');
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-detail">
        <div className="error-state">
          <p>Content not found.</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="content-detail">
      <div
        className="detail-hero"
        style={{
          backgroundImage: content.poster_url
            ? `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${content.poster_url})`
            : 'linear-gradient(to bottom, rgba(20,20,20,0.9), rgba(0,0,0,0.9))',
        }}
      >
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="detail-content">
          <div className="detail-poster">
            {content.poster_url ? (
              <img src={content.poster_url} alt={content.title} />
            ) : (
              <div className="poster-placeholder">🎬</div>
            )}
          </div>
          <div className="detail-info">
            <h1>{content.title}</h1>
            <div className="detail-meta">
              {content.release_year && <span>{content.release_year}</span>}
              <span className="meta-separator">•</span>
              <span className="capitalize">{content.genre}</span>
              <span className="meta-separator">•</span>
              <span className="capitalize">{content.platform}</span>
              {content.average_rating && (
                <>
                  <span className="meta-separator">•</span>
                  <span className="rating">⭐ {content.average_rating}/10</span>
                </>
              )}
            </div>
            <div
              className="status-badge"
              style={{ backgroundColor: getStatusColor(content.status) }}
            >
              {content.status}
            </div>
            {content.description && (
              <p className="detail-description">{content.description}</p>
            )}
            {content.director && (
              <p className="detail-director">
                <strong>Director:</strong> {content.director}
              </p>
            )}
            {content.content_type === 'tv_show' && (
              <div className="progress-section">
                <h3>Progress</h3>
                <div className="progress-stats">
                  <div className="stat">
                    <span className="stat-label">Episodes Watched</span>
                    <span className="stat-value">
                      {content.episodes_watched} / {content.total_episodes}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Seasons Watched</span>
                    <span className="stat-value">
                      {content.seasons_watched} / {content.total_seasons}
                    </span>
                  </div>
                  {content.progress_percentage !== undefined && (
                    <div className="stat">
                      <span className="stat-label">Progress</span>
                      <span className="stat-value">{content.progress_percentage}%</span>
                    </div>
                  )}
                  {content.estimated_time_to_complete !== undefined && (
                    <div className="stat">
                      <span className="stat-label">Time to Complete</span>
                      <span className="stat-value">
                        {content.estimated_time_to_complete} hours
                      </span>
                    </div>
                  )}
                </div>
                <button
                  className="action-button"
                  onClick={() => setShowProgressForm(!showProgressForm)}
                >
                  Update Progress
                </button>
                {showProgressForm && (
                  <form onSubmit={handleProgressSubmit} className="progress-form">
                    <div className="form-group">
                      <label>Episodes Watched</label>
                      <input
                        type="number"
                        value={progressData.episodes_watched}
                        onChange={(e) =>
                          setProgressData({ ...progressData, episodes_watched: e.target.value })
                        }
                        min="0"
                        max={content.total_episodes}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Seasons Watched</label>
                      <input
                        type="number"
                        value={progressData.seasons_watched}
                        onChange={(e) =>
                          setProgressData({ ...progressData, seasons_watched: e.target.value })
                        }
                        min="0"
                        max={content.total_seasons}
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="submit-btn">Update</button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setShowProgressForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
            {content.content_type === 'movie' && content.duration && (
              <p className="detail-duration">
                <strong>Duration:</strong> {content.duration} minutes
              </p>
            )}
            <div className="detail-actions">
              {!isEditing && (
                <>
                  <button
                    className="action-button"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Add Review
                  </button>
                  <button className="action-button danger" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-section">
          <h2>Edit Content</h2>
          <form onSubmit={handleEditSubmit} className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Director</label>
                <input
                  type="text"
                  value={editData.director}
                  onChange={(e) => setEditData({ ...editData, director: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Genre *</label>
                <select
                  value={editData.genre}
                  onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
                  required
                >
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
              <div className="form-group">
                <label>Platform *</label>
                <select
                  value={editData.platform}
                  onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                  required
                >
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
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
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
                  value={editData.release_year}
                  onChange={(e) => setEditData({ ...editData, release_year: e.target.value })}
                  min="1900"
                  max="2030"
                />
              </div>
              {content.content_type === 'movie' ? (
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={editData.duration}
                    onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                    min="1"
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Total Episodes</label>
                    <input
                      type="number"
                      value={editData.total_episodes}
                      onChange={(e) => setEditData({ ...editData, total_episodes: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Seasons</label>
                    <input
                      type="number"
                      value={editData.total_seasons}
                      onChange={(e) => setEditData({ ...editData, total_seasons: e.target.value })}
                      min="1"
                    />
                  </div>
                </>
              )}
            </div>

            {content.content_type === 'tv_show' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Episodes Watched</label>
                  <input
                    type="number"
                    value={editData.episodes_watched}
                    onChange={(e) => setEditData({ ...editData, episodes_watched: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Seasons Watched</label>
                  <input
                    type="number"
                    value={editData.seasons_watched}
                    onChange={(e) => setEditData({ ...editData, seasons_watched: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Average Episode Duration (minutes)</label>
                  <input
                    type="number"
                    value={editData.average_episode_duration}
                    onChange={(e) => setEditData({ ...editData, average_episode_duration: e.target.value })}
                    min="1"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Poster Image URL</label>
              <input
                type="url"
                value={editData.poster_url}
                onChange={(e) => setEditData({ ...editData, poster_url: e.target.value })}
                placeholder="https://example.com/poster.jpg"
              />
              <small className="form-hint">
                Paste an image URL from the internet. The image will be displayed once you save.
              </small>
              {editData.poster_url && (
                <div className="poster-preview">
                  <img 
                    src={editData.poster_url} 
                    alt="Poster preview" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="preview-error" style={{ display: 'none' }}>
                    Image failed to load. Please check the URL.
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows="6"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Save Changes</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleEditCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showReviewForm && (
        <div className="review-section">
          <h2>Add Review</h2>
          <form onSubmit={handleReviewSubmit} className="review-form">
            <div className="form-group">
              <label>Rating (1-10) *</label>
              <input
                type="number"
                value={reviewData.rating}
                onChange={(e) =>
                  setReviewData({ ...reviewData, rating: e.target.value })
                }
                min="1"
                max="10"
                required
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={reviewData.notes}
                onChange={(e) =>
                  setReviewData({ ...reviewData, notes: e.target.value })
                }
                rows="4"
                placeholder="Add your personal notes about this content..."
              />
              <button
                type="button"
                className="generate-review-btn"
                onClick={handleGenerateReview}
                disabled={!reviewData.notes}
              >
                Generate Review from Notes
              </button>
              {generatedReview && (
                <div className="generated-review">
                  <p>{generatedReview}</p>
                  <button
                    type="button"
                    className="use-review-btn"
                    onClick={() =>
                      setReviewData({ ...reviewData, review_text: generatedReview })
                    }
                  >
                    Use This Review
                  </button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Review Text</label>
              <textarea
                value={reviewData.review_text}
                onChange={(e) =>
                  setReviewData({ ...reviewData, review_text: e.target.value })
                }
                rows="6"
                placeholder="Write your review..."
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Submit Review</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewData({ rating: '', review_text: '', notes: '' });
                  setGeneratedReview('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {content.reviews && content.reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Reviews</h2>
          <div className="reviews-list">
            {content.reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-rating">⭐ {review.rating}/10</span>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.review_text && (
                  <p className="review-text">{review.review_text}</p>
                )}
                {review.notes && (
                  <p className="review-notes">
                    <strong>Notes:</strong> {review.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetail;

