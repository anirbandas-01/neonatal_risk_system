import { useNavigate } from 'react-router-dom';
import { Calendar, User, TrendingUp, Eye } from 'lucide-react';
import { getRiskColor, formatDate } from '../utils/helpers';

function AssessmentCard({ assessment }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/results', { 
      state: { assessmentData: assessment } 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-gray-300">
      {/* Header with Risk Level */}
      <div className={`p-4 ${getRiskColor(assessment.riskAssessment.finalRisk)}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {assessment.riskAssessment.finalRisk}
          </h3>
          <span className="text-sm font-semibold">
            {(assessment.riskAssessment.confidence * 100).toFixed(0)}% Confidence
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Baby ID */}
        <div className="flex items-center mb-3">
          <User className="w-5 h-5 text-gray-500 mr-2" />
          <span className="font-mono text-sm text-gray-700 font-semibold">
            {assessment.babyId}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center mb-3">
          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">
            {formatDate(assessment.createdAt || assessment.assessmentDate)}
          </span>
        </div>

        {/* Key Parameters */}
        <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-gray-200">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Weight</p>
            <p className="text-sm font-semibold text-gray-800">
              {assessment.healthParameters.birthWeight} kg
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Temp</p>
            <p className="text-sm font-semibold text-gray-800">
              {assessment.healthParameters.temperature} °C
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">O₂ Sat</p>
            <p className="text-sm font-semibold text-gray-800">
              {assessment.healthParameters.oxygenSaturation}%
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">APGAR</p>
            <p className="text-sm font-semibold text-gray-800">
              {assessment.healthParameters.apgarScore}
            </p>
          </div>
        </div>

        {/* Model Score */}
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Ensemble Score</span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {assessment.riskAssessment.ensembleScore?.toFixed(1) || 'N/A'}
          </span>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full flex items-center justify-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <Eye className="w-5 h-5 mr-2" />
          View Details
        </button>
      </div>
    </div>
  );
}

export default AssessmentCard;