import { Link } from 'react-router-dom';
import { Activity, FileText, LayoutDashboard, TestTube, Heart, Shield, Clock, Users, TrendingUp, Award } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern Header with medical theme */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Newborn Health Monitor
                </h1>
                <p className="text-gray-600 text-sm font-medium mt-1">
                  AI-Powered Risk Assessment for Neonatal Care
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border-2 border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-semibold text-sm">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome, Doctor! 👨‍⚕️
            </h2>
            <p className="text-white text-lg opacity-90 max-w-3xl">
              Access comprehensive neonatal risk assessment tools powered by advanced AI technology. 
              Monitor, assess, and provide the best care for newborns with data-driven insights.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              
              <div className="flex items-center  space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                 <Shield className="w-5 h-5 text-white" />
                 <span className="text-blue-600 font-semibold ">HIPAA Compliant</span>
              </div>
            
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Award className="w-5 h-5 text-white" />
                <span className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Medical Grade AI</span>
              </div>
            
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Clock className="w-5 h-5 text-white" />
                <span className="font-semibold bg-gradient-to-r  from-purple-700 via-blue-600 to-pink-600 bg-clip-text text-transparent">24/7 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards - Consistent sizing */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* New Assessment Card */}
            <Link 
                to="/assessment"
                state={{ from: '/HomePage' }}
                className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 h-full flex flex-col">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Activity className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    New Assessment
                  </h3>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-600 mb-4 flex-grow">
                    Create a new health risk assessment for a newborn patient with comprehensive vital parameters
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Start Assessment</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Dashboard Card */}
            <Link to="/dashboard" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-green-500 h-full flex flex-col">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Dashboard
                  </h3>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-600 mb-4 flex-grow">
                    View all patient assessments, track trends, and manage records in one centralized location
                  </p>
                  <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Open Dashboard</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Reports Card */}
            <div className="group cursor-not-allowed">
              <div className="bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border-2 border-gray-200 h-full flex flex-col opacity-75">
                <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-purple-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Reports
                  </h3>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-600 mb-4 flex-grow">
                    Generate comprehensive reports and export assessment data for analysis and documentation
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-semibold">Coming Soon</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      In Development
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Statistics/Features Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></span>
            System Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h4 className="text-3xl font-bold text-gray-800 mb-2">95%+</h4>
              <p className="text-gray-600 font-medium">Accuracy Rate</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h4 className="text-3xl font-bold text-gray-800 mb-2">1000+</h4>
              <p className="text-gray-600 font-medium">Babies Monitored</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h4 className="text-3xl font-bold text-gray-800 mb-2">100%</h4>
              <p className="text-gray-600 font-medium">Data Security</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h4 className="text-3xl font-bold text-gray-800 mb-2">&lt;2s</h4>
              <p className="text-gray-600 font-medium">Assessment Time</p>
            </div>

          </div>
        </div>

        {/* AI Models Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-500">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Powered by Advanced AI Technology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">ML</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">Machine Learning Model</h4>
              <p className="text-sm text-gray-600">
                Advanced algorithms for accurate risk prediction based on clinical parameters
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">LSTM</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">Deep Learning Model</h4>
              <p className="text-sm text-gray-600">
                Neural networks for complex pattern recognition in health data
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ENS</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">Ensemble System</h4>
              <p className="text-sm text-gray-600">
                Combined models for maximum accuracy and reliability in assessments
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Health Monitor</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Providing cutting-edge AI solutions for neonatal healthcare professionals worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/assessment" className="hover:text-white transition-colors">New Assessment</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Videos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  support@healthmonitor.com
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🏥</span>
                  24/7 Medical Support
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Newborn Health Monitor. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Test Page Link (Hidden for production) */}
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