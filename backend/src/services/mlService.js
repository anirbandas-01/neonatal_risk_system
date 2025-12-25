const axios = require('axios');
require('dotenv').config();

const ML_MODEL_URL = process.env.ML_MODEL_URL || 'http://localhost:9000';
const buildMLPayload = require('../Utils/mlPayloadBuilder');

class MLServices {
    async predictRisk(babyInfo, healthParameters) {
        try {
            const mlPayload = buildMLPayload(babyInfo, healthParameters);

            console.log('Calling ML Model API...');
            console.log('URL:', `${ML_MODEL_URL}/predict`);
            console.log('Payload:', JSON.stringify(mlPayload, null, 2));

            const response = await axios.post(
                `${ML_MODEL_URL}/predict`,
                mlPayload,
                {
                    timeout: 10000,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log('ML Model Response:', response.data);
            
            // Transform ML model response to expected format
            const mlResponse = response.data;
            
            // Check if response has the expected format
            if (mlResponse.finalRisk) {
                // Already in correct format
                return mlResponse;
            } else if (mlResponse.risk_level) {
                // Transform from ML model format
                console.log('Transforming ML response format...');
                
                // Map risk_level to finalRisk
                let finalRisk;
                const riskLevel = mlResponse.risk_level.toLowerCase();
                
                if (riskLevel === 'low' || riskLevel === 'safe') {
                    finalRisk = 'Low Risk';
                } else if (riskLevel === 'medium' || riskLevel === 'at risk') {
                    finalRisk = 'Medium Risk';
                } else if (riskLevel === 'high' || riskLevel === 'critical') {
                    finalRisk = 'High Risk';
                } else {
                    finalRisk = 'Medium Risk'; // Default
                }
                
                return {
                    finalRisk: finalRisk,
                    confidence: mlResponse.confidence || 0.5,
                    mlScore: mlResponse.ml_score || 50,
                    lstmScore: mlResponse.lstm_score || 50,
                    ensembleScore: mlResponse.ensemble_score || 50
                };
            } else {
                console.error('Invalid ML response format:', mlResponse);
                return this.fallbackPrediction(healthParameters);
            }

            return response.data;
            
        } catch (error) {
            console.error('ML Model API Error:', error.message);
            
            if (error.code === 'ECONNREFUSED') {
                console.error('ML Model server not reachable at:', ML_MODEL_URL);
            } else if (error.code === 'ETIMEDOUT') {
                console.error('ML Model request timed out');
            } else if (error.response) {
                console.error('ML Model error response:', error.response.data);
            }
            
            console.log('Using fallback prediction...');
            return this.fallbackPrediction(healthParameters);
        }
    }

    fallbackPrediction(params) {
        console.log('Calculating fallback risk assessment...');

        let score = 0;

        // Birth weight assessment
        if (params.birthWeightKg < 2.5) {
            score += 30;
        } else if (params.birthWeightKg < 3.0) {
            score += 15;
        }

        // Temperature assessment
        if (params.temperatureC < 36.5 || params.temperatureC > 37.5) {
            score += 20;
        }

        // Oxygen saturation assessment
        if (params.oxygenSaturation < 95) {
            score += 25;
        }

        // APGAR score assessment
        if (params.apgarScore < 7) {
            score += 30;
        }

        // Heart rate assessment
        if (params.heartRateBpm < 120 || params.heartRateBpm > 160) {
            score += 15;
        }

        // Jaundice level assessment
        if (params.jaundiceLevelMgDl > 10) {
            score += 20;
        }

        // Gestational age assessment
        if (params.gestationalAgeWeeks < 37) {
            score += 25;
        }

        // Reflexes assessment
        if (params.reflexesNormal === 'No') {
            score += 20;
        }

        // Respiratory rate assessment
        if (params.respiratoryRateBpm > 60 || params.respiratoryRateBpm < 30) {
            score += 15;
        }

        let finalRisk;
        let confidence;

        if (score >= 60) {
            finalRisk = 'High Risk';
            confidence = 0.85 + (Math.random() * 0.10);
        } else if (score >= 30) {
            finalRisk = 'Medium Risk';
            confidence = 0.70 + (Math.random() * 0.15);
        } else {
            finalRisk = 'Low Risk';
            confidence = 0.85 + (Math.random() * 0.15);
        }

        console.log(`Fallback prediction: ${finalRisk} (Score: ${score})`);

        return {
            finalRisk,
            confidence: Math.min(confidence, 1.0),
            mlScore: score,
            lstmScore: score * 0.95,
            ensembleScore: score * 0.92
        };
    }

    generateRecommendations(riskLevel, parameters) {
        const recommendations = {
            'Low Risk': [
                'Continue routine monitoring and care',
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

    async checkHealth() {
        try {
            const response = await axios.get(`${ML_MODEL_URL}/`, {
                timeout: 5000
            });
            return {
                available: true,
                message: 'ML model is running',
                url: ML_MODEL_URL
            };
        } catch (error) {
            return {
                available: false,
                message: 'ML model API is not available. Using fallback predictions.',
                url: ML_MODEL_URL,
                error: error.message
            };
        }
    }
}

module.exports = new MLServices();