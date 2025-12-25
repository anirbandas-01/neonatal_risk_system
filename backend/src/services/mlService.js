const axios = require('axios');
require('dotenv').config();

const ML_MODEL_URL = process.env.ML_MODEL_URL || 'http://localhost:5000';
const buildMLPayload = require('../Utils/mlPayloadBuilder');
class MLServices {
    /* async predictRisk(healthParameters){
        try {
            console.log('Calling ML Model API..');
            console.log('URL:',  `${ML_MODEL_URL}/predict`);

            const response = await axios.post(`${ML_MODEL_URL}/predict`, healthParameters,{
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('ML Model API Response:',  response.data);
            return response.data;

        } catch (error) {
            console.log('ML Model API Error:', error.message);

            if(error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT'){
                console.log('ML Model not available. Using  fallback Prediction...');
                return this.fallbackPrediction(healthParameters);
            }

            throw new Error('Failed to get prediction from ML Model');
        }
    } */

     

async predictRisk(babyInfo, healthParameters) {
    try {
        const mlPayload = buildMLPayload(babyInfo, healthParameters);

        console.log('Calling ML Model API..');
        console.log('Payload:', mlPayload);

        const response = await axios.post(
            `${ML_MODEL_URL}/predict`,
            mlPayload,
            {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        return response.data;
    } catch (error) {
        console.log('ML Model API Error:', error.message);
        throw error;
    }
}




    /* fallbackPrediction(params) {
        console.log('Using fallback prediction logic....');

        let score = 0;

        if(params.birthWeight < 2.5){
            score += 30;
        }else if(params.birthWeight < 3.0){
            score += 15;
        }

        if(params.temperature < 36.5 || params.temperature > 37.5){
            score += 20;
        }

        if(params.oxygenSaturation < 95 ){
            score += 25;
        }

        if(params.apgarScore < 7){
            score += 30;
        }

        if(params.heartRate < 120 || params.heartRate > 160){
            score += 15;
        }

        if(params.bloodGlucose < 2.6 ){
            score += 20;
        }

        if(params.jaundiceLevel > 10){
            score += 20;
        }

        if(params.birthDefects === 'Yes'){
            score += 25;
        }else if(params.birthDefects === 'Some distress'){
            score += 15;
        }


        let finalRisk;
        let confidence;

        if(score >= 60){
            finalRisk = 'High Risk';
            confidence = 0.85 + (Math.random()* 0.10);
        }else if(score >= 30){
            finalRisk = 'Medium Risk';
            confidence = 0.70 + (Math.random()*0.15);
        }else{
            finalRisk = 'Low Risk';
            confidence = 0.85 + (Math.random()*0.15);
        }

        return {
            finalRisk,
            confidence: Math.min(confidence, 1.0),
            mlScore: score,
            lstmScore: score * 0.95,
            ensembleScore: score * 0.92
        };
    } */

    generateRecommendations(riskLevel, parameters){
        const recommendations = {
            'Low Risk': [
                'Continue routine monitoring and care.',
                'Maintain regular feeding schedule',
                'Monitor weight gain progress',
                'Schedule next check-up as per guidelines',
                'Ensure proper sleep and rest'
            ],
            'Medium Risk': [
                 'Increase monitoring frequency to every 4-6 hours',
                 'Close observation of vital signs',
                 'Consider additional diagnostic tests',
                 'Ensure proper nutrition and hydration',
                 'Schedule follow-up within 24-48 hours',
                 'Keep detailed records of all parameters'
            ],
            'High Risk': [
                'IMMEDIATE medical attention required',
                'Continuous monitoring of vital signs',
                'Prepare for possible intervention',
                'Inform specialist team immediately',
                'Keep in observation unit or NICU',
                'Conduct comprehensive diagnostic tests',
                'Ensure emergency equipment is ready'
            ]
        };

        return recommendations[riskLevel] || recommendations['Medium Risk'];

    }

    async checkHealth(){
        try{
            const response = await axios.get(`${ML_MODEL_URL}/`, {
                timeout: 5000
            });
            return {
                available: true,
                message: 'Ml model is running'
            };
        }catch(error){
            return {
                available: false,
                message: 'Ml model Api is not  available. Using fallback predictions.'
            };
        }
    }
}

module.exports = new MLServices();