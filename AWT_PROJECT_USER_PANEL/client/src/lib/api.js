// lib/api.js - Optimized API Integration

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// API Client Class
class ApiClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || API_CONFIG.baseURL;
    this.timeout = config.timeout || API_CONFIG.timeout;
    this.retryAttempts = config.retryAttempts || API_CONFIG.retryAttempts;
    this.retryDelay = config.retryDelay || API_CONFIG.retryDelay;
    this.interceptors = {
      request: [],
      response: [],
      error: []
    };
    
    // Add default request interceptor for auth
    this.addRequestInterceptor((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }
      return config;
    });
  }

  // Auth token management
  getAuthToken() {
    return localStorage.getItem('token');
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Interceptor methods
  addRequestInterceptor(fn) {
    this.interceptors.request.push(fn);
  }

  addResponseInterceptor(fn) {
    this.interceptors.response.push(fn);
  }

  addErrorInterceptor(fn) {
    this.interceptors.error.push(fn);
  }

  // Apply interceptors
  applyRequestInterceptors(config) {
    return this.interceptors.request.reduce((acc, interceptor) => {
      return interceptor(acc) || acc;
    }, config);
  }

  applyResponseInterceptors(response) {
    return this.interceptors.response.reduce((acc, interceptor) => {
      return interceptor(acc) || acc;
    }, response);
  }

  applyErrorInterceptors(error) {
    this.interceptors.error.forEach(interceptor => {
      interceptor(error);
    });
    return error;
  }

  // Sleep utility for retry delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main request method with retry logic
  async request(endpoint, options = {}) {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: this.timeout,
      ...options
    };

    // Apply request interceptors
    const finalConfig = this.applyRequestInterceptors(config);

    const url = `${this.baseURL}/api${endpoint}`;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout);

        const response = await fetch(url, {
          ...finalConfig,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData
          );
        }

        const data = await response.json();
        
        // Apply response interceptors
        const finalResponse = this.applyResponseInterceptors(data);
        
        // Validate response format
        if (!finalResponse || typeof finalResponse !== 'object') {
          throw new ApiError('Invalid response format', 500);
        }

        return finalResponse;

      } catch (error) {
        // Apply error interceptors
        this.applyErrorInterceptors(error);

        // Don't retry on certain errors
        if (error instanceof ApiError && [400, 401, 403, 404, 422].includes(error.status)) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === this.retryAttempts) {
          throw error;
        }

        // Wait before retry
        await this.sleep(this.retryDelay * Math.pow(2, attempt));
      }
    }
  }

  // HTTP method helpers
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data = {}) {
    let body, headers = {};
    
    if (data instanceof FormData) {
      body = data;
      // Don't set Content-Type for FormData, let browser set it with boundary
    } else {
      body = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body
    });
  }

  async put(endpoint, data = {}) {
    let body, headers = {};
    
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
    }

    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Custom API Error class
class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isNetworkError() {
    return this.status === 0 || this.message.includes('NetworkError');
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Add error interceptor for common handling
apiClient.addErrorInterceptor((error) => {
  if (error.isUnauthorized) {
    // Clear auth token and redirect to login
    apiClient.setAuthToken(null);
    localStorage.removeItem('user');
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
});

// API Service Functions
export const authApi = {
  // Authentication
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  
  // Profile
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/me', data),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

export const categoriesApi = {
  // Master categories
  getMasterCategories: () => apiClient.get('/categories/masters'),
  createMasterCategory: (data) => apiClient.post('/categories/masters', data),
  
  // Categories
  getCategories: (params = {}) => apiClient.get('/categories', params),
  createCategory: (data) => apiClient.post('/categories', data),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
  updateCategory: (id, data) => apiClient.put(`/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
};

export const templatesApi = {
  // Templates
  getTemplates: (params = {}) => apiClient.get('/templates', params),
  createTemplate: (data) => apiClient.post('/templates', data),
  getTemplateById: (id) => apiClient.get(`/templates/${id}`),
  updateTemplate: (id, data) => apiClient.put(`/templates/${id}`, data),
  deleteTemplate: (id) => apiClient.delete(`/templates/${id}`),
  incrementDownload: (id) => apiClient.post(`/templates/${id}/download`),
  
  // By category
  getTemplatesByCategory: (categoryId, params = {}) => 
    apiClient.get(`/templates/by-category/${categoryId}`, params),
};

export const framesApi = {
  // Frames
  getFrames: (params = {}) => apiClient.get('/frames', params),
  createFrame: (data) => apiClient.post('/frames', data),
  createFrameWithElements: (data) => apiClient.post('/frames/with-elements', data),
  getFrameById: (id) => apiClient.get(`/frames/${id}`),
  getFramesWithElements: () => apiClient.get('/frames/all-with-elements'),
  updateFrame: (id, data) => apiClient.put(`/frames/${id}`, data),
  deleteFrame: (id) => apiClient.delete(`/frames/${id}`),
};

export const designsApi = {
  // Designs
  getUserDesigns: (params = {}) => apiClient.get('/designs', params),
  createDesign: (data) => apiClient.post('/designs', data),
  getDesignById: (id) => apiClient.get(`/designs/${id}`),
  updateDesign: (id, data) => apiClient.put(`/designs/${id}`, data),
  deleteDesign: (id) => apiClient.delete(`/designs/${id}`),
  duplicateDesign: (id) => apiClient.post(`/designs/${id}/duplicate`),
  
  // Public designs
  getPublicDesigns: (params = {}) => apiClient.get('/designs/public', params),
};

export const adminApi = {
  // Admin stats and management
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: (params = {}) => apiClient.get('/admin/users', params),
  toggleUserStatus: (id) => apiClient.patch(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
};

export const uploadApi = {
  // File uploads
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload/single', formData);
  },
  
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return apiClient.post('/upload/multiple', formData);
  }
};

// Utility functions
export function getApiBaseUrl() {
  return apiClient.baseURL;
}

// Legacy support - keep for backward compatibility
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, token } = options;
  
  if (token) {
    apiClient.setAuthToken(token);
  }

  try {
    switch (method.toLowerCase()) {
      case 'get':
        return await apiClient.get(path);
      case 'post':
        return await apiClient.post(path, body);
      case 'put':
        return await apiClient.put(path, body);
      case 'patch':
        return await apiClient.patch(path, body);
      case 'delete':
        return await apiClient.delete(path);
      default:
        return await apiClient.request(path, options);
    }
  } catch (error) {
    // Convert to legacy error format
    const legacyError = new Error(error.message || 'Request failed');
    legacyError.status = error.status;
    throw legacyError;
  }
}

// Export API client and error class for advanced usage
export { apiClient, ApiError };

// Export default client
export default apiClient;