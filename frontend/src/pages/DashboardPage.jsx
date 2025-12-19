import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import AssessmentCard from '../components/AssessmentCard';
import { assessmentAPI } from '../services/api';

function DashboardPage() {
  const navigate = useNavigate();

  // State
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  // Fetch assessments on component mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  // Filter assessments when search or filter changes
  useEffect(() => {
    filterAssessments();
  }, [searchTerm, riskFilter, assessments]);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await assessmentAPI.getAllAssessments();
      setAssessments(response.data || []);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError('Failed to load assessments. Using mock data for demo.');
      
      // Use mock data for testing (since backend not ready)
      setAssessments(getMockAssessments());
    } finally {
      setLoading(false);
    }
  };

  const filterAssessments = () => {
    let filtered = [...assessments];

    // Search filter (by baby ID)
    if (searchTerm) {
      filtered = filtered.filter(assessment =>
        assessment.babyId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk level filter
    if (riskFilter !== 'All') {
      filtered = filtered.filter(
        assessment => assessment.riskAssessment.finalRisk === riskFilter
      );
    }

    setFilteredAssessments(filtered);
  };

  const handleRefresh = () => {
    fetchAssessments();
  };

  // Get statistics
  const getStats = () => {
    const total = assessments.length;
    const lowRisk = assessments.filter(a => a.riskAssessment.finalRisk === 'Low Risk').length;
    const mediumRisk = assessments.filter(a => a.riskAssessment.finalRisk === 'Medium Risk').length;
    const highRisk = assessments.filter(a => a.riskAssessment.finalRisk === 'High Risk').length;

    return { total, lowRisk, mediumRisk, highRisk };
  };

  const stats = getStats();

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Assessment Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  View and manage all health assessments
                </p>
              </div>
              
              <button
                onClick={() => navigate('/assessment')}
                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
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
            <p className="text-sm text-gray-600 mb-2">Total Assessments</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-2">Low Risk</p>
            <p className="text-3xl font-bold text-green-600">{stats.lowRisk}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-2">Medium Risk</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.mediumRisk}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-2">High Risk</p>
            <p className="text-3xl font-bold text-red-600">{stats.highRisk}</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Baby ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter by Risk Level */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-500 w-5 h-5" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || riskFilter !== 'All') && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {riskFilter !== 'All' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Risk: {riskFilter}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRiskFilter('All');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <p className="font-semibold text-yellow-800">Notice</p>
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="ml-4 text-gray-600 text-lg">Loading assessments...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredAssessments.length}</span> of <span className="font-semibold">{assessments.length}</span> assessments
              </p>
            </div>

            {/* Assessments Grid */}
            {filteredAssessments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">No assessments found</p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Create First Assessment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.map((assessment, index) => (
                  <AssessmentCard key={index} assessment={assessment} />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

// Mock data for testing (until backend is ready)
function getMockAssessments() {
  return [
    {
      babyId: 'BABY-1734567890-123',
      assessmentDate: new Date('2024-12-18'),
      createdAt: new Date('2024-12-18'),
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
          'Monitor weight gain progress'
        ],
        mlModelScore: 25.5,
        lstmModelScore: 24.2,
        ensembleScore: 23.8
      }
    },
    {
      babyId: 'BABY-1734567890-456',
      assessmentDate: new Date('2024-12-18'),
      createdAt: new Date('2024-12-18'),
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
          'Consider additional diagnostic tests'
        ],
        mlModelScore: 45.8,
        lstmModelScore: 43.5,
        ensembleScore: 44.2
      }
    },
    {
      babyId: 'BABY-1734567890-789',
      assessmentDate: new Date('2024-12-17'),
      createdAt: new Date('2024-12-17'),
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
          'Prepare for possible intervention'
        ],
        mlModelScore: 78.3,
        lstmModelScore: 75.9,
        ensembleScore: 76.8
      }
    },
    {
      babyId: 'BABY-1734567890-012',
      assessmentDate: new Date('2024-12-17'),
      createdAt: new Date('2024-12-17'),
      healthParameters: {
        birthWeight: 3.5,
        birthLength: 52,
        headCircumference: 35,
        temperature: 36.7,
        heartRate: 135,
        respiratoryRate: 42,
        jaundiceLevel: 4.2,
        bloodGlucose: 5.1,
        oxygenSaturation: 99,
        apgarScore: 10,
        birthDefects: 'No',
        normalReflexes: 'Yes',
        immunizations: 'Yes'
      },
      riskAssessment: {
        finalRisk: 'Low Risk',
        confidence: 0.96,
        recommendations: [
          'Continue routine monitoring and care',
          'Maintain regular feeding schedule',
          'Monitor weight gain progress'
        ],
        mlModelScore: 18.5,
        lstmModelScore: 17.2,
        ensembleScore: 16.8
      }
    }
  ];
}

export default DashboardPage;