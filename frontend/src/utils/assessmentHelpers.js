// Calculate baby's current age from birth date
export const calculateAgeDays = (dateOfBirth) => {
  const birth = new Date(dateOfBirth);
  const now = new Date();
  const diffTime = Math.abs(now - birth);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Identify which fields typically change between visits
export const getFieldCategories = () => ({
  // Birth info - NEVER changes
  birthInfo: [
    'gestationalAgeWeeks',
    'birthWeightKg',
    'birthLengthCm',
    'birthHeadCircumferenceCm'
  ],
  
  // Current measurements - ALWAYS changes
  currentMeasurements: [
    'ageDays',
    'weightKg',
    'lengthCm',
    'headCircumferenceCm'
  ],
  
  // Vital signs - ALWAYS changes
  vitalSigns: [
    'temperatureC',
    'heartRateBpm',
    'respiratoryRateBpm',
    'oxygenSaturation'
  ],
  
  // Feeding - MAY change
  feeding: [
    'feedingType',
    'feedingFrequencyPerDay',
    'urineOutputCount',
    'stoolCount'
  ],
  
  // Clinical - MAY change
  clinical: [
    'jaundiceLevelMgDl',
    'apgarScore',
    'immunizationsDone',
    'reflexesNormal'
  ]
});

// Pre-fill form data from last assessment
export const prefillFromLastAssessment = (lastAssessment, babyInfo) => {
  if (!lastAssessment) return {};
  
  return {
    ...lastAssessment.healthParameters,
    // Update age to current
    ageDays: calculateAgeDays(babyInfo.dateOfBirth)
  };
};

// Compare current form with last assessment
export const getChangedFields = (currentData, lastData) => {
  const changes = new Set();
  
  Object.keys(currentData).forEach(key => {
    if (currentData[key] !== lastData[key]) {
      changes.add(key);
    }
  });
  
  return changes;
};