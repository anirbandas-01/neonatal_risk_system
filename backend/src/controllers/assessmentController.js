const Baby = require('../models/Baby');
const MLServices = require('../services/mlService');

exports.createAssessment = async (req, res) => {
    try {
        const { babyId, healthParameters, doctorNotes } = req.body;

        if(!babyId || !healthParameters){
            return res.status(400).json({
               success: false,
               message: 'Baby ID already exists. Please use a unique ID. '    
            });
        } 
        console.log('Creating assessment for:', babyId);


        const existingBaby = await Baby.findOne({ babyId });
        if (existingBaby) {
            return res.status(400).json({
                success: false,
                message: 'Baby ID already exists. please use a unique ID'
            });
        }
        
        console.log('Getting ML prediction ......');
        const mlPrediction = await MLServices.predictionRisk(healthParameters);
        console.log('ML Prediction:', mlPrediction);
        
        const recommendations = MLServices.generateRecommendations(mlPrediction.finalRisk, 
            healthParameters);
           
            
        const assessment = new Baby({
            babyId,
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
        });

        await assessment.save();
        console.log('Assessment saved to database');

        res.status(201).json({
            success: true,
            message: 'Assessment created successfully',
            data: assessment
        });


    }catch (error) {
        console.log('Error creating assessment:', error);

        if(error.code === 11000){
            return res.status(400).json({
                success: false,
                message: 'Baby ID already exists'
            });
        }

        if (error.name === 'validationError'){
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create assessment',
            error: error.message
        });
    }
};


exports.getAssessmentByBabyId = async (req, res) => {
    try {
        const { babyId } = req.params;

        const assessments = await Baby.findOne({ babyId })
        .sort({ createdAt: -1});

        if(!assessments || assessments.length === 0){
            return res.status(404).json({
                success: false,
                message: 'No assessments found for this baby ID'
            });
        }

        res.json({
            success: true,
            data: assessments
        });

    } catch (error) {
        console.log('Error fetching assessment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assessment',
            error: error.message
        });
    }
};

exports.getAllAssessments = async (req, res)=> {
    try {
        const { riskLevel, limit=100, skip = 0} = req.query;
        
        let query = {};
        if(riskLevel){
            query['riskAssessment.finalRisk'] = riskLevel;
        }

        const assessments = await Baby.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

        const total = await Baby.countDocuments(query);

        res.json({
            success: true,
            data: assessments,
            pagination: {
                total,
                limit: parseInt(limit),
                skip: parseInt(skip),
                hasMore: total > (parseInt(skip)+ parseInt(limit))
            }
        });
    } catch (error) {
        console.log('Error fetching assessments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assessments',
            error: error.message
        });
    }
};


exports.getStatistics = async (req, res) => {
    try {
        const total = await Baby.countDocuments();
        const lowRisk = await Baby.countDocuments({ 'riskAssessment.finalRisk': 'Low Risk'});
        const mediumRisk = await Baby.countDocuments({ 'riskAssessment.finalRisk': 'Medium Risk'});
        const highRisk = await Baby.countDocuments({ 'riskAssessment.finalRisk': 'High Risk'});

        res.json({
            success: true,
            data: {
                total,
                lowRisk,
                mediumRisk,
                highRisk
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
       res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
         });
     }
};


exports.deleteAssessment = async (req, res) => {
    try {
        const { id } = req.params;

        const Assessment = await Baby.findByIdAndDelete(id);

        if(!assessment){
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }
        res.json({
            success: true,
            message: 'Assessment deleted successfully'
        });

    } catch (error) {
          console.error('Error deleting assessment:', error);
          res.status(500).json({
          success: false,
          message: 'Failed to delete assessment',
          error: error.message 
          });
    }
};