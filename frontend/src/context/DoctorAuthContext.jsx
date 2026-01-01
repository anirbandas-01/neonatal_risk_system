// frontend/src/context/DoctorAuthContext.jsx - NEW FILE
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DoctorAuthContext = createContext();

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export const useDoctorAuth = () => {
  const context = useContext(DoctorAuthContext);
  if (!context) {
    throw new Error('useDoctorAuth must be used within DoctorAuthProvider');
  }
  return context;
};

export const DoctorAuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if doctor is logged in on mount
    const storedToken = localStorage.getItem('doctorToken');
    const storedDoctor = localStorage.getItem('doctorData');
    
    if (storedToken && storedDoctor) {
      setToken(storedToken);
      setDoctor(JSON.parse(storedDoctor));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/doctor/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, doctor } = response.data;
        
        // Store in localStorage
        localStorage.setItem('doctorToken', token);
        localStorage.setItem('doctorData', JSON.stringify(doctor));
        
        // Update state
        setToken(token);
        setDoctor(doctor);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/doctor/register`, data);

      if (response.data.success) {
        const { token, doctor } = response.data;
        
        // Store in localStorage
        localStorage.setItem('doctorToken', token);
        localStorage.setItem('doctorData', JSON.stringify(doctor));
        
        // Update state
        setToken(token);
        setDoctor(doctor);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorData');
    
    // Clear state
    setToken(null);
    setDoctor(null);
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/doctor/profile`, data);

      if (response.data.success) {
        const updatedDoctor = response.data.doctor;
        
        // Update localStorage
        localStorage.setItem('doctorData', JSON.stringify(updatedDoctor));
        
        // Update state
        setDoctor(updatedDoctor);
        
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed'
      };
    }
  };

  const isAuthenticated = () => {
    return !!token && !!doctor;
  };

  return (
    <DoctorAuthContext.Provider
      value={{
        doctor,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated
      }}
    >
      {children}
    </DoctorAuthContext.Provider>
  );
};