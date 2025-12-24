const Baby = require('../models/Baby');

/**
 * Check if baby exists
 */
exports.checkBabyExists = async (req, res) => {
  try {
    const { babyId } = req.params;
    const baby = await Baby.findOne({ babyId })
      .select('babyId babyInfo parentInfo totalVisits lastVisitDate currentRiskLevel');

    if (!baby) {
      return res.json({ success: true, exists: false, message: 'Baby ID not found' });
    }

    res.json({ success: true, exists: true, data: baby });

  } catch (error) {
    console.error('Error checking baby existence:', error);
    res.status(500).json({ success: false, message: 'Failed to check baby existence', error: error.message });
  }
};

/**
 * Get all babies
 */
exports.getAllBabies = async (req, res) => {
  try {
    const { riskLevel, search, limit = 100, skip = 0 } = req.query;
    let query = {};

    if (riskLevel && riskLevel !== 'All') query.currentRiskLevel = riskLevel;
    if (search) query.$or = [
      { babyId: { $regex: search, $options: 'i' } },
      { 'babyInfo.name': { $regex: search, $options: 'i' } }
    ];

    const babies = await Baby.find(query)
      .select('babyId babyInfo parentInfo totalVisits lastVisitDate currentRiskLevel assessments')
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
    console.error('Error fetching babies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch babies', error: error.message });
  }
};

/**
 * Delete a baby
 */
exports.deleteBaby = async (req, res) => {
  try {
    const { babyId } = req.params;
    const baby = await Baby.findOneAndDelete({ babyId });

    if (!baby) 
        return res.status(404).json({ 
                      success: false,
                      message: 'Baby not found'
                     });

    res.json({ 
        success: true,
        message: `Baby ${babyId} and all assessments deleted successfully`
     });

  } catch (error) {
    console.error('Error deleting baby:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Failed to delete baby', error: error.message 
    });
  }
};
