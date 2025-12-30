console.log('✅ prescription routes file loaded');

const express = require('express');
const prescriptionController = require('../controllers/prescription.controller');

const router = express.Router();



/* // Create new prescription
router.post('/create', prescriptionController.createPrescription);

// Get prescription by ID
router.get('/:prescriptionId', prescriptionController.getPrescriptionById);

// Get all prescriptions for a baby
router.get('/baby/:babyId', prescriptionController.getPrescriptionsByBaby);

// Get prescription by assessment ID
router.get('/assessment/:assessmentId', prescriptionController.getPrescriptionByAssessment);

// Update prescription
router.put('/:prescriptionId', prescriptionController.updatePrescription);

// Delete prescription
router.delete('/:prescriptionId', prescriptionController.deletePrescription);

// Download prescription PDF
router.get('/:prescriptionId/download', prescriptionController.downloadPrescriptionPDF); */

router.post('/create', prescriptionController.createPrescription);

// STATIC ROUTES FIRST
router.get('/baby/:babyId', prescriptionController.getPrescriptionsByBaby);
router.get('/assessment/:assessmentId', prescriptionController.getPrescriptionByAssessment);

// DOWNLOAD (specific before generic)
router.get('/:prescriptionId/download', prescriptionController.downloadPrescriptionPDF);

// CRUD
router.get('/:prescriptionId', prescriptionController.getPrescriptionById);
router.put('/:prescriptionId', prescriptionController.updatePrescription);
router.delete('/:prescriptionId', prescriptionController.deletePrescription);

module.exports = router;