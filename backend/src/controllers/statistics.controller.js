const Baby = require('../models/Baby');

exports.getStatistics = async (req, res) => {
  // your existing statistics logic
  try {

    const doctorId = req.doctor.id;

    const totalBabies = await Baby.countDocuments({ doctorId });
    const lowRisk = await Baby.countDocuments({doctorId, currentRiskLevel: 'Low Risk' });
    const mediumRisk = await Baby.countDocuments({ doctorId, currentRiskLevel: 'Medium Risk' });
    const highRisk = await Baby.countDocuments({doctorId, currentRiskLevel: 'High Risk' });
    
    const babies = await Baby.find({ doctorId }).select('assessments');
    const totalAssessments = babies.reduce(
      (sum, baby) => sum + baby.assessments.length,
      0
    );
    
    res.json({
      success: true,
      data: {
        totalBabies,
        totalAssessments,
        lowRisk,
        mediumRisk,
        highRisk,
        averageVisitsPerBaby: totalBabies > 0 ? (totalAssessments / totalBabies).toFixed(1) : 0
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
