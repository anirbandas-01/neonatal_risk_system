const Baby = require('../models/Baby');

exports.checkBabyExists = async (req, res) => {
  try {
    const { babyId } = req.params;
    const doctorId = req.doctor.id; 
    
    const baby = await Baby.findOne({ babyId , doctorId})
      .select('babyId babyInfo parentInfo totalVisits lastVisitDate currentRiskLevel');

    if (!baby) {
      return res.json({
        success: true,
        exists: false,
        message: 'Baby ID not found'
      });
    }

    res.json({
      success: true,
      exists: true,
      data: baby
    });

  } catch (error) {
    console.error('Check baby exists error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check baby existence',
      error: error.message
    });
  }
};


exports.getBabyHistory = async (req, res) => {
  try {
    const { babyId } = req.params;

    const baby = await Baby.findOne({ babyId });

    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found'
      });
    }

    // Sort assessments newest first
    baby.assessments.sort((a, b) => b.assessmentDate - a.assessmentDate);

    res.json({
      success: true,
      data: baby
    });

  } catch (error) {
    console.error('Get baby history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch baby history',
      error: error.message
    });
  }
};


exports.getAllBabies = async (req, res) => {
  try {
    const { riskLevel, search, limit = 100, skip = 0 } = req.query;
    const doctorId = req.doctor.id;

    const query = {doctorId};

    if (riskLevel && riskLevel !== 'All') {
      query.currentRiskLevel = riskLevel;
    }

    if (search) {
      query.$or = [
        { babyId: { $regex: search, $options: 'i' } },
        { 'babyInfo.name': { $regex: search, $options: 'i' } }
      ];
    }

    const babies = await Baby.find(query)
      .select('babyId babyInfo parentInfo totalVisits lastVisitDate currentRiskLevel')
      .sort({ lastVisitDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Baby.countDocuments(query);

    res.json({
      success: true,
      data: babies,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > (parseInt(skip) + parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get all babies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch babies',
      error: error.message
    });
  }
};


exports.deleteBaby = async (req, res) => {
  try {
    const { babyId } = req.params;
    const doctorId = req.doctor.id;

    const baby = await Baby.findOneAndDelete({ babyId, doctorId});

    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found'
      });
    }

    res.json({
      success: true,
      message: `Baby ${babyId} deleted successfully`
    });

  } catch (error) {
    console.error('Delete baby error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete baby',
      error: error.message
    });
  }
};