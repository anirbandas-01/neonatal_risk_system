import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, RefreshCw, AlertCircle, Plus, User, Calendar, TrendingUp, Eye } from 'lucide-react';
import { babyAPI, assessmentAPI } from '../services/api';
import { getRiskColor, formatDate } from '../utils/helpers';

function DashboardPage() {
  const navigate = useNavigate();

  const [babies, setBabies] = useState([]);
  const [filteredBabies, setFilteredBabies] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBabies();
  }, [searchTerm, riskFilter, babies]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [babiesResponse, statsResponse] = await Promise.all([
        babyAPI.getAllBabies(),
        assessmentAPI.getStatistics()
      ]);
      
      setBabies(babiesResponse.data || []);
      setStatistics(statsResponse.data || null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filterBabies = () => {
    let filtered = [...babies];

    if (searchTerm) {
      filtered = filtered.filter(baby =>
        baby.babyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        baby.babyInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== 'All') {
      filtered = filtered.filter(baby => baby.currentRiskLevel === riskFilter);
    }

    setFilteredBabies(filtered);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleViewHistory = (baby) => {
    navigate(`/baby/${baby.babyId}/history`);
  };

  const handleAddAssessment = (baby) => {
    navigate('/assessment', { state: { baby } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/HomePage')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  View and manage all baby records
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
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-2">Total Babies</p>
              <p className="text-3xl font-bold text-gray-800">{statistics.totalBabies}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-2">Total Assessments</p>
              <p className="text-3xl font-bold text-gray-800">{statistics.totalAssessments}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-2">Low Risk</p>
              <p className="text-3xl font-bold text-green-600">{statistics.lowRisk}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-2">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-600">{statistics.mediumRisk}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-2">High Risk</p>
              <p className="text-3xl font-bold text-red-600">{statistics.highRisk}</p>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Baby ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>

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

            <button
              onClick={handleRefresh}
              className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>

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
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="ml-4 text-gray-600 text-lg">Loading babies...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredBabies.length}</span> of <span className="font-semibold">{babies.length}</span> babies
              </p>
            </div>

            {/* Babies List */}
            {filteredBabies.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  {searchTerm || riskFilter !== 'All' 
                    ? 'No babies match your filters' 
                    : 'No baby records found'}
                </p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Create First Baby Record
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBabies.map((baby) => (
                  <div
                    key={baby._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    {/* Risk Status Bar */}
                    <div className={`h-2 ${
                      baby.currentRiskLevel === 'Low Risk' ? 'bg-green-500' :
                      baby.currentRiskLevel === 'Medium Risk' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>

                    <div className="p-6">
                      {/* Baby Info */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {baby.babyInfo.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4 mr-2" />
                          <span className="font-mono">{baby.babyId}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>DOB: {new Date(baby.babyInfo.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Risk Status */}
                      <div className={`mb-4 px-4 py-2 rounded-lg ${getRiskColor(baby.currentRiskLevel)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{baby.currentRiskLevel}</span>
                          <span className="text-sm">Latest Status</span>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Total Visits</p>
                          <p className="text-lg font-bold text-gray-800">{baby.totalVisits}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Last Visit</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(baby.lastVisitDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Latest Assessment Info */}
                      {baby.assessments && baby.assessments.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-2">Latest Assessment</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Weight:</span>{' '}
                              <span className="font-semibold">
                                 {baby.assessments[0].healthParameters.weightKg} kg 
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">O₂:</span>{' '}
                              <span className="font-semibold">
                                {baby.assessments[0].healthParameters.oxygenSaturation}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewHistory(baby)}
                          className="flex-1 flex items-center justify-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View History
                        </button>
                        <button
                          onClick={() => handleAddAssessment(baby)}
                          className="flex items-center justify-center py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default DashboardPage;