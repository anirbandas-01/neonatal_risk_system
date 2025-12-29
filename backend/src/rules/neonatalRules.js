function neonatalRules(healthParams) {
  const flags = [];

  // 1. Low birth weight (general rule)
  if (healthParams.birthWeightKg < 2.5) {
    flags.push({
      code: "LOW_BIRTH_WEIGHT",
      message: "Birth weight below 2.5 kg",
      severity: "high"
    });
  }

  // 2. Fever or hypothermia
  if (healthParams.temperatureC > 37.5) {
    flags.push({
      code: "FEVER",
      message: "Elevated body temperature",
      severity: "medium"
    });
  }

  if (healthParams.temperatureC < 36.5) {
    flags.push({
      code: "HYPOTHERMIA",
      message: "Low body temperature",
      severity: "high"
    });
  }

  // 3. Respiratory distress
  if (healthParams.respiratoryRateBpm > 60) {
    flags.push({
      code: "TACHYPNEA",
      message: "Fast breathing detected",
      severity: "high"
    });
  }

  // 4. Hypoxia
  if (healthParams.oxygenSaturation < 95) {
    flags.push({
      code: "LOW_OXYGEN",
      message: "Low oxygen saturation",
      severity: "high"
    });
  }

  // 5. Heart rate abnormalities
  if (healthParams.heartRateBpm > 160) {
    flags.push({
      code: "TACHYCARDIA",
      message: "Heart rate too high",
      severity: "medium"
    });
  }

  if (healthParams.heartRateBpm < 120) {
    flags.push({
      code: "BRADYCARDIA",
      message: "Heart rate too low",
      severity: "high"
    });
  }

  // 6. Jaundice
  if (healthParams.jaundiceLevelMgDl > 12) {
    flags.push({
      code: "JAUNDICE_HIGH",
      message: "High bilirubin level",
      severity: "medium"
    });
  }

  // 7. Poor feeding
  if (healthParams.feedingFrequencyPerDay < 6) {
    flags.push({
      code: "POOR_FEEDING",
      message: "Feeding frequency is low",
      severity: "medium"
    });
  }

  // 8. Low urine output
  if (healthParams.urineOutputCount < 6) {
    flags.push({
      code: "LOW_URINE_OUTPUT",
      message: "Urine output below normal",
      severity: "medium"
    });
  }

  // 9. Low APGAR score
  if (healthParams.apgarScore < 7) {
    flags.push({
      code: "LOW_APGAR",
      message: "APGAR score below 7",
      severity: "high"
    });
  }

  // 10. Abnormal reflexes
  if (healthParams.reflexesNormal === 'no') {
    flags.push({
      code: "ABNORMAL_REFLEXES",
      message: "Reflexes not normal",
      severity: "medium"
    });
  }

  // 11. Weight loss (if current weight < birth weight significantly)
  const weightLossPercent =
    ((healthParams.birthWeightKg - healthParams.weightKg) /
      healthParams.birthWeightKg) *
    100;

  if (weightLossPercent > 10) {
    flags.push({
      code: "EXCESSIVE_WEIGHT_LOSS",
      message: `Excessive weight loss: ${weightLossPercent.toFixed(1)}%`,
      severity: "high"
    });
  }

  // 🆕 12. GENDER-SPECIFIC BIRTH WEIGHT ASSESSMENT
  if (healthParams.gender) {
    const gender = healthParams.gender.toLowerCase();

    if (gender === "male") {
      // Male newborn normal range: 2.5 – 4.3 kg (WHO standards)
      if (healthParams.birthWeightKg < 2.5) {
        flags.push({
          code: "MALE_LOW_BIRTH_WEIGHT",
          message: "Male newborn weight below normal range (< 2.5 kg)",
          severity: "high"
        });
      }
      if (healthParams.birthWeightKg > 4.3) {
        flags.push({
          code: "MALE_MACROSOMIA",
          message: "Male newborn weight above normal range (> 4.3 kg)",
          severity: "medium"
        });
      }
    }

    if (gender === "female") {
      // Female newborn normal range: 2.4 – 4.0 kg (WHO standards)
      if (healthParams.birthWeightKg < 2.4) {
        flags.push({
          code: "FEMALE_LOW_BIRTH_WEIGHT",
          message: "Female newborn weight below normal range (< 2.4 kg)",
          severity: "high"
        });
      }
      if (healthParams.birthWeightKg > 4.0) {
        flags.push({
          code: "FEMALE_MACROSOMIA",
          message: "Female newborn weight above normal range (> 4.0 kg)",
          severity: "medium"
        });
      }
    }
  }

  // 🆕 13. GENDER-SPECIFIC CURRENT WEIGHT ASSESSMENT (for age)
  if (healthParams.gender && healthParams.ageDays <= 28) {
    const gender = healthParams.gender.toLowerCase();
    
    // For neonates (0-28 days), check if current weight is appropriate
    // Typically, babies lose up to 7-10% in first week, then regain by 2 weeks
    
    if (healthParams.ageDays >= 14) {
      // By 2 weeks, should be back to birth weight or higher
      if (gender === "male" && healthParams.weightKg < 2.5) {
        flags.push({
          code: "MALE_UNDERWEIGHT",
          message: "Male infant weight below expected for age",
          severity: "high"
        });
      }
      
      if (gender === "female" && healthParams.weightKg < 2.4) {
        flags.push({
          code: "FEMALE_UNDERWEIGHT",
          message: "Female infant weight below expected for age",
          severity: "high"
        });
      }
    }
  }

  return flags;
}

function clinicalRiskInference(flags) {
  const codes = flags.map(f => f.code);

  return {
    infection_risk:
      (codes.includes("FEVER") && codes.includes("POOR_FEEDING")) ||
      (codes.includes("HYPOTHERMIA") && codes.includes("LOW_APGAR"))
        ? "suspected"
        : "low",

    respiratory_risk:
      codes.includes("TACHYPNEA") || codes.includes("LOW_OXYGEN")
        ? "high"
        : "low",

    feeding_risk:
      codes.includes("POOR_FEEDING") || codes.includes("EXCESSIVE_WEIGHT_LOSS")
        ? "high"
        : "low",

    cardiovascular_risk:
      codes.includes("TACHYCARDIA") || codes.includes("BRADYCARDIA")
        ? "medium"
        : "low",

    // 🆕 GROWTH RISK (gender-specific)
    growth_risk:
      codes.includes("MALE_LOW_BIRTH_WEIGHT") ||
      codes.includes("FEMALE_LOW_BIRTH_WEIGHT") ||
      codes.includes("MALE_UNDERWEIGHT") ||
      codes.includes("FEMALE_UNDERWEIGHT") ||
      codes.includes("EXCESSIVE_WEIGHT_LOSS")
        ? "high"
        : codes.includes("MALE_MACROSOMIA") || codes.includes("FEMALE_MACROSOMIA")
        ? "medium"
        : "low"
  };
}

module.exports = { neonatalRules, clinicalRiskInference };