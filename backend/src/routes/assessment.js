const express = require('express');

const babyController = require('../controllers/baby.controller');
const assessmentController = require('../controllers/assessment.controller');
const statisticsController = require('../controllers/statistics.controller');

const router = express.Router();

/* =======================
   BABY ROUTES
======================= */

router.get('/baby/:babyId/exists', babyController.checkBabyExists);
router.get('/baby/:babyId/history', babyController.getBabyHistory);
router.get('/babies', babyController.getAllBabies);
router.delete('/baby/:babyId', babyController.deleteBaby);

/* =======================
   ASSESSMENT ROUTES
======================= */

router.post('/assess', assessmentController.createOrUpdateAssessment);
router.get('/assessment/:assessmentId', assessmentController.getAssessmentById);

/* =======================
   STATISTICS ROUTES
======================= */

router.get('/statistics', statisticsController.getStatistics);

module.exports = router;
