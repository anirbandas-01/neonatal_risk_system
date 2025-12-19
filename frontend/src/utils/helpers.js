// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get risk level color
export const getRiskColor = (riskLevel) => {
  const colors = {
    'Low Risk': 'bg-green-100 text-green-800 border-green-300',
    'Medium Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'High Risk': 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[riskLevel] || colors['Medium Risk'];
};

// Get confidence bar color
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'bg-green-500';
  if (confidence >= 0.6) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Generate unique baby ID
export const generateBabyId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BABY-${timestamp}-${random}`;
};

// Format parameter value with unit
export const formatParameterValue = (value, unit) => {
  return `${parseFloat(value).toFixed(1)} ${unit}`;
};