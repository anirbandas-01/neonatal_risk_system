import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, TrendingDown, TrendingUp, Minus, Loader, Eye } from 'lucide-react';
import { babyAPI } from '../services/api';
import { getRiskColor, formatDate } from '../utils/helpers';

function BabyHistoryPage() {
  const { babyId } = useParams();
  const navigate = useNavigate();
  
  const [baby, setBaby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBabyHistory();
  }, [babyId]);

  const fetchBabyHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await babyAPI.getHistory(babyId);
      setBaby(response.data);
    } catch (err) {
      console.error('Error fetching baby history:', err);
      setError('Failed to load baby history');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssessment = () => {
    navigate('/assessment', {
        state: {
           baby,
           from: `/baby/${baby.babyId}/history`
           } });
  };

  const handleViewAssessment = (assessment) => {
    navigate('/results', {
      state: {
        assessmentData: {
          babyId: baby.babyId,
          babyInfo: baby.babyInfo,
          assessmentDate: assessment.assessmentDate,
          healthParameters: assessment.healthParameters,
          riskAssessment: assessment.riskAssessment,
          doctorNotes: assessment.doctorNotes
        }
      }
    });
  };

  const getRiskTrend = () => {
    if (!baby || baby.assessments.length < 2) return null;
    
    const riskLevels = { 'Low Risk': 1, 'Medium Risk': 2, 'High Risk': 3 };
    const latest = baby.assessments[0];
    const previous = baby.assessments[1];
    
    const latestLevel = riskLevels[latest.riskAssessment.finalRisk];
    const previousLevel = riskLevels[previous.riskAssessment.finalRisk];
    
    if (latestLevel < previousLevel) return 'improving';
    if (latestLevel > previousLevel) return 'worsening';
    return 'stable';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading baby history...</p>
        </div>
      </div>
    );
  }

  if (error || !baby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Baby Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load baby history'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const trend = getRiskTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          {/* Baby Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {baby.babyInfo.name}
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Baby ID</p>
                    <p className="font-mono font-semibold text-gray-800">{baby.babyId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(baby.babyInfo.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-semibold text-gray-800">{baby.babyInfo.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Blood Group</p>
                    <p className="font-semibold text-gray-800">{baby.babyInfo.bloodGroup}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Parent Contact</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Mother: {baby.parentInfo.motherName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contact: {baby.parentInfo.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAddAssessment}
                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors ml-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-2">Total Visits</p>
            <p className="text-3xl font-bold text-gray-800">{baby.totalVisits}</p>
          </div>

          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            baby.currentRiskLevel === 'Low Risk' ? 'border-green-500' :
            baby.currentRiskLevel === 'Medium Risk' ? 'border-yellow-500' :
            'border-red-500'
          }`}>
            <p className="text-sm text-gray-600 mb-2">Current Risk</p>
            <p className={`text-2xl font-bold ${
              baby.currentRiskLevel === 'Low Risk' ? 'text-green-600' :
              baby.currentRiskLevel === 'Medium Risk' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {baby.currentRiskLevel}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-2">Last Visit</p>
            <p className="text-lg font-bold text-gray-800">
              {new Date(baby.lastVisitDate).toLocaleDateString()}
            </p>
          </div>

          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            trend === 'improving' ? 'border-green-500' :
            trend === 'worsening' ? 'border-red-500' :
            'border-gray-500'
          }`}>
            <p className="text-sm text-gray-600 mb-2">Risk Trend</p>
            <div className="flex items-center">
              {trend === 'improving' && (
                <>
                  <TrendingDown className="w-6 h-6 text-green-600 mr-2" />
                  <p className="text-lg font-bold text-green-600">Improving</p>
                </>
              )}
              {trend === 'worsening' && (
                <>
                  <TrendingUp className="w-6 h-6 text-red-600 mr-2" />
                  <p className="text-lg font-bold text-red-600">Worsening</p>
                </>
              )}
              {trend === 'stable' && (
                <>
                  <Minus className="w-6 h-6 text-gray-600 mr-2" />
                  <p className="text-lg font-bold text-gray-600">Stable</p>
                </>
              )}
              {!trend && (
                <p className="text-lg font-bold text-gray-600">N/A</p>
              )}
            </div>
          </div>
        </div>

        {/* Assessment Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessment Timeline</h2>
          
          {baby.assessments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No assessments yet</p>
              <button
                onClick={handleAddAssessment}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
              >
                Create First Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {baby.assessments.map((assessment, index) => (
                <div
                  key={assessment._id}
                  className="border-l-4 border-blue-500 pl-6 relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-6 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2"></div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                          <span className="text-lg font-semibold text-gray-800">
                            {formatDate(assessment.assessmentDate)}
                          </span>
                          {index === 0 && (
                            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                        
                        <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                          getRiskColor(assessment.riskAssessment.finalRisk)
                        }`}>
                          {assessment.riskAssessment.finalRisk}
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2">
                          Confidence: {(assessment.riskAssessment.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleViewAssessment(assessment)}
                        className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        View Details
                      </button>
                    </div>

                    {/* Key Parameters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-semibold text-gray-800">
                          {assessment.healthParameters.birthWeight} kg
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="font-semibold text-gray-800">
                          {assessment.healthParameters.temperature} °C
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500">O₂ Sat</p>
                        <p className="font-semibold text-gray-800">
                          {assessment.healthParameters.oxygenSaturation}%
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-500">APGAR</p>
                        <p className="font-semibold text-gray-800">
                          {assessment.healthParameters.apgarScore}
                        </p>
                      </div>
                    </div>

                    {/* Doctor Notes */}
                    {assessment.doctorNotes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {assessment.doctorNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default BabyHistoryPage;