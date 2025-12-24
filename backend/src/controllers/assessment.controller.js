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
    
    // Get ML model prediction
    console.log('Getting ML prediction...');
    const mlPrediction = await mlService.predictRisk(healthParameters);
    console.log('ML Prediction:', mlPrediction);
    
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
        confidence: mlPrediction.confidence,
        recommendations,
        mlModelScore: mlPrediction.mlScore,
        lstmModelScore: mlPrediction.lstmScore,
        ensembleScore: mlPrediction.ensembleScore
      },
      doctorNotes: doctorNotes || ''
    };
    
    let baby;
    let message;
    
    if (isNewBaby) {
      // Create new baby record
      
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
      
      baby = await Baby.findOne({ babyId });
      
      if (!baby) {
        return res.status(404).json({
          success: false,
          message: 'Baby not found. Please check the Baby ID or create a new baby record.'
        });
      }
      
      // Add new assessment
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
