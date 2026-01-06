import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, TrendingDown, TrendingUp, Minus, Loader, Eye, Shield, Clock, History, AlertCircle, FileText } from 'lucide-react';
import { babyAPI } from '../services/api';
import { getRiskColor, formatDate } from '../utils/helpers';

// ✅ ADDED IMPORT - STEP 5
import ClinicalSummaryDashboard from '../components/ClinicalSummaryDashboard';

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
      }
    });
  };

  const handleViewAssessment = (assessment) => {
    navigate('/results', {
      state: {
        assessmentData: {
          babyId: baby.babyId,
          babyInfo: baby.babyInfo,
          parentInfo: baby.parentInfo, 
          assessmentDate: assessment.assessmentDate,
          healthParameters: assessment.healthParameters,
          riskAssessment: assessment.riskAssessment,
          doctorNotes: assessment.doctorNotes,
          _id: assessment._id,
          assessment: assessment
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

  // ✅ ADDED LOADING STATE - STEP 5
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading clinical records...</p>
        </div>
      </div>
    );
  }

  if (error || !baby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Record Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load patient history'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Return to Dashboard
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
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          {/* Patient Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {baby.babyInfo.name}
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-semibold">Patient ID</p>
                    <p className="font-mono font-semibold text-gray-800">{baby.babyId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">Date of Birth</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(baby.babyInfo.dateOfBirth).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">Gender</p>
                    <p className="font-semibold text-gray-800">{baby.babyInfo.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">Blood Group</p>
                    <p className="font-semibold text-gray-800">{baby.babyInfo.bloodGroup}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Parent/Guardian Contact</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Mother: <span className="font-semibold text-gray-800">{baby.parentInfo.motherName}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone: <span className="font-semibold text-gray-800">{baby.parentInfo.contactNumber}</span></p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAddAssessment}
                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors ml-4 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Assessment
              </button>
            </div>
          </div>
        </div>

        {/* ✅ ADDED CLINICAL SUMMARY DASHBOARD - STEP 5 */}
        <div className="mb-8">
          <ClinicalSummaryDashboard 
            baby={baby}
            assessments={baby.assessments}
          />
        </div>

        {/* Clinical Record Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-600">
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Clinical Record Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 font-semibold mb-1">Record ID</p>
              <p className="font-mono font-bold text-gray-900">{baby.babyId}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 font-semibold mb-1">Total Clinical Visits</p>
              <p className="text-2xl font-bold text-purple-700">{baby.totalVisits}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 font-semibold mb-1">First Assessment</p>
              <p className="font-semibold text-gray-900">
                {baby.assessments.length > 0 
                  ? new Date(baby.assessments[baby.assessments.length - 1].assessmentDate).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'
                }
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-600 font-semibold mb-1">Most Recent Visit</p>
              <p className="font-semibold text-gray-900">
                {new Date(baby.lastVisitDate).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Primary Care Team:</span> Clinical Assessment System
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {/* Total Visits */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">Total Clinical Visits</p>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{baby.totalVisits}</p>
            <p className="text-xs text-gray-500 mt-1">Assessment records</p>
          </div>

          {/* Current Risk */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            baby.currentRiskLevel === 'Low Risk' ? 'border-green-500' :
            baby.currentRiskLevel === 'Medium Risk' ? 'border-yellow-500' :
            'border-red-500'
          } hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">Current Risk Status</p>
              <Shield className={`w-5 h-5 ${
                baby.currentRiskLevel === 'Low Risk' ? 'text-green-500' :
                baby.currentRiskLevel === 'Medium Risk' ? 'text-yellow-500' :
                'text-red-500'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              baby.currentRiskLevel === 'Low Risk' ? 'text-green-600' :
              baby.currentRiskLevel === 'Medium Risk' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {baby.currentRiskLevel}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {baby.currentRiskLevel === 'Low Risk' ? 'Routine monitoring' :
               baby.currentRiskLevel === 'Medium Risk' ? 'Enhanced observation' :
               'Immediate attention'}
            </p>
          </div>

          {/* Last Visit */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">Last Assessment</p>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-gray-800">
              {new Date(baby.lastVisitDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.floor((new Date() - new Date(baby.lastVisitDate)) / (1000 * 60 * 60 * 24))} days ago
            </p>
          </div>

          {/* Risk Trend */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            trend === 'improving' ? 'border-green-500' :
            trend === 'worsening' ? 'border-red-500' :
            'border-gray-500'
          } hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">Risk Trajectory</p>
              {trend === 'improving' && <TrendingDown className="w-5 h-5 text-green-600" />}
              {trend === 'worsening' && <TrendingUp className="w-5 h-5 text-red-600" />}
              {trend === 'stable' && <Minus className="w-5 h-5 text-gray-600" />}
            </div>
            
            <p className={`text-lg font-bold ${
              trend === 'improving' ? 'text-green-600' :
              trend === 'worsening' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {trend === 'improving' ? 'Improving' : trend === 'worsening' ? 'Worsening' : trend === 'stable' ? 'Stable' : 'Insufficient Data'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {trend === 'improving' ? 'Positive clinical progress' :
               trend === 'worsening' ? 'Requires attention' :
               trend === 'stable' ? 'Consistent monitoring' : 'Need more assessments'}
            </p>
          </div>
        </div>

        {/* Assessment Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <History className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Clinical Assessment History</h2>
            </div>
            <span className="text-sm text-gray-600 font-semibold">
              {baby.assessments.length} Total Assessment{baby.assessments.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {baby.assessments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4 text-lg font-semibold">No Clinical Assessments on Record</p>
              <button
                onClick={handleAddAssessment}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                Create First Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {baby.assessments.map((assessment, index) => (
                <div
                  key={assessment._id}
                  className="border-l-4 border-blue-500 pl-6 relative hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  <div className="absolute left-0 top-6 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2"></div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                          <span className="text-lg font-semibold text-gray-800">
                            Assessment #{baby.assessments.length - index}
                          </span>
                          {index === 0 && (
                            <span className="ml-3 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                              Most Recent
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 font-medium">
                          {new Date(assessment.assessmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.floor((new Date() - new Date(assessment.assessmentDate)) / (1000 * 60 * 60 * 24))} days ago
                        </p>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                        getRiskColor(assessment.riskAssessment.finalRisk)
                      }`}>
                        {assessment.riskAssessment.finalRisk}
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-semibold">
                          Model Confidence Score
                        </span>
                        <span className="text-lg font-bold text-indigo-700">
                          {(assessment.riskAssessment.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Key Clinical Parameters</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">Weight (kg)</p>
                          <p className="font-semibold text-gray-800">
                            {assessment.healthParameters.weightKg || assessment.healthParameters.birthWeightKg || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">Temp (°C)</p>
                          <p className="font-semibold text-gray-800">
                            {assessment.healthParameters.temperatureC || assessment.healthParameters.temperature || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">SpO₂ (%)</p>
                          <p className="font-semibold text-gray-800">
                            {assessment.healthParameters.oxygenSaturation || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">APGAR</p>
                          <p className="font-semibold text-gray-800">
                            {assessment.healthParameters.apgarScore || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {assessment.doctorNotes && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-700">
                          <strong className="text-yellow-800">Clinical Notes:</strong> {assessment.doctorNotes}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleViewAssessment(assessment)}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      View Complete Assessment Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clinical Decision Support Disclaimer */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-400">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <Shield className="w-6 h-6 text-yellow-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clinical Decision Support Notice</h3>
              <div className="space-y-2 text-gray-800">
                <p className="leading-relaxed">
                  <strong>⚠ Important:</strong> These assessments are generated by an AI-based clinical decision support system 
                  and are intended to assist healthcare professionals in patient evaluation.
                </p>
                <p className="leading-relaxed">
                  <strong>All clinical decisions and treatment plans remain the sole responsibility of the attending physician.</strong>
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  This system is designed for use by licensed medical professionals only. 
                  Patient data is handled in accordance with HIPAA and local privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BabyHistoryPage;