function buildMLPayload(health) {
    return {
        gender: health.gender.toLowerCase(),

        gestational_age_weeks: health.gestationalAgeWeeks,
        birth_weight_kg: health.birthWeightKg,
        birth_length_cm: health.birthLengthCm,
        birth_head_circumference_cm: health.birthHeadCircumferenceCm,

        age_days: health.ageDays,
        weight_kg: health.weightKg,
        length_cm: health.lengthCm,
        head_circumference_cm: health.headCircumferenceCm,

        temperature_c: health.temperatureC,
        heart_rate_bpm: health.heartRateBpm,
        respiratory_rate_bpm: health.respiratoryRateBpm,
        oxygen_saturation: health.oxygenSaturation,

        feeding_type: health.feedingType.toLowerCase(),
        feeding_frequency_per_day: health.feedingFrequencyPerDay,

        urine_output_count: health.urineOutputCount,
        stool_count: health.stoolCount,

        jaundice_level_mg_dl: health.jaundiceLevelMgDl,
        apgar_score: health.apgarScore,

        immunizations_done: health.immunizationsDone.toLowerCase(),
        reflexes_normal: health.reflexesNormal.toLowerCase()
    };
}

module.exports = buildMLPayload;