import React from 'react';
import { AlertCircle, Activity, Stethoscope, ClipboardCheck, FileText, TrendingUp, Shield, Calendar, User, ArrowLeft, Download, History, AlertTriangle, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';


const ResultsPage = () => {
  // Get assessment data from React Router location state
  // IMPORTANT: In your actual app.jsx routing, you need to import useNavigate and useLocation from 'react-router-dom'
  // const navigate = useNavigate();
  // const location = useLocation();
  // const assessmentData = location.state?.assessmentData;
  
  const [assessmentData, setAssessmentData] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  
 React.useEffect(() => {
  if (location.state?.assessmentData) {
    setAssessmentData(location.state.assessmentData);
  }
}, [location.state]);


  const getSeverityBadge = (risk) => {
    const badges = {
      'Low Risk': { color: 'bg-green-500', icon: <CheckCircle className="w-6 h-6" />, text: 'Stable', textColor: 'text-green-700', border: 'border-green-400' },
      'Medium Risk': { color: 'bg-yellow-500', icon: <AlertTriangle className="w-6 h-6" />, text: 'At Risk (Moderate)', textColor: 'text-yellow-700', border: 'border-yellow-400' },
      'High Risk': { color: 'bg-red-500', icon: <XCircle className="w-6 h-6" />, text: 'Critical', textColor: 'text-red-700', border: 'border-red-400' }
    };
    return badges[risk] || badges['Medium Risk'];
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Moderate';
    return 'Low';
  };

  const handleFollowUpAssessment = () => {
    // Create baby object exactly like BabyHistoryPage does
    const baby = {
      babyId: assessmentData.babyId,
      babyInfo: assessmentData.babyInfo,
      parentInfo: assessmentData.parentInfo || {},
      totalVisits: assessmentData.totalVisits || 1,
      currentRiskLevel: assessmentData.riskAssessment.finalRisk,
      lastVisitDate: assessmentData.assessmentDate,
      assessments: assessmentData.assessments || [
        {
          assessmentDate: assessmentData.assessmentDate,
          healthParameters: assessmentData.healthParameters,
          riskAssessment: assessmentData.riskAssessment,
          doctorNotes: assessmentData.doctorNotes
        }
      ]
    };
    
    // Navigate using same pattern as BabyHistoryPage
    navigate('/assessment', { 
       state: { baby } });
  };

  const goBack = () => {
    window.history.back();
  };

  const viewHistory = () => {
    if (assessmentData) {
      navigate(`/baby/${assessmentData.babyId}/history`);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goHome = () => {
    navigate('/HomePage');
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Assessment Data</h2>
          <p className="text-gray-600 mb-6">Unable to load assessment results. Please try again.</p>
          <button
            onClick={goHome}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const severity = getSeverityBadge(assessmentData.riskAssessment.finalRisk);
  const confidenceLevel = getConfidenceLevel(assessmentData.riskAssessment.confidence);

  // Identify abnormal findings dynamically
  const abnormalFindings = [];
  const hp = assessmentData.healthParameters;
  
  if (hp.birthWeightKg < 2.5 || hp.birthWeightKg > 4.0) {
    abnormalFindings.push({
      parameter: 'Birth Weight',
      value: `${hp.birthWeightKg} kg`,
      normalRange: '2.5 - 4.0 kg',
      relevance: hp.birthWeightKg < 2.5 ? 'Lower than expected for gestational age' : 'Higher than expected for gestational age',
      severity: 'high'
    });
  }

  if (hp.oxygenSaturation < 95) {
    abnormalFindings.push({
      parameter: 'Oxygen Saturation',
      value: `${hp.oxygenSaturation}%`,
      normalRange: '95 - 100%',
      relevance: 'Below optimal range, suggests possible respiratory compromise',
      severity: 'high'
    });
  }

  if (hp.apgarScore < 7) {
    abnormalFindings.push({
      parameter: 'APGAR Score',
      value: hp.apgarScore,
      normalRange: '7 - 10',
      relevance: 'Below optimal range, indicates need for close observation',
      severity: 'medium'
    });
  }

  if (hp.temperatureC > 37.5 || hp.temperatureC < 36.5) {
    abnormalFindings.push({
      parameter: 'Body Temperature',
      value: `${hp.temperatureC}°C`,
      normalRange: '36.5 - 37.5°C',
      relevance: hp.temperatureC > 37.5 ? 'Mild elevation, may indicate infection' : 'Below normal, may indicate hypothermia',
      severity: 'medium'
    });
  }

  if (hp.feedingFrequencyPerDay < 8) {
    abnormalFindings.push({
      parameter: 'Feeding Frequency',
      value: `${hp.feedingFrequencyPerDay} times/day`,
      normalRange: '8 - 12 times/day',
      relevance: 'Below recommended frequency, may affect weight gain and hydration',
      severity: 'medium'
    });
  }

  const clinicalRecommendations = assessmentData.riskAssessment.recommendations || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header with Navigation */}
        <div className="mb-6">
          <button 
            onClick={goBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Previous Page
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg border-l-4 border-blue-600 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center mb-3">
                  <Stethoscope className="w-8 h-8 text-blue-600 mr-3" />
                  <h1 className="text-3xl font-bold text-gray-900">Clinical Risk Assessment Summary</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700"><strong>Patient:</strong> {assessmentData.babyInfo.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-700 font-mono"><strong>ID:</strong> {assessmentData.babyId}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700"><strong>Date:</strong> {new Date(assessmentData.assessmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={viewHistory}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md"
                >
                  <History className="w-5 h-5 mr-2" />
                  View History
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md">
                  <Download className="w-5 h-5 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Summary Status Card */}
        <div className={`mb-8 rounded-2xl shadow-2xl overflow-hidden border-4 ${severity.border}`}>
          <div className={`${severity.color} p-8`}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {severity.icon}
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">Neonate Status: {severity.text}</h2>
                  <p className="text-2xl font-semibold opacity-90">
                    Overall Confidence: {confidenceLevel} ({(assessmentData.riskAssessment.confidence * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold opacity-90">
                  {assessmentData.riskAssessment.finalRisk === 'Low Risk' ? '✓' : '⚠'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Clinical Impression */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-indigo-600">
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <ClipboardCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Primary Clinical Impression</h3>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                  The neonate presents with <strong className={severity.textColor}>{severity.text.toLowerCase()} level indicators</strong> requiring {
                    assessmentData.riskAssessment.finalRisk === 'High Risk' ? 'immediate clinical attention' :
                    assessmentData.riskAssessment.finalRisk === 'Medium Risk' ? 'closer clinical observation' :
                    'routine monitoring'
                  }.
                </p>
                {abnormalFindings.length > 0 && (
                  <p className="text-gray-700 leading-relaxed">
                    Multiple parameters indicate potential concerns requiring enhanced monitoring 
                    and consideration of underlying pathophysiology.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Abnormal Clinical Findings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-600">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {abnormalFindings.length > 0 ? 'Abnormal Clinical Findings' : 'Clinical Assessment'}
                </h3>
              </div>
              
              {abnormalFindings.length > 0 ? (
                <div className="space-y-4">
                  {abnormalFindings.map((finding, index) => (
                    <div key={index} className={`border-l-4 ${finding.severity === 'high' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'} p-5 rounded-lg`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{finding.parameter}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${finding.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {finding.severity === 'high' ? 'High Priority' : 'Monitor'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Observed Value</p>
                          <p className="text-gray-900 font-bold">{finding.value}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Normal Range</p>
                          <p className="text-gray-900 font-bold">{finding.normalRange}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <strong>Clinical Relevance:</strong> {finding.relevance}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                  <p className="text-gray-800 text-lg">
                    All parameters are within normal clinical ranges. Continue routine monitoring and care.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Risk Category Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-600 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Risk Categories</h3>
              </div>
              
              <div className="space-y-3">
                {assessmentData.riskAssessment.specificRisks && Object.entries(assessmentData.riskAssessment.specificRisks).map(([category, level]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                      {category.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      level === 'high' ? 'bg-red-200 text-red-800' :
                      level === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      level === 'suspected' ? 'bg-orange-200 text-orange-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {level.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Flags */}
            {assessmentData.riskAssessment.clinicalFlags && assessmentData.riskAssessment.clinicalFlags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-600">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Clinical Flags</h3>
                </div>
                
                <div className="space-y-2">
                  {assessmentData.riskAssessment.clinicalFlags.map((flag, index) => (
                    <div key={index} className={`p-3 rounded-lg text-sm ${
                      flag.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                      'bg-yellow-50 border-l-4 border-yellow-500'
                    }`}>
                      <p className="font-semibold text-gray-900">{flag.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-600">
          <div className="flex items-start mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Clinical Recommendations</h3>
              <div className="space-y-3">
                {clinicalRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 leading-relaxed pt-1">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor's Notes */}
        {assessmentData.doctorNotes && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-gray-600">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Attending Physician Notes</h3>
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <p className="text-gray-800 leading-relaxed italic">"{assessmentData.doctorNotes}"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Decision Disclaimer */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-400 mb-8">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <Shield className="w-6 h-6 text-yellow-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clinical Decision Support Notice</h3>
              <div className="space-y-2 text-gray-800">
                <p className="leading-relaxed">
                  <strong>⚠ Important:</strong> This assessment is generated by an AI-based clinical decision support system and is intended as an adjunct to professional clinical judgment.
                </p>
                <p className="leading-relaxed">
                  <strong>Final diagnosis and treatment decisions remain the sole responsibility of the attending clinician.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          {/* <button 
            onClick={handleFollowUpAssessment}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add Follow-up Assessment
          </button> */}
          <button 
            onClick={goToDashboard}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            View All Records
          </button>
          <button 
            onClick={goHome}
            className="px-8 py-4 border-3 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Return to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;