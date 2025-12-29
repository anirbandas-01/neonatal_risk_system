function buildMLFeatures(babyInfo, healthParams, clinicalFlags) {
     if (!Array.isArray(clinicalFlags)) {
          throw new Error('clinicalFlags must be an array');
     }

  const flagSet = clinicalFlags.map(f => f.code);

  return {
    // Original numerical values (unchanged)
    gender: babyInfo.gender.toLowerCase(),
    birth_weight_kg: healthParams.birthWeightKg,
    birth_length_cm: healthParams.birthLengthCm,
    birth_head_circumference_cm: healthParams.birthHeadCircumferenceCm,
    temperature_c: healthParams.temperatureC,
    heart_rate_bpm: healthParams.heartRateBpm,
    respiratory_rate_bpm: healthParams.respiratoryRateBpm,
    oxygen_saturation: healthParams.oxygenSaturation,
    jaundice_level_mg_dl: healthParams.jaundiceLevelMgDl,
    age_days: healthParams.ageDays,
    gestational_age_weeks: healthParams.gestationalAgeWeeks,
    weight_kg: healthParams.weightKg,
    feeding_frequency_per_day: healthParams.feedingFrequencyPerDay,
    apgar_score: healthParams.apgarScore,

    // Engineered binary features (0 or 1)
    low_birth_weight: flagSet.includes("LOW_BIRTH_WEIGHT") ? 1 : 0,
    fever: flagSet.includes("FEVER") ? 1 : 0,
    hypothermia: flagSet.includes("HYPOTHERMIA") ? 1 : 0,
    respiratory_distress: flagSet.includes("TACHYPNEA") || flagSet.includes("BRADYPNEA") ? 1 : 0,
    hypoxia: flagSet.includes("LOW_OXYGEN") ? 1 : 0,
    jaundice_high: flagSet.includes("JAUNDICE_HIGH") ? 1 : 0,
    poor_feeding: flagSet.includes("POOR_FEEDING") ? 1 : 0,
    cardiac_abnormal: flagSet.includes("TACHYCARDIA") || flagSet.includes("BRADYCARDIA") ? 1 : 0,
    low_apgar: flagSet.includes("LOW_APGAR") ? 1 : 0,
    abnormal_reflexes: flagSet.includes("ABNORMAL_REFLEXES") ? 1 : 0,
    excessive_weight_loss: flagSet.includes("EXCESSIVE_WEIGHT_LOSS") ? 1 : 0,

    // Calculated features
    weight_change_percent: ((healthParams.weightKg - healthParams.birthWeightKg) / healthParams.birthWeightKg) * 100
  };
}

module.exports = buildMLFeatures;