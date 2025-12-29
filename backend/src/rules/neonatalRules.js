function neonatalRules(healthParams) {
  const flags = [];

  if (healthParams.birthWeightKg < 2.5) {
    flags.push({
      code: "LOW_BIRTH_WEIGHT",
      message: "Birth weight below 2.5 kg",
      severity: "high"
    });
  }

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

  if (healthParams.respiratoryRateBpm > 60) {
    flags.push({
      code: "TACHYPNEA",
      message: "Fast breathing detected",
      severity: "high"
    });
  }

  if (healthParams.oxygenSaturation < 95) {
    flags.push({
      code: "LOW_OXYGEN",
      message: "Low oxygen saturation",
      severity: "high"
    });
  }

  if (healthParams.heartRateBpm > 160) {
    flags.push({
      code: "TACHYCARDIA",
      message: "Heart rate too high",
      severity: "medium"
    });
  }

  if (healthParams.jaundiceLevelMgDl > 12) {
    flags.push({
      code: "JAUNDICE_HIGH",
      message: "High bilirubin level",
      severity: "medium"
    });
  }

  if (healthParams.feedingFrequencyPerDay < 6) {
    flags.push({
      code: "POOR_FEEDING",
      message: "Feeding frequency is low",
      severity: "medium"
    });
  }

  if (healthParams.urineOutputCount < 6) {
    flags.push({
      code: "LOW_URINE_OUTPUT",
      message: "Urine output below normal",
      severity: "medium"
    });
  }

  if (healthParams.apgarScore < 7) {
    flags.push({
      code: "LOW_APGAR",
      message: "APGAR score below 7",
      severity: "high"
    });
  }

  if (healthParams.reflexesNormal === 'no') {
    flags.push({
      code: "ABNORMAL_REFLEXES",
      message: "Reflexes not normal",
      severity: "medium"
    });
  }

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
      codes.includes("TACHYCARDIA")
        ? "medium"
        : "low"
  };
}

module.exports = { neonatalRules, clinicalRiskInference };
