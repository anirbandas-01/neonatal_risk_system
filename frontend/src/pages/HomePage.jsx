import { Link } from 'react-router-dom';
import { Activity, FileText, LayoutDashboard, TestTube } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            👶 Newborn Health Monitor
          </h1>
          <p className="text-gray-600 mt-2">
            AI-Powered Risk Assessment for Neonatal Care
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* New Assessment Card */}
          <Link to="/assessment">
            <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                New Assessment
              </h3>
              <p className="text-gray-600 text-sm">
                Create a new health risk assessment for a newborn
              </p>
            </div>
          </Link>

          {/* View Dashboard Card */}
          <Link to="/dashboard">
            <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
                <LayoutDashboard className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Dashboard
              </h3>
              <p className="text-gray-600 text-sm">
                View all assessments and patient records
              </p>
            </div>
          </Link>

          {/* Reports Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group opacity-75">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Reports
            </h3>
            <p className="text-gray-600 text-sm">
              Generate and export assessment reports
            </p>
            <span className="inline-block mt-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              Coming Soon
            </span>
          </div>

          {/* Test Page Card (for development) */}
          <Link to="/test">
            <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer group border-2 border-dashed border-orange-300">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4 group-hover:bg-orange-200 transition-colors">
                <TestTube className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Test Page
              </h3>
              <p className="text-gray-600 text-sm">
                Development testing area
              </p>
              <span className="inline-block mt-2 text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded">
                Dev Only
              </span>
            </div>
          </Link>

        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About the System
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This AI-powered system helps healthcare professionals assess health risks in newborns. 
            By analyzing vital parameters and medical history, it provides risk classifications and 
            recommendations for appropriate care levels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📊 ML Model</h4>
              <p className="text-sm text-gray-600">Advanced machine learning for accurate predictions</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">⚡ LSTM Model</h4>
              <p className="text-sm text-gray-600">Deep learning for pattern recognition</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Ensemble</h4>
              <p className="text-sm text-gray-600">Combined model for best accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;