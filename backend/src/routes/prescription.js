const express = require('express');
const prescriptionController = require('../controllers/prescription.controller');

const router = express.Router();

console.log('✅ Prescription routes loaded');

// Create new prescription
router.post('/create', (req, res, next) => {
    console.log('📝 POST /api/prescription/create called');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    prescriptionController.createPrescription(req, res, next);
});

// STATIC ROUTES FIRST (to avoid conflicts with :prescriptionId)
router.get('/baby/:babyId', (req, res, next) => {
    console.log('📋 GET /api/prescription/baby/:babyId called');
    prescriptionController.getPrescriptionsByBaby(req, res, next);
});

router.get('/assessment/:assessmentId', (req, res, next) => {
    console.log('📋 GET /api/prescription/assessment/:assessmentId called');
    prescriptionController.getPrescriptionByAssessment(req, res, next);
});

// DOWNLOAD (specific route before generic :prescriptionId)
router.get('/:prescriptionId/download', (req, res, next) => {
    console.log('📥 GET /api/prescription/:prescriptionId/download called');
    prescriptionController.downloadPrescriptionPDF(req, res, next);
});

// GENERIC CRUD (these come last to avoid conflicts)
router.get('/:prescriptionId', (req, res, next) => {
    console.log('📋 GET /api/prescription/:prescriptionId called');
    prescriptionController.getPrescriptionById(req, res, next);
});

router.put('/:prescriptionId', (req, res, next) => {
    console.log('✏️ PUT /api/prescription/:prescriptionId called');
    prescriptionController.updatePrescription(req, res, next);
});

router.delete('/:prescriptionId', (req, res, next) => {
    console.log('🗑️ DELETE /api/prescription/:prescriptionId called');
    prescriptionController.deletePrescription(req, res, next);
});

module.exports = router;