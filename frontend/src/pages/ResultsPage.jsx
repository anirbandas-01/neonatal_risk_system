import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Home, History } from 'lucide-react';
import RiskAssessmentResult from '../components/RiskAssessmentResult';
import { formatDate } from '../utils/helpers';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get assessment data passed from form or history
  const assessmentData = location.state?.assessmentData;

  // If no data, redirect to home
  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Assessment Data</h2>
          <p className="text-gray-600 mb-6">Please create a new assessment first.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon!');
    // TODO: Implement PDF generation
  };

  const handleShare = () => {
    alert('Share feature coming soon!');
    // TODO: Implement share functionality
  };

  const handleViewHistory = () => {
    navigate(`/baby/${assessmentData.babyId}/history`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Risk Assessment Results
                </h1>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">
                    <strong>Baby:</strong> {assessmentData.babyInfo?.name || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Baby ID:</strong> <span className="font-mono font-semibold">{assessmentData.babyId}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Assessment Date:</strong> {formatDate(assessmentData.assessmentDate || new Date())}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleViewHistory}
                  className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <History className="w-5 h-5 mr-2" />
                  View History
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment Result Component */}
        <RiskAssessmentResult assessmentData={assessmentData} />

        {/* Additional Actions */}
        <div className="mt-8 flex justify-center flex-wrap gap-4">
          <button
            onClick={() => navigate('/assessment', { state: { baby: { babyId: assessmentData.babyId, babyInfo: assessmentData.babyInfo } } })}
            className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            Add Another Assessment
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
          >
            View All Records
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default ResultsPage;