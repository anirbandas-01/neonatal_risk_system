import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type':'application/json'
    },
    timeout: 10000
});

export const assessmentAPI = {
    createAssessment: async (assessmentData) => {
    try{
       const response = await api.post('/assess', assessmentData);
       return response.data;
    } catch (error){
        throw error.response?.data || {message: 'Failed to create assessment'};
    }
},

getAssessmentByBabyId: async (babyId) => {
    try {
        const response = await api.get(`/assess/${babyId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch assess,ent' };
    }
},

getAllAssessments: async () => {
    try {
        const response = await api.get('/assessments');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch assessments' };
    }
}

};

export default api;