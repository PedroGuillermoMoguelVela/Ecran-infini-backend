// Archivo: frontend-api.js
// Configuración de la API para conectar con el backend

const API_BASE_URL = 'http://localhost:3000/api';

class MovieAPI {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Método para hacer peticiones autenticadas
  async authenticatedFetch(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers
    });
  }

  // ============ AUTENTICACIÓN ============

  async register(email, password, name) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // ============ PELÍCULAS ============

  async getAllMovies() {
    const response = await fetch(`${API_BASE_URL}/movies`);
    return response.json();
  }

  async searchMovies(query) {
    const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }

  async getMovieById(id) {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    return response.json();
  }

  // ============ RESEÑAS ============

  async addReview(movieId, rating, comment) {
    return this.authenticatedFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify({ movieId, rating, comment })
    }).then(r => r.json());
  }

  async getMovieReviews(movieId) {
    const response = await fetch(`${API_BASE_URL}/reviews/movie/${movieId}`);
    return response.json();
  }

  async getUserReviews() {
    return this.authenticatedFetch('/reviews/user').then(r => r.json());
  }

  async updateReview(reviewId, rating, comment) {
    return this.authenticatedFetch(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment })
    }).then(r => r.json());
  }

  async deleteReview(reviewId) {
    return this.authenticatedFetch(`/reviews/${reviewId}`, {
      method: 'DELETE'
    }).then(r => r.json());
  }

  // ============ FAVORITOS ============

  async addToFavorites(movieId) {
    return this.authenticatedFetch('/favorites', {
      method: 'POST',
      body: JSON.stringify({ movieId })
    }).then(r => r.json());
  }

  async getUserFavorites() {
    return this.authenticatedFetch('/favorites').then(r => r.json());
  }

  async removeFromFavorites(movieId) {
    return this.authenticatedFetch(`/favorites/${movieId}`, {
      method: 'DELETE'
    }).then(r => r.json());
  }

  async checkIfFavorite(movieId) {
    return this.authenticatedFetch(`/favorites/check/${movieId}`).then(r => r.json());
  }

  // ============ HISTORIAL DE BÚSQUEDAS ============

  async recordSearch(query, resultsCount) {
    return this.authenticatedFetch('/search-history', {
      method: 'POST',
      body: JSON.stringify({ query, resultsCount })
    }).then(r => r.json());
  }

  async getSearchHistory() {
    return this.authenticatedFetch('/search-history').then(r => r.json());
  }

  async clearSearchHistory() {
    return this.authenticatedFetch('/search-history', {
      method: 'DELETE'
    }).then(r => r.json());
  }
}

// Instancia global de la API
const movieAPI = new MovieAPI();