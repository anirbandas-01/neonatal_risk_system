function buildMLFeatures(babyInfo, healthParams, clinicalFlags) {
     if (!Array.isArray(clinicalFlags)) {
          throw new Error('clinicalFlags must be an array');
     }

  const flagSet = clinicalFlags.map(f => f.code);

  return {
    // 🔹 ORIGINAL FIELDS (keep these)
    gender: babyInfo.gender.toLowerCase(),
    
    gestational_age_weeks: healthParams.gestationalAgeWeeks,
    birth_weight_kg: healthParams.birthWeightKg,
    birth_length_cm: healthParams.birthLengthCm,
    birth_head_circumference_cm: healthParams.birthHeadCircumferenceCm,
    
    age_days: healthParams.ageDays,
    weight_kg: healthParams.weightKg,
    length_cm: healthParams.lengthCm,                           // ✅ ADD THIS
    head_circumference_cm: healthParams.headCircumferenceCm,    // ✅ ADD THIS
    
    temperature_c: healthParams.temperatureC,
    heart_rate_bpm: healthParams.heartRateBpm,
    respiratory_rate_bpm: healthParams.respiratoryRateBpm,
    oxygen_saturation: healthParams.oxygenSaturation,
    
    feeding_type: healthParams.feedingType,                     // ✅ ADD THIS
    feeding_frequency_per_day: healthParams.feedingFrequencyPerDay,
    
    urine_output_count: healthParams.urineOutputCount,          // ✅ ADD THIS
    stool_count: healthParams.stoolCount,                       // ✅ ADD THIS
    
    jaundice_level_mg_dl: healthParams.jaundiceLevelMgDl,
    apgar_score: healthParams.apgarScore,
    
    immunizations_done: healthParams.immunizationsDone,         // ✅ ADD THIS
    reflexes_normal: healthParams.reflexesNormal,               // ✅ ADD THIS

    // 🔹 ENGINEERED BINARY FEATURES (keep these)
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

    // 🔹 CALCULATED FEATURES (keep these)
    weight_change_percent: ((healthParams.weightKg - healthParams.birthWeightKg) / healthParams.birthWeightKg) * 100
  };
}

module.exports = buildMLFeatures;