import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      email?: string;
      role: string;
      permissions: string[];
      tenant_id: string;
    };
    token: string;
  };
  message: string;
}

class AuthService {
  /**
   * Login to backend and get Sanctum token
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.data.success && response.data.data.token) {
        // Store token for future API calls
        localStorage.setItem('auth-token', response.data.data.token);
        return response.data;
      }

      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Backend login error:', error);
      throw new Error(error.response?.data?.message || 'Backend login failed');
    }
  }

  /**
   * Logout from backend
   */
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Backend logout error:', error);
    } finally {
      // Always remove token
      localStorage.removeItem('auth-token');
    }
  }

  /**
   * Get current user from backend
   */
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to get user');
    } catch (error: any) {
      console.error('Get user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }

  /**
   * Check if user has valid token
   */
  hasValidToken(): boolean {
    const token = localStorage.getItem('auth-token');
    return !!token;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }
}

export default new AuthService();
