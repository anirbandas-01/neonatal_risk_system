// frontend/src/components/UrgentAttentionCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, TrendingUp, Eye, FileText } from 'lucide-react';

const UrgentAttentionCard = ({ baby }) => {
  const navigate = useNavigate();

  const daysSinceLastVisit = Math.floor(
    (Date.now() - new Date(baby.lastVisitDate)) / (1000 * 60 * 60 * 24)
  );

  const getReason = () => {
    if (baby.currentRiskLevel === 'High Risk' && daysSinceLastVisit >= 2) {
      return `High risk patient, last seen ${daysSinceLastVisit} days ago`;
    }
    if (baby.currentRiskLevel === 'Medium Risk' && daysSinceLastVisit >= 5) {
      return `Medium risk, overdue for follow-up (${daysSinceLastVisit} days)`;
    }
    
    // Check for critical flags
    if (baby.assessments && baby.assessments.length > 0) {
      const lastAssessment = baby.assessments[baby.assessments.length - 1];
      const flags = lastAssessment.riskAssessment?.clinicalFlags || [];
      const criticalFlags = flags.filter(f => f.severity === 'high');
      
      if (criticalFlags.length > 0) {
        return `Critical findings: ${criticalFlags[0].message}`;
      }
    }

    return 'Requires immediate attention';
  };

  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <h4 className="font-bold text-gray-900 text-lg">
              {baby.babyInfo?.name || 'Unknown'}
            </h4>
            <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded-full">
              {baby.currentRiskLevel}
            </span>
          </div>
          <p className="text-sm text-gray-700 font-mono ml-7">{baby.babyId}</p>
        </div>
      </div>

      <div className="ml-7 space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{getReason()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <span>Age: {Math.floor((Date.now() - new Date(baby.babyInfo.dateOfBirth)) / (1000 * 60 * 60 * 24))} days</span>
        </div>
      </div>

      <div className="flex gap-2 ml-7">
        <button
          onClick={() => navigate(`/baby/${baby.babyId}/history`)}
          className="flex-1 px-3 py-2 bg-white hover:bg-gray-50 border-2 border-red-300 text-red-700 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          View History
        </button>
        <button
          onClick={() => navigate('/assessment', { state: { baby } })}
          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Assess Now
        </button>
      </div>
    </div>
  );
};

export default UrgentAttentionCard;