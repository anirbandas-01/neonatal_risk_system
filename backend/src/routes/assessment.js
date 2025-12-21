const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

// POST /api/assess - Create new assessment
router.post('/assess', assessmentController.createAssessment);

// GET /api/assess/:babyId - Get assessments by baby ID
router.get('/assess/:babyId', assessmentController.getAssessmentByBabyId);

// GET /api/assessments - Get all assessments
router.get('/assessments', assessmentController.getAllAssessments);

// GET /api/assessments/stats - Get statistics
router.get('/assessments/stats', assessmentController.getStatistics);

// DELETE /api/assess/:id - Delete assessment
router.delete('/assess/:id', assessmentController.deleteAssessment);

module.exports = router;