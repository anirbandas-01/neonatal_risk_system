// frontend/src/components/RecentAssessmentCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, TrendingUp } from 'lucide-react';

const RecentAssessmentCard = ({ baby }) => {
  const navigate = useNavigate();

  const hoursAgo = Math.floor(
    (Date.now() - new Date(baby.lastVisitDate)) / (1000 * 60 * 60)
  );

  const timeAgo = hoursAgo < 1 
    ? 'Just now' 
    : hoursAgo === 1 
    ? '1 hour ago' 
    : `${hoursAgo} hours ago`;

  return (
    <div 
      onClick={() => navigate(`/baby/${baby.babyId}/history`)}
      className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-400"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-gray-900">
            {baby.babyInfo?.name || 'Unknown'}
          </h4>
        </div>
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
          baby.currentRiskLevel === 'High Risk' ? 'bg-red-100 text-red-800' :
          baby.currentRiskLevel === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {baby.currentRiskLevel}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-2">{baby.babyId}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{timeAgo}</span>
      </div>
    </div>
  );
};

export default RecentAssessmentCard;