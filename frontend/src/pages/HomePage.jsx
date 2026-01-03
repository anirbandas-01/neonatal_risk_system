// src/pages/HomePage.jsx - PRODUCTION VERSION

import { Link, useNavigate } from 'react-router-dom';
import { Activity, FileText, LayoutDashboard, TestTube, Heart, Shield, Clock, TrendingUp } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section - Clinical Focus */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-12 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Clinical Neonatal Assessment Portal
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Decision-support system for neonatal risk evaluation and follow-up care.
            </p>
            <p className="text-sm text-blue-200 italic max-w-3xl mx-auto">
              This system assists clinical decision-making and does not replace professional medical judgment.
            </p>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
            <span className="w-1 h-10 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-full mr-4"></span>
            Clinical Actions
            <span className="w-1 h-10 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-full ml-4"></span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* New Clinical Assessment Card */}
            <Link 
              to="/assessment"
              state={{ from: '/HomePage' }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 h-full flex flex-col">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8">
                  <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Activity className="w-10 h-10 text-blue-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    New Clinical Assessment
                  </h3>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                    Initiate a structured neonatal clinical assessment including vital signs, 
                    anthropometric measurements, and risk indicators.
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Begin Assessment</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Patient Records Dashboard Card */}
            <Link to="/dashboard" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-green-500 h-full flex flex-col">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-8">
                  <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="w-10 h-10 text-green-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Patient Records Dashboard
                  </h3>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                    Access comprehensive patient records, view assessment history, and manage 
                    longitudinal tracking of neonatal cases.
                  </p>
                  <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>View Records</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Clinical Reports Card */}
            <div className="group cursor-not-allowed">
              <div className="bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border-2 border-gray-200 h-full flex flex-col opacity-75">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8">
                  <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-purple-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Clinical Reports & Documentation
                  </h3>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                    Generate comprehensive clinical documentation, export assessment data, 
                    and produce standardized medical reports.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-semibold">Under Development</span>
                    <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* System Characteristics Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            System Characteristics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Clinical Decision Support</h4>
              <p className="text-gray-600 leading-relaxed">
                Based on validated neonatal parameters and historical data
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-green-600" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Longitudinal Patient Tracking</h4>
              <p className="text-gray-600 leading-relaxed">
                Supports follow-up visits and growth trend monitoring
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Data Privacy & Security</h4>
              <p className="text-gray-600 leading-relaxed">
                Patient data handled according to clinical data protection principles
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-orange-600" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Rapid Clinical Summary</h4>
              <p className="text-gray-600 leading-relaxed">
                Assessment summaries generated for clinician review
              </p>
            </div>

          </div>
        </div>

        {/* Clinical Decision Support Technology */}
        <div className="bg-white rounded-2xl shadow-lg p-12 border-t-4 border-blue-600 mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Clinical Decision Support Technology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">SRA</span>
              </div>
              <h4 className="font-bold text-gray-800 text-xl mb-4">Statistical Risk Assessment Model</h4>
              <p className="text-gray-700 leading-relaxed">
                Evaluates neonatal risk indicators based on input clinical parameters
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">PRM</span>
              </div>
              <h4 className="font-bold text-gray-800 text-xl mb-4">Pattern Recognition Module</h4>
              <p className="text-gray-700 leading-relaxed">
                Identifies non-linear relationships among neonatal clinical variables
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">CRS</span>
              </div>
              <h4 className="font-bold text-gray-800 text-xl mb-4">Composite Risk Scoring System</h4>
              <p className="text-gray-700 leading-relaxed">
                Aggregates multiple analytical outputs to support clinician judgment
              </p>
            </div>

          </div>
          
          <div className="mt-10 p-6 bg-yellow-50 border-l-4 border-yellow-600 rounded-lg">
            <p className="text-gray-800 text-center font-semibold">
              ⚠️ This system provides decision support only. All clinical decisions remain the responsibility of the attending clinician.
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Clinical Portal</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Professional neonatal assessment system for healthcare providers.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/assessment" className="hover:text-white transition-colors">Clinical Assessment</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Patient Records</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technical Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Clinical Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Clinical Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Materials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Contact Information</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  clinical.support@system.com
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  Professional Support Line
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🏥</span>
                  24/7 Technical Support
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Clinical Neonatal Assessment System. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Clinical Compliance</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Test Page Link */}
      <Link 
        to="/test" 
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 z-50"
        title="Test Page (Dev Only)"
      >
        <TestTube className="w-6 h-6" />
      </Link>
    </div>
  );
}

export default HomePage;