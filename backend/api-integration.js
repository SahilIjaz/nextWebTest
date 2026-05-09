// API Configuration for Frontend Integration
// Place this file in the frontend project directory

const API_BASE_URL = 'http://localhost:5000/api';

// ===== API SERVICE CLASS =====
class BTMSApiService {
  constructor() {
    this.token = this.getToken();
  }

  // Token Management
  getToken() {
    return localStorage.getItem('btms_token');
  }

  setToken(token) {
    localStorage.setItem('btms_token', token);
    this.token = token;
  }

  removeToken() {
    localStorage.removeItem('btms_token');
    this.token = null;
  }

  // Headers with authorization
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // ===== AUTHENTICATION ENDPOINTS =====

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        this.setToken(data.token);
      }
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        this.setToken(data.token);
      }
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      this.removeToken();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== USER ENDPOINTS =====

  async getUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: this.getHeaders(),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== ROUTES ENDPOINTS =====

  async getRoutes() {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/routes`);
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getRoute(routeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/routes/${routeId}`);
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== VEHICLES ENDPOINTS =====

  async getVehicles() {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/vehicles`, {
        headers: this.getHeaders(),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getVehicle(vehicleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/vehicles/${vehicleId}`, {
        headers: this.getHeaders(),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== BOOKINGS ENDPOINTS =====

  async getBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/bookings`, {
        headers: this.getHeaders(),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/bookings`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(bookingData),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateBooking(bookingId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/bookings/${bookingId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async cancelBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return { success: response.ok, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create global instance
const btmsApi = new BTMSApiService();
