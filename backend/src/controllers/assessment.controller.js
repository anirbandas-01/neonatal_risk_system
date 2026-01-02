const Baby = require('../models/Baby');
const mlService = require('../services/mlService');
const { neonatalRules, clinicalRiskInference } = require('../rules/neonatalRules');
const buildMLFeatures = require('../Utils/featureEngineering');

const normalize = (value) =>
  typeof value === 'string' ? value.toLowerCase() : value;


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

    const doctorId = req.doctor.id;
    
    if (!babyId || !healthParameters) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID and health parameters are required'
      });
    }

    console.log('Processing assessment for:', babyId, 'by doctor:', doctorId);


    let baby = await Baby.findOne({ babyId , doctorId});

    
    if (!baby) {
      if (!babyInfo || !parentInfo) {
        return res.status(400).json({
          success: false,
          message: 'Baby info and parent info required for new baby'
        });
      }

      baby = new Baby({
        babyId,
        doctorId,
        babyInfo,
        parentInfo,
        assessments: []
      });
    }

    
    healthParameters.feedingType = normalize(healthParameters.feedingType);
    healthParameters.immunizationsDone = normalize(healthParameters.immunizationsDone);
    healthParameters.reflexesNormal = normalize(healthParameters.reflexesNormal);

    
    console.log('🩺 Applying medical rules...');

    const healthParamsWithGender = {
  ...healthParameters,
  gender: babyInfo.gender
};
    const clinicalFlags = neonatalRules(healthParamsWithGender);
    console.log('Clinical flags detected:', clinicalFlags);

    
    console.log('🧬 Building ML features...');
    const engineeredFeatures = buildMLFeatures(babyInfo,healthParameters, clinicalFlags);
    console.log('Engineered features:', engineeredFeatures);

    console.log("🚀 Final ML payload (about to send to ML):");
    console.log(engineeredFeatures);

    
    const specificRisks = clinicalRiskInference(clinicalFlags);
    console.log('Specific risks:', specificRisks);

    
    let mlPrediction;
    try {
      mlPrediction = await mlService.predictRisk(
        baby.babyInfo,
        healthParameters,
        engineeredFeatures  
      );
    } catch (err) {
       return res.status(502).json({
    success: false,
    message: 'ML model prediction failed',
    error: err.message
  });
    }

    
    const newAssessment = {
      assessmentDate: assessmentDate || new Date(),
      healthParameters,
      riskAssessment: {
        finalRisk: mlPrediction.finalRisk,
        confidence: mlPrediction.confidence,
        recommendations: mlService.generateRecommendations(
          mlPrediction.finalRisk,
          healthParameters,
          clinicalFlags 
        ),
        mlModelScore: mlPrediction.mlScore,
        lstmModelScore: mlPrediction.lstmScore,
        ensembleScore: mlPrediction.ensembleScore,
        
        
clinicalFlags: clinicalFlags.map(f => ({
  code: f.code,
  message: f.message,
  severity: f.severity
})),
specificRisks: specificRisks
      },
      doctorNotes: doctorNotes || ''
    };

    
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
        parentInfo: baby.parentInfo,
        totalVisits: baby.totalVisits,
        latestAssessment: {
             ...latestAssessment.toObject(),
              parentInfo: baby.parentInfo
        },    
        clinicalSummary: {
          flagsDetected: clinicalFlags.length,
          highSeverityFlags: clinicalFlags.filter(f => f.severity === 'high').length,
          specificRisks: specificRisks
        }
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


exports.getBabyHistory = async (req, res) => {
  try {
    const { babyId } = req.params;
    const doctorId = req.doctor.id;

    const baby = await Baby.findOne({ babyId , doctorId});
    if (!baby) {
      return res.status(404).json({ success: false, message: 'Baby not found' });
    }

    baby.assessments.sort((a, b) => b.assessmentDate - a.assessmentDate);

    res.json({ success: true, data: baby });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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