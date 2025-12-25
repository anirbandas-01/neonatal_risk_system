const Baby = require('../models/Baby');
const mlService = require('../services/mlService');

/**
 * Create or update assessment
 */
exports.createOrUpdateAssessment = async (req, res) => {
    try {
        const { 
            isNewBaby, 
            babyId, 
            babyInfo, 
            parentInfo, 
            assessmentDate,
            healthParameters, 
            doctorNotes 
        } = req.body;
        
        // Validate required fields
        if (!babyId || !healthParameters) {
            return res.status(400).json({
                success: false,
                message: 'Baby ID and health parameters are required'
            });
        }
        
        console.log('Processing assessment for:', babyId);
        console.log('Is new baby:', isNewBaby);
        
        let baby;
        let babyInfoForML;
        
        // Get baby info for ML prediction
        if (isNewBaby) {
            if (!babyInfo || !parentInfo) {
                return res.status(400).json({
                    success: false,
                    message: 'Baby info and parent info are required for new baby'
                });
            }
            
            // Check if baby ID already exists
            const existingBaby = await Baby.findOne({ babyId });
            if (existingBaby) {
                return res.status(400).json({
                    success: false,
                    message: 'Baby ID already exists. Please use a different ID or update existing baby.'
                });
            }
            
            babyInfoForML = babyInfo;
        } else {
            // Get existing baby
            baby = await Baby.findOne({ babyId });
            
            if (!baby) {
                return res.status(404).json({
                    success: false,
                    message: 'Baby not found. Please check the Baby ID or create a new baby record.'
                });
            }
            
            babyInfoForML = baby.babyInfo;
        }
        
        // Get ML model prediction
        console.log('Getting ML prediction...');
        console.log('Baby Info for ML:', babyInfoForML);
        console.log('Health Parameters:', healthParameters);
        
        let mlPrediction;
        try {
            mlPrediction = await mlService.predictRisk(babyInfoForML, healthParameters);
            console.log('ML Prediction received:', mlPrediction);
        } catch (mlError) {
            console.error('ML Model Error:', mlError);
            
            // Use fallback prediction if ML model fails
            console.log('Using fallback prediction...');
            mlPrediction = {
                finalRisk: 'Medium Risk',
                confidence: 0.5,
                mlScore: 50,
                lstmScore: 50,
                ensembleScore: 50
            };
        }
        
        // Ensure finalRisk exists
        if (!mlPrediction || !mlPrediction.finalRisk) {
            console.error('Invalid ML prediction response:', mlPrediction);
            return res.status(500).json({
                success: false,
                message: 'ML model returned invalid response'
            });
        }
        
        // Generate recommendations
        const recommendations = mlService.generateRecommendations(
            mlPrediction.finalRisk,
            healthParameters
        );
        
        // Create assessment object
        const newAssessment = {
            assessmentDate: assessmentDate || new Date(),
            healthParameters,
            riskAssessment: {
                finalRisk: mlPrediction.finalRisk,
                confidence: mlPrediction.confidence || 0.5,
                recommendations,
                mlModelScore: mlPrediction.mlScore,
                lstmModelScore: mlPrediction.lstmScore,
                ensembleScore: mlPrediction.ensembleScore
            },
            doctorNotes: doctorNotes || ''
        };
        
        let message;
        
        if (isNewBaby) {
            // Create new baby record
            baby = new Baby({
                babyId,
                babyInfo: {
                    name: babyInfo.name,
                    dateOfBirth: babyInfo.dateOfBirth,
                    gender: babyInfo.gender,
                    bloodGroup: babyInfo.bloodGroup || 'Unknown'
                },
                parentInfo: {
                    motherName: parentInfo.motherName,
                    fatherName: parentInfo.fatherName || '',
                    contactNumber: parentInfo.contactNumber,
                    email: parentInfo.email || '',
                    address: parentInfo.address || ''
                },
                assessments: [newAssessment]
            });
            
            await baby.save();
            message = 'New baby record created with first assessment';
            console.log('Created new baby record');
            
        } else {
            // Add assessment to existing baby
            baby.assessments.push(newAssessment);
            await baby.save();
            
            message = 'New assessment added to existing baby record';
            console.log('Added assessment to existing baby');
        }
        
        // Return the latest assessment
        const latestAssessment = baby.assessments[baby.assessments.length - 1];
        
        res.status(201).json({
            success: true,
            message,
            data: {
                babyId: baby.babyId,
                babyInfo: baby.babyInfo,
                totalVisits: baby.totalVisits,
                latestAssessment: {
                    _id: latestAssessment._id,
                    assessmentDate: latestAssessment.assessmentDate,
                    healthParameters: latestAssessment.healthParameters,
                    riskAssessment: latestAssessment.riskAssessment,
                    doctorNotes: latestAssessment.doctorNotes
                }
            }
        });
        
    } catch (error) {
        console.error('Error creating/updating assessment:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Baby ID already exists'
            });
        }
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create/update assessment',
            error: error.message
        });
    }
};

/**
 * Get assessment by ID
 */
exports.getAssessmentById = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        
        const baby = await Baby.findOne({ 'assessments._id': assessmentId });
        
        if (!baby) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }
        
        const assessment = baby.assessments.id(assessmentId);
        
        res.json({
            success: true,
            data: {
                babyId: baby.babyId,
                babyInfo: baby.babyInfo,
                parentInfo: baby.parentInfo,
                assessment
            }
        });
        
    } catch (error) {
        console.error('Error fetching assessment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assessment',
            error: error.message
        });
    }
};

/**
 * Get baby history
 */
exports.getBabyHistory = async (req, res) => {
    try {
        const { babyId } = req.params;
        
        const baby = await Baby.findOne({ babyId });
        
        if (!baby) {
            return res.status(404).json({
                success: false,
                message: 'Baby not found'
            });
        }
        
        // Sort assessments by date (newest first)
        baby.assessments.sort((a, b) => b.assessmentDate - a.assessmentDate);
        
        res.json({
            success: true,
            data: baby
        });
        
    } catch (error) {
        console.error('Error fetching baby history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch baby history',
            error: error.message
        });
    }
};