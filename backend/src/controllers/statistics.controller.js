const Baby = require('../models/Baby');

exports.getStatistics = async (req, res) => {
  // your existing statistics logic
  try {
    const totalBabies = await Baby.countDocuments();
    const lowRisk = await Baby.countDocuments({ currentRiskLevel: 'Low Risk' });
    const mediumRisk = await Baby.countDocuments({ currentRiskLevel: 'Medium Risk' });
    const highRisk = await Baby.countDocuments({ currentRiskLevel: 'High Risk' });
    
    // Total assessments across all babies
    const allBabies = await Baby.find();
    const totalAssessments = allBabies.reduce((sum, baby) => sum + baby.totalVisits, 0);
    
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
