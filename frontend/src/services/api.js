import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentAPI = {
  getAll: (params) => api.get('/content/', { params }),
  getById: (id) => api.get(`/content/${id}/`),
  create: (data) => api.post('/content/', data),
  update: (id, data) => api.put(`/content/${id}/`, data),
  delete: (id) => api.delete(`/content/${id}/`),
  addReview: (id, data) => api.post(`/content/${id}/add_review/`, data),
  updateProgress: (id, data) => api.post(`/content/${id}/update_progress/`, data),
  getRecommendations: () => api.get('/content/recommendations/'),
  generateReview: (id, data) => api.post(`/content/${id}/generate_review/`, data),
};

export const movieAPI = {
  getAll: (params) => api.get('/movies/', { params }),
  getById: (id) => api.get(`/movies/${id}/`),
  create: (data) => api.post('/movies/', data),
  update: (id, data) => api.put(`/movies/${id}/`, data),
  delete: (id) => api.delete(`/movies/${id}/`),
};

export const tvShowAPI = {
  getAll: (params) => api.get('/tv-shows/', { params }),
  getById: (id) => api.get(`/tv-shows/${id}/`),
  create: (data) => api.post('/tv-shows/', data),
  update: (id, data) => api.put(`/tv-shows/${id}/`, data),
  delete: (id) => api.delete(`/tv-shows/${id}/`),
};

export default api;

