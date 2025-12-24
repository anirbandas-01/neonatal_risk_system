import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type':'application/json'
    },
    timeout: 10000
});



// Global error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: 'Server not reachable' });
  }
);


export const babyAPI = {
  // Check if baby exists
  checkExists: async (babyId) => {
    const response = await api.get(`/baby/${babyId}/exists`);
    return response.data;
  },
  
  // Get baby's complete history
  getHistory: async (babyId) => {
    const response = await api.get(`/baby/${babyId}/history`);
    return response.data;
  },
  
  // Get all babies
  getAllBabies: async (params = {}) => {
    const response = await api.get('/babies', { params });
    return response.data;
  },
  
  // Delete baby
  deleteBaby: async (babyId) => {
    const response = await api.delete(`/baby/${babyId}`);
    return response.data;
  }
};

export const assessmentAPI = {
  // Create new baby or add assessment
  createOrUpdate: async (data) => {
    const response = await api.post('/assess', data);
    return response.data;
  },
  
  // Get specific assessment
  getById: async (assessmentId) => {
    const response = await api.get(`/assessment/${assessmentId}`);
    return response.data;
  },
  
  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/statistics');
    return response.data;
  }
};

export default api;