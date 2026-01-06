import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type':'application/json'
    },
    timeout: 10000
});


api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('doctorToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


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
  },

  search: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/babies/search`, {
        params: { q: query, limit: 20 },
        //headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
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


export const prescriptionAPI = {
  // Create new prescription
  create: async (data) => {
    const response = await api.post('/prescription/create', data);
    return response.data;
  },
  
  // Get prescription by ID
  getById: async (prescriptionId) => {
    const response = await api.get(`/prescription/${prescriptionId}`);
    return response.data;
  },
  
  // Get all prescriptions for a baby
  getByBaby: async (babyId) => {
    const response = await api.get(`/prescription/baby/${babyId}`);
    return response.data;
  },
  
  // Get prescription by assessment ID
  getByAssessment: async (assessmentId) => {
    const response = await api.get(`/prescription/assessment/${assessmentId}`);
    return response.data;
  },
  
  // Update prescription
  update: async (prescriptionId, data) => {
    const response = await api.put(`/prescription/${prescriptionId}`, data);
    return response.data;
  },
  
  // Delete prescription
  delete: async (prescriptionId) => {
    const response = await api.delete(`/prescription/${prescriptionId}`);
    return response.data;
  },
  
  // Download prescription PDF
  downloadPDF: async (prescriptionId) => {
    const response = await api.get(`/prescription/${prescriptionId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default api;