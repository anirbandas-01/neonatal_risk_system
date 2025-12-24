const express = require('express');

const babyController = require('../controllers/baby.controller.js');
const assessmentController = require('../controllers/assessment.controller.js');
const statisticsController = require('../controllers/statistics.controller.js');

const router = express.Router();


// Baby
router.get('/baby/:babyId/exists', babyController.checkBabyExists);
router.get('/babies', babyController.getAllBabies);
router.delete('/baby/:babyId', babyController.deleteBaby);


// Assessment
router.post('/assess', assessmentController.createOrUpdateAssessment);
router.get('/baby/:babyId/history', assessmentController.getBabyHistory);
router.get('/assessment/:assessmentId', assessmentController.getAssessmentById);


// Statistics
router.get('/statistics', statisticsController.getStatistics);

module.exports = router;