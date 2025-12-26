export const validationRanges = {
    gestationalAgeWeeks: { min: 22, max: 42, unit: 'weeks' },
    birthWeightKg: { min: 1.0, max: 6.0, unit: 'kg' },
    birthLengthCm: { min: 35, max: 60, unit: 'cm' },
    birthHeadCircumferenceCm: { min: 25, max: 42, unit: 'cm' },
    ageDays: { min: 0, max: 60, unit: 'days' },
    weightKg: { min: 1.0, max: 6.0, unit: 'kg' },
    lengthCm: { min: 35, max: 65, unit: 'cm' },
    headCircumferenceCm: { min: 25, max: 45, unit: 'cm' },
    temperatureC: { min: 35.0, max: 40.0, unit: '°C' },
    heartRateBpm: { min: 80, max: 200, unit: 'bpm' },
    respiratoryRateBpm: { min: 20, max: 80, unit: 'bpm' },
    oxygenSaturation: { min: 70, max: 100, unit: '%' },
    feedingFrequencyPerDay: { min: 1, max: 20, unit: 'times/day' },
    urineOutputCount: { min: 0, max: 20, unit: 'times/day' },
    stoolCount: { min: 0, max: 20, unit: 'times/day' },
    jaundiceLevelMgDl: { min: 0, max: 25, unit: 'mg/dL' },
    apgarScore: { min: 0, max: 10, unit: '' }
};

export const normalRanges = {
    gestationalAgeWeeks: { min: 37, max: 42 },
    birthWeightKg: { min: 2.5, max: 4.0 },
    birthLengthCm: { min: 45, max: 55 },
    birthHeadCircumferenceCm: { min: 32, max: 37 },
    ageDays: { min: 0, max: 60 },
    weightKg: { min: 2.5, max: 4.5 },
    lengthCm: { min: 45, max: 60 },
    headCircumferenceCm: { min: 32, max: 38 },
    temperatureC: { min: 36.5, max: 37.5 },
    heartRateBpm: { min: 120, max: 160 },
    respiratoryRateBpm: { min: 30, max: 60 },
    oxygenSaturation: { min: 95, max: 100 },
    feedingFrequencyPerDay: { min: 8, max: 12 },
    urineOutputCount: { min: 6, max: 10 },
    stoolCount: { min: 3, max: 8 },
    jaundiceLevelMgDl: { min: 0, max: 5 },
    apgarScore: { min: 7, max: 10 }
};

export const validateField = (fieldName, value) => {
    const range = validationRanges[fieldName];
    
    if (!range) {
        return { isValid: true };
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        return { isValid: false, message: 'Please enter a valid number' };
    }
    
    if (numValue < range.min || numValue > range.max) {
        return {
            isValid: false,
            message: `Value must be between ${range.min} and ${range.max} ${range.unit}`
        };
    }
    
    return { isValid: true };
};

export const isInNormalRange = (fieldName, value) => {
    const range = normalRanges[fieldName];
    if (!range) return true;
    
    const numValue = parseFloat(value);
    return numValue >= range.min && numValue <= range.max;
};