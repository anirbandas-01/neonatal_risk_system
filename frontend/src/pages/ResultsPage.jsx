import React from 'react';
import { AlertCircle, Activity, Stethoscope, ClipboardCheck, FileText, TrendingUp, Shield, Calendar, User, ArrowLeft, Download, History, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const MedicalResultsPage = () => {
  // Mock data - replace with actual props
  const assessmentData = {
    babyId: 'BABY-1234567890-456',
    babyInfo: {
      name: 'Baby Smith',
      dateOfBirth: '2024-12-20',
      gender: 'Male'
    },
    assessmentDate: new Date(),
    healthParameters: {
      gestationalAgeWeeks: 38,
      birthWeightKg: 2.8,
      birthLengthCm: 48,
      birthHeadCircumferenceCm: 33,
      ageDays: 5,
      weightKg: 2.7,
      lengthCm: 48.5,
      headCircumferenceCm: 33.2,
      temperatureC: 37.2,
      heartRateBpm: 155,
      respiratoryRateBpm: 52,
      oxygenSaturation: 94,
      feedingType: 'breast',
      feedingFrequencyPerDay: 6,
      urineOutputCount: 5,
      stoolCount: 3,
      jaundiceLevelMgDl: 8.5,
      apgarScore: 7,
      immunizationsDone: 'no',
      reflexesNormal: 'yes'
    },
    riskAssessment: {
      finalRisk: 'Medium Risk',
      confidence: 0.971,
      mlScore: 45.8,
      lstmScore: 43.5,
      ensembleScore: 44.2,
      clinicalFlags: [
        { code: 'LOW_BIRTH_WEIGHT', message: 'Birth weight below expected range', severity: 'high' },
        { code: 'FEVER', message: 'Elevated body temperature', severity: 'medium' },
        { code: 'LOW_OXYGEN', message: 'Oxygen saturation below optimal', severity: 'high' },
        { code: 'POOR_FEEDING', message: 'Feeding frequency below recommended', severity: 'medium' }
      ],
      specificRisks: {
        infection_risk: 'suspected',
        respiratory_risk: 'high',
        feeding_risk: 'high',
        cardiovascular_risk: 'medium',
        growth_risk: 'high'
      }
    },
    doctorNotes: 'Some parameters slightly outside normal range. Recommend close monitoring.'
  };

  const getSeverityBadge = (risk) => {
    const badges = {
      'Low Risk': { color: 'bg-green-500', icon: <CheckCircle className="w-6 h-6" />, text: 'Stable', textColor: 'text-green-700' },
      'Medium Risk': { color: 'bg-yellow-500', icon: <AlertTriangle className="w-6 h-6" />, text: 'At Risk (Moderate)', textColor: 'text-yellow-700' },
      'High Risk': { color: 'bg-red-500', icon: <XCircle className="w-6 h-6" />, text: 'Critical', textColor: 'text-red-700' }
    };
    return badges[risk] || badges['Medium Risk'];
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Moderate';
    return 'Low';
  };

  const severity = getSeverityBadge(assessmentData.riskAssessment.finalRisk);
  const confidenceLevel = getConfidenceLevel(assessmentData.riskAssessment.confidence);

  // Identify abnormal findings
  const abnormalFindings = [
    {
      parameter: 'Birth Weight',
      value: `${assessmentData.healthParameters.birthWeightKg} kg`,
      normalRange: '2.5 - 4.0 kg',
      relevance: 'Lower than expected for gestational age, may indicate intrauterine growth restriction',
      severity: 'high'
    },
    {
      parameter: 'Oxygen Saturation',
      value: `${assessmentData.healthParameters.oxygenSaturation}%`,
      normalRange: '95 - 100%',
      relevance: 'Borderline low, suggests possible respiratory compromise',
      severity: 'high'
    },
    {
      parameter: 'APGAR Score',
      value: assessmentData.healthParameters.apgarScore,
      normalRange: '7 - 10',
      relevance: 'Below optimal range, indicates need for close observation',
      severity: 'medium'
    },
    {
      parameter: 'Body Temperature',
      value: `${assessmentData.healthParameters.temperatureC}°C`,
      normalRange: '36.5 - 37.5°C',
      relevance: 'Mild elevation, may indicate infection or environmental factors',
      severity: 'medium'
    },
    {
      parameter: 'Feeding Frequency',
      value: `${assessmentData.healthParameters.feedingFrequencyPerDay} times/day`,
      normalRange: '8 - 12 times/day',
      relevance: 'Below recommended frequency, may affect weight gain and hydration',
      severity: 'medium'
    }
  ];

  const clinicalRecommendations = [
    'Increase monitoring frequency to every 4–6 hours for vital signs assessment',
    'Maintain close observation of oxygen saturation and respiratory pattern',
    'Consider additional diagnostic investigations if condition worsens or fails to improve',
    'Ensure adequate nutrition and fluid intake; evaluate feeding technique with lactation consultant',
    'Schedule clinical reassessment within 24–48 hours to monitor progress',
    'Monitor for signs of infection given elevated temperature and multiple risk factors',
    'Keep detailed records of all vital signs, feeding patterns, and urine/stool output'
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header with Navigation */}
        <div className="mb-6">
          <button 
             onClick={() => navigate('/HomePage')}
             className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors font-semibold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
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
                 onClick={() => navigate('/baby/:babyId/history')}                
                 className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md">
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

        {/* SECTION 1: Clinical Summary Status Card */}
        <div className={`mb-8 rounded-2xl shadow-2xl overflow-hidden border-4 ${severity.color === 'bg-green-500' ? 'border-green-400' : severity.color === 'bg-yellow-500' ? 'border-yellow-400' : 'border-red-400'}`}>
          <div className={`${severity.color} p-8`}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {severity.icon}
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">Neonate Status: {severity.text}</h2>
                  <p className="text-2xl font-semibold opacity-90">Overall Confidence: {confidenceLevel} ({(assessmentData.riskAssessment.confidence * 100).toFixed(1)}%)</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold opacity-90">
                  {assessmentData.riskAssessment.finalRisk === 'Low Risk' ? '✓' : 
                   assessmentData.riskAssessment.finalRisk === 'Medium Risk' ? '⚠' : '⚠'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Primary Clinical Impression */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-indigo-600">
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <ClipboardCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Primary Clinical Impression</h3>
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                  The neonate presents with <strong className={severity.textColor}>moderate risk indicators</strong> requiring closer clinical observation. 
                  No immediate life-threatening abnormalities detected, however deviation from normal physiological ranges has been observed.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Multiple parameters indicate potential concerns including <strong>birth weight below expected range</strong>, 
                  <strong> borderline oxygen saturation</strong>, and <strong>suboptimal feeding patterns</strong>. 
                  The combination of these findings, along with slightly elevated temperature, warrants enhanced monitoring 
                  and consideration of underlying pathophysiology.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* SECTION 3: Abnormal Clinical Findings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-600">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Abnormal Clinical Findings</h3>
              </div>
              
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
                {Object.entries(assessmentData.riskAssessment.specificRisks).map(([category, level]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                      {category.replace('_', ' ')}
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-600">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Clinical Flags</h3>
              </div>
              
              <div className="space-y-2">
                {assessmentData.riskAssessment.clinicalFlags?.map((flag, index) => (
                  <div key={index} className={`p-3 rounded-lg text-sm ${
                    flag.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                    'bg-yellow-50 border-l-4 border-yellow-500'
                  }`}>
                    <p className="font-semibold text-gray-900">{flag.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 4: AI-Assisted Risk Interpretation */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
          <div className="flex items-start mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Assisted Risk Interpretation</h3>
              <div className="bg-white border-l-4 border-blue-600 p-6 rounded-lg shadow-md">
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                  Based on analysis of neonatal physiological parameters, the AI model estimates a <strong className={severity.textColor}>{severity.text.toLowerCase()} level</strong> with <strong>{confidenceLevel.toLowerCase()} confidence</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This assessment is derived from patterns observed in similar neonatal cases and is intended to support clinical decision-making. 
                  The model has analyzed {Object.keys(assessmentData.healthParameters).length} distinct parameters and identified {abnormalFindings.length} findings requiring attention.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Model Performance:</strong> The ensemble prediction system combines multiple analytical approaches 
                    to achieve robust risk stratification. Confidence level of {confidenceLevel} indicates {
                      confidenceLevel === 'High' ? 'strong agreement across models and clear pattern recognition' :
                      confidenceLevel === 'Moderate' ? 'reasonable model consensus with some parameter variability' :
                      'uncertainty due to conflicting parameters or limited data patterns'
                    }.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Clinical Recommendations */}
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

        {/* SECTION 6: Clinical Decision Disclaimer */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-400">
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
                  <strong>Final diagnosis and treatment decisions remain the sole responsibility of the attending clinician.</strong> This system does not replace comprehensive clinical evaluation, physical examination, or laboratory investigations.
                </p>
                <p className="text-sm text-gray-700 mt-3">
                  For medical emergencies or rapidly deteriorating patients, immediate clinical intervention takes precedence over automated assessments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
           
           className="mt-8 flex justify-center gap-4 flex-wrap">
          <button 
            onClick={() => navigate('/assessment')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
            Add Follow-up Assessment
          </button>
          <button className="px-8 py-4 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
            View All Records
          </button>
          <button className="px-8 py-4 border-3 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
            Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default MedicalResultsPage;