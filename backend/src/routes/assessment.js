const express = require('express');

const babyController = require('../controllers/baby.controller');
const assessmentController = require('../controllers/assessment.controller');
const statisticsController = require('../controllers/statistics.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/babies/search', babyController.searchBabies);

router.get('/baby/:babyId/exists', babyController.checkBabyExists);
router.get('/baby/:babyId/history', babyController.getBabyHistory);
router.get('/babies', babyController.getAllBabies);
router.delete('/baby/:babyId', babyController.deleteBaby);



router.post('/assess', assessmentController.createOrUpdateAssessment);
router.get('/assessment/:assessmentId', assessmentController.getAssessmentById);


router.get('/statistics', statisticsController.getStatistics);

module.exports = router;
