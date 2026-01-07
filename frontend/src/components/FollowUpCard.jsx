// frontend/src/components/FollowUpCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, FileText } from 'lucide-react';

const FollowUpCard = ({ baby }) => {
  const navigate = useNavigate();

  const daysSinceLastVisit = Math.floor(
    (Date.now() - new Date(baby.lastVisitDate)) / (1000 * 60 * 60 * 24)
  );

  const getFollowUpReason = () => {
    if (baby.currentRiskLevel === 'High Risk') {
      return 'Daily monitoring required';
    }
    if (baby.currentRiskLevel === 'Medium Risk') {
      return 'Scheduled follow-up (every 3-4 days)';
    }
    return 'Weekly check-up due';
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-yellow-600" />
            <h4 className="font-semibold text-gray-900">
              {baby.babyInfo?.name || 'Unknown'}
            </h4>
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
              baby.currentRiskLevel === 'High Risk' ? 'bg-red-200 text-red-800' :
              baby.currentRiskLevel === 'Medium Risk' ? 'bg-yellow-200 text-yellow-800' :
              'bg-green-200 text-green-800'
            }`}>
              {baby.currentRiskLevel}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{baby.babyId}</p>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Clock className="w-3 h-3" />
            <span>{getFollowUpReason()}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Last seen: {daysSinceLastVisit} day{daysSinceLastVisit !== 1 ? 's' : ''} ago
          </p>
        </div>
        <button
          onClick={() => navigate('/assessment', { state: { baby } })}
          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-xs transition-colors"
        >
          Assess
        </button>
      </div>
    </div>
  );
};

export default FollowUpCard;