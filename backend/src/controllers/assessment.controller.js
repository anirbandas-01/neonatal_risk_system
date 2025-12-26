const Baby = require('../models/Baby');
const mlService = require('../services/mlService');

const normalize = (value) =>
  typeof value === 'string' ? value.toLowerCase() : value;

/**
 * CREATE OR UPDATE ASSESSMENT
 */
exports.createOrUpdateAssessment = async (req, res) => {
  try {
    const {
      babyId,
      babyInfo,
      parentInfo,
      assessmentDate,
      healthParameters,
      doctorNotes
    } = req.body;

    if (!babyId || !healthParameters) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID and health parameters are required'
      });
    }

    console.log('Processing assessment for:', babyId);

    // 1️⃣ Find baby
    let baby = await Baby.findOne({ babyId });

    // 2️⃣ Create baby if not exists
    if (!baby) {
      if (!babyInfo || !parentInfo) {
        return res.status(400).json({
          success: false,
          message: 'Baby info and parent info required for new baby'
        });
      }

      baby = new Baby({
        babyId,
        babyInfo,
        parentInfo,
        assessments: []
      });
    }

    // 3️⃣ Normalize enums
    healthParameters.feedingType = normalize(healthParameters.feedingType);
    healthParameters.immunizationsDone = normalize(healthParameters.immunizationsDone);
    healthParameters.reflexesNormal = normalize(healthParameters.reflexesNormal);

    // 4️⃣ ML prediction
    let mlPrediction;
    try {
      mlPrediction = await mlService.predictRisk(
        baby.babyInfo,
        healthParameters
      );
    } catch (err) {
      console.error('ML error, using fallback');
      mlPrediction = {
        finalRisk: 'Medium Risk',
        confidence: 0.5,
        mlScore: 50,
        lstmScore: 50,
        ensembleScore: 50
      };
    }

    // 5️⃣ Create assessment
    const newAssessment = {
      assessmentDate: assessmentDate || new Date(),
      healthParameters,
      riskAssessment: {
        finalRisk: mlPrediction.finalRisk,
        confidence: mlPrediction.confidence,
        recommendations: mlService.generateRecommendations(
          mlPrediction.finalRisk,
          healthParameters
        ),
        mlModelScore: mlPrediction.mlScore,
        lstmModelScore: mlPrediction.lstmScore,
        ensembleScore: mlPrediction.ensembleScore
      },
      doctorNotes: doctorNotes || ''
    };

    // 6️⃣ Push & save
    baby.assessments.push(newAssessment);
    await baby.save();

    const latestAssessment = baby.assessments[baby.assessments.length - 1];

    res.status(201).json({
      success: true,
      message: baby.assessments.length === 1
        ? 'New baby created with first assessment'
        : 'Assessment added successfully',
      data: {
        babyId: baby.babyId,
        babyInfo: baby.babyInfo,
        totalVisits: baby.totalVisits,
        latestAssessment
      }
    });

  } catch (error) {
    console.error('Assessment error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create/update assessment',
      error: error.message
    });
  }
};

/**
 * GET BABY HISTORY
 */
exports.getBabyHistory = async (req, res) => {
  try {
    const { babyId } = req.params;

    const baby = await Baby.findOne({ babyId });
    if (!baby) {
      return res.status(404).json({ success: false, message: 'Baby not found' });
    }

    baby.assessments.sort((a, b) => b.assessmentDate - a.assessmentDate);

    res.json({ success: true, data: baby });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET ASSESSMENT BY ID
 */
exports.getAssessmentById = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const baby = await Baby.findOne({ 'assessments._id': assessmentId });
    if (!baby) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.json({
      success: true,
      data: baby.assessments.id(assessmentId)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
