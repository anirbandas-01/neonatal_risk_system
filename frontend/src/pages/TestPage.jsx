import { useNavigate } from 'react-router-dom';

function TestPage() {
  const navigate = useNavigate();

  const testResultsPage = () => {
    // Mock assessment data
    const mockData = {
      babyId: 'BABY-1234567890-123',
      assessmentDate: new Date(),
      healthParameters: {
        birthWeight: 3.2,
        birthLength: 50,
        headCircumference: 34,
        temperature: 36.8,
        heartRate: 140,
        respiratoryRate: 45,
        jaundiceLevel: 5.0,
        bloodGlucose: 4.5,
        oxygenSaturation: 98,
        apgarScore: 9,
        birthDefects: 'No',
        normalReflexes: 'Yes',
        immunizations: 'Yes'
      },
      riskAssessment: {
        finalRisk: 'Low Risk',
        confidence: 0.93,
        recommendations: [
          'Continue routine monitoring and care',
          'Maintain regular feeding schedule',
          'Monitor weight gain progress',
          'Schedule next check-up as per guidelines'
        ],
        mlModelScore: 25.5,
        lstmModelScore: 24.2,
        ensembleScore: 23.8
      },
      doctorNotes: 'Healthy newborn with all parameters within normal range.'
    };

    navigate('/results', { state: { assessmentData: mockData } });
  };

  const testMediumRisk = () => {
    const mockData = {
      babyId: 'BABY-1234567890-456',
      assessmentDate: new Date(),
      healthParameters: {
        birthWeight: 2.8,
        birthLength: 48,
        headCircumference: 33,
        temperature: 37.2,
        heartRate: 155,
        respiratoryRate: 52,
        jaundiceLevel: 8.5,
        bloodGlucose: 3.8,
        oxygenSaturation: 94,
        apgarScore: 7,
        birthDefects: 'Some distress',
        normalReflexes: 'Yes',
        immunizations: 'No'
      },
      riskAssessment: {
        finalRisk: 'Medium Risk',
        confidence: 0.76,
        recommendations: [
          'Increase monitoring frequency',
          'Close observation of vital signs',
          'Consider additional diagnostic tests',
          'Ensure proper nutrition and hydration',
          'Schedule follow-up within 24-48 hours'
        ],
        mlModelScore: 45.8,
        lstmModelScore: 43.5,
        ensembleScore: 44.2
      },
      doctorNotes: 'Some parameters slightly outside normal range. Recommend close monitoring.'
    };

    navigate('/results', { state: { assessmentData: mockData } });
  };

  const testHighRisk = () => {
    const mockData = {
      babyId: 'BABY-1234567890-789',
      assessmentDate: new Date(),
      healthParameters: {
        birthWeight: 2.2,
        birthLength: 44,
        headCircumference: 31,
        temperature: 38.1,
        heartRate: 175,
        respiratoryRate: 68,
        jaundiceLevel: 15.0,
        bloodGlucose: 2.2,
        oxygenSaturation: 89,
        apgarScore: 5,
        birthDefects: 'Yes',
        normalReflexes: 'No',
        immunizations: 'No'
      },
      riskAssessment: {
        finalRisk: 'High Risk',
        confidence: 0.88,
        recommendations: [
          'Immediate medical attention required',
          'Continuous monitoring of vital signs',
          'Prepare for possible intervention',
          'Inform specialist team',
          'Keep in observation unit'
        ],
        mlModelScore: 78.3,
        lstmModelScore: 75.9,
        ensembleScore: 76.8
      },
      doctorNotes: 'Multiple critical parameters. Immediate attention required.'
    };

    navigate('/results', { state: { assessmentData: mockData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧪 Test Results Page
        </h1>
        <p className="text-gray-600 mb-6">
          Test different risk levels with mock data
        </p>
        
        <div className="space-y-3">
          <button
            onClick={testResultsPage}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Test Low Risk
          </button>

          <button
            onClick={testMediumRisk}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Test Medium Risk
          </button>

          <button
            onClick={testHighRisk}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Test High Risk
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPage;