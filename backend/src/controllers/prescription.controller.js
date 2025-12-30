const Prescription = require('../models/Prescription');
const Baby = require('../models/Baby');

/**
 * CREATE NEW PRESCRIPTION
 * POST /api/prescription/create
 */
exports.createPrescription = async (req, res) => {
  try {
    const {
      doctor,
      patient,
      assessment_id,
      diagnosis_summary,
      medicines,
      advice
    } = req.body;

    // Validate required fields
    if (!doctor || !patient || !assessment_id || !diagnosis_summary || !medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify baby exists
    const baby = await Baby.findOne({ babyId: patient.baby_id });
    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found'
      });
    }

    // Verify assessment exists
    const assessmentExists = baby.assessments.id(assessment_id);
    if (!assessmentExists) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Create prescription
    const prescription = new Prescription({
      doctor,
      patient,
      assessment_id,
      diagnosis_summary,
      medicines,
      advice
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });

  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prescription',
      error: error.message
    });
  }
};

/**
 * GET PRESCRIPTION BY ID
 * GET /api/prescription/:prescriptionId
 */
exports.getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      data: prescription
    });

  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescription',
      error: error.message
    });
  }
};

/**
 * GET ALL PRESCRIPTIONS FOR A BABY
 * GET /api/prescription/baby/:babyId
 */
exports.getPrescriptionsByBaby = async (req, res) => {
  try {
    const { babyId } = req.params;

    const prescriptions = await Prescription.find({ 'patient.baby_id': babyId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });

  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescriptions',
      error: error.message
    });
  }
};

/**
 * GET PRESCRIPTION FOR SPECIFIC ASSESSMENT
 * GET /api/prescription/assessment/:assessmentId
 */
exports.getPrescriptionByAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const prescription = await Prescription.findOne({ assessment_id: assessmentId });
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'No prescription found for this assessment'
      });
    }

    res.json({
      success: true,
      data: prescription
    });

  } catch (error) {
    console.error('Get prescription by assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescription',
      error: error.message
    });
  }
};

/**
 * UPDATE PRESCRIPTION
 * PUT /api/prescription/:prescriptionId
 */
exports.updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updates = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      updates,
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription
    });

  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prescription',
      error: error.message
    });
  }
};

/**
 * DELETE PRESCRIPTION
 * DELETE /api/prescription/:prescriptionId
 */
exports.deletePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findByIdAndDelete(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });

  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete prescription',
      error: error.message
    });
  }
};

/**
 * DOWNLOAD PRESCRIPTION PDF
 * GET /api/prescription/:prescriptionId/download
 */
const { generatePrescriptionPDF } = require('../services/prescriptionPdfService');

exports.downloadPrescriptionPDF = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription.patient.baby_id}-${Date.now()}.pdf`);

    // Generate and pipe PDF to response
    const pdfDoc = generatePrescriptionPDF(prescription);
    pdfDoc.pipe(res);

  } catch (error) {
    console.error('Download prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download prescription',
      error: error.message
    });
  }
};