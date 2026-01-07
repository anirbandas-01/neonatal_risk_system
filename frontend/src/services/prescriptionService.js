// frontend/src/services/prescriptionService.js
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

const getAuthHeader = () => {
  const token = localStorage.getItem('doctorToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const prescriptionService = {
  // Create new prescription
  create: async (prescriptionData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/prescription/create`,
        prescriptionData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Create prescription error:', error);
      throw error;
    }
  },

  // Get prescription by ID
  getById: async (prescriptionId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/prescription/${prescriptionId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Get prescription error:', error);
      throw error;
    }
  },

  // Get all prescriptions for a baby
  getByBabyId: async (babyId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/prescription/baby/${babyId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Get baby prescriptions error:', error);
      throw error;
    }
  },

  // Get prescription for specific assessment
  getByAssessmentId: async (assessmentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/prescription/assessment/${assessmentId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      // Return null if not found instead of throwing
      if (error.response?.status === 404) {
        return { success: false, data: null };
      }
      throw error;
    }
  },

  // Download prescription PDF
  downloadPDF: async (prescriptionId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/prescription/${prescriptionId}/download`,
        {
          headers: getAuthHeader(),
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Download prescription error:', error);
      throw error;
    }
  }
};