import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { getRiskColor, getConfidenceColor } from '../utils/helpers';

function RiskAssessmentResult({ assessmentData }) {
  
  if (!assessmentData) {
    return null;
  }

  const { riskAssessment, healthParameters } = assessmentData;
  const { finalRisk, confidence, recommendations, mlModelScore, lstmModelScore, ensembleScore } = riskAssessment;

  // Get risk icon based on level
  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'Low Risk':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'Medium Risk':
        return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
      case 'High Risk':
        return <XCircle className="w-12 h-12 text-red-600" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-gray-600" />;
    }
  };

  // Calculate confidence percentage
  const confidencePercent = (confidence * 100).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Main Risk Assessment Card */}
      <div className={`rounded-xl shadow-xl p-8 border-4 ${getRiskColor(finalRisk)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {getRiskIcon(finalRisk)}
            <div>
              <h2 className="text-3xl font-bold">Final Risk Assessment</h2>
              <p className="text-lg font-semibold mt-1">{finalRisk}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Confidence</p>
            <p className="text-3xl font-bold">{confidencePercent}%</p>
          </div>
        </div>
        
        {/* Confidence Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${getConfidenceColor(confidence)} transition-all duration-1000`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📋 Recommendations
        </h3>
        <ul className="space-y-3">
          {recommendations && recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Model Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ML Model Score */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700">ML Model</h4>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {mlModelScore ? mlModelScore.toFixed(2) : 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {mlModelScore >= 60 ? 'High confidence' : mlModelScore >= 30 ? 'Medium confidence' : 'Low confidence'}
          </p>
        </div>

        {/* LSTM Model Score */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700">LSTM Model</h4>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {lstmModelScore ? lstmModelScore.toFixed(2) : 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {lstmModelScore >= 60 ? 'High confidence' : lstmModelScore >= 30 ? 'Medium confidence' : 'Low confidence'}
          </p>
        </div>

        {/* Ensemble Score */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700">Ensemble</h4>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {ensembleScore ? ensembleScore.toFixed(2) : 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Combined prediction</p>
        </div>

      </div>

      {/* Key Parameters Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🔍 Key Parameters Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Birth Weight</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.birthWeight} kg
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 2.5-4.0 kg
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Temperature</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.temperature} °C
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 36.5-37.5 °C
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.heartRate} bpm
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 120-160 bpm
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Oxygen Sat.</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.oxygenSaturation}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 95-100%
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">APGAR Score</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.apgarScore}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 7-10
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Blood Glucose</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.bloodGlucose} mmol/L
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 2.6-7.0
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Jaundice Level</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.jaundiceLevel} mg/dL
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 0-5
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Resp. Rate</p>
            <p className="text-lg font-bold text-gray-800">
              {healthParameters.respiratoryRate} bpm
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Normal: 30-60
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default RiskAssessmentResult;