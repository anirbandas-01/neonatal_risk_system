const axios = require('axios');
require('dotenv').config();

const ML_MODEL_URL = process.env.ML_MODEL_URL || 'http://localhost:9000';
const buildMLPayload = require('../Utils/mlPayloadBuilder');

class MLServices {
    async predictRisk(babyInfo, healthParameters, engineeredFeatures = null) {
        try {
            // Use engineered features if provided, otherwise use original payload
            const mlPayload = engineeredFeatures || buildMLPayload(babyInfo, healthParameters);

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
            
            const mlResponse = response.data;
            
            if (mlResponse.finalRisk) {
                return mlResponse;
            } else if (mlResponse.risk_level) {
                console.log('Transforming ML response format...');
                
                let finalRisk;
                const riskLevel = mlResponse.risk_level.toLowerCase();
                
                if (riskLevel === 'low' || riskLevel === 'safe') {
                    finalRisk = 'Low Risk';
                } else if (riskLevel === 'medium' || riskLevel === 'at risk') {
                    finalRisk = 'Medium Risk';
                } else if (riskLevel === 'high' || riskLevel === 'critical') {
                    finalRisk = 'High Risk';
                } else {
                    finalRisk = 'Medium Risk';
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
                 throw new Error('Invalid ML response format');
            }
            
        } catch (error) {
            console.error('ML Model API Error:', error.message);
            
            if (error.code === 'ECONNREFUSED') {
                console.error('ML Model server not reachable at:', ML_MODEL_URL);
            } else if (error.code === 'ETIMEDOUT') {
                console.error('ML Model request timed out');
            } else if (error.response) {
                console.error('ML Model error response:', error.response.data);
            }
            
            throw new Error('ML model service failed');
        }
    }

generateRecommendations(riskLevel, parameters, clinicalFlags = []) {
    const baseRecommendations = {
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

    let recommendations = [...(baseRecommendations[riskLevel] || baseRecommendations['Medium Risk'])];

    const flagCodes = clinicalFlags.map(f => f.code);

    if (flagCodes.includes("LOW_BIRTH_WEIGHT")) {
        recommendations.push("Monitor for hypoglycemia and temperature instability");
    }
    if (flagCodes.includes("FEVER") || flagCodes.includes("HYPOTHERMIA")) {
        recommendations.push("Check for signs of infection immediately");
    }
    if (flagCodes.includes("TACHYPNEA") || flagCodes.includes("LOW_OXYGEN")) {
        recommendations.push("Ensure respiratory support availability");
    }
    if (flagCodes.includes("POOR_FEEDING")) {
        recommendations.push("Consider supplemental feeding support");
    }
    if (flagCodes.includes("JAUNDICE_HIGH")) {
        recommendations.push("Monitor bilirubin levels closely, consider phototherapy");
    }
    
    // 🆕 GENDER-SPECIFIC RECOMMENDATIONS
    if (flagCodes.includes("MALE_LOW_BIRTH_WEIGHT") || flagCodes.includes("MALE_UNDERWEIGHT")) {
        recommendations.push("Male infant below weight standards - increase feeding frequency and monitor growth curve");
    }
    if (flagCodes.includes("FEMALE_LOW_BIRTH_WEIGHT") || flagCodes.includes("FEMALE_UNDERWEIGHT")) {
        recommendations.push("Female infant below weight standards - increase feeding frequency and monitor growth curve");
    }
    if (flagCodes.includes("MALE_MACROSOMIA") || flagCodes.includes("FEMALE_MACROSOMIA")) {
        recommendations.push("Macrosomia detected - monitor for hypoglycemia and birth trauma complications");
    }

    return recommendations;
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