// frontend/src/pages/DashboardPage.jsx - COMPLETE REDESIGN
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Users,
  Clock,
  Eye,
  ChevronRight
} from 'lucide-react';
import { babyAPI, assessmentAPI } from '../services/api';
import { useDashboardAnalytics } from '../hooks/useDashboardAnalytics';
import UrgentAttentionCard from '../components/UrgentAttentionCard';
import FollowUpCard from '../components/FollowUpCard';
import RecentAssessmentCard from '../components/RecentAssessmentCard';

function DashboardPage() {
  const navigate = useNavigate();

  const [babies, setBabies] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [viewMode, setViewMode] = useState('priority'); // 'priority' or 'all'

  // Use analytics hook
  const analytics = useDashboardAnalytics(babies);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading clinical dashboard...</p>
        </div>
      </div>
    );
  }

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
            Back to Overview
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                  <Activity className="w-8 h-8 mr-3 text-blue-600" />
                  Clinical Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Priority-based patient management
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh
                </button>
                <button
                  onClick={() => navigate('/assessment')}
                  className="flex items-center px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Assessment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">Today</p>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.stats.todayCount}</p>
            <p className="text-xs text-gray-500 mt-1">Assessments</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">This Week</p>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.stats.thisWeekCount}</p>
            <p className="text-xs text-gray-500 mt-1">Total visits</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">Critical</p>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{analytics.stats.criticalCount}</p>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-semibold">Total Patients</p>
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{babies.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active records</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('priority')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                viewMode === 'priority'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Priority View
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Patients
            </button>
          </div>
        </div>

        {/* Priority View */}
        {viewMode === 'priority' && (
          <div className="space-y-6">
            
            {/* Urgent Attention Section */}
            {analytics.urgentAttention.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3 text-red-600" />
                    🚨 Urgent Attention Required ({analytics.urgentAttention.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.urgentAttention.slice(0, 6).map(baby => (
                    <UrgentAttentionCard key={baby._id} baby={baby} />
                  ))}
                </div>
                {analytics.urgentAttention.length > 6 && (
                  <button
                    onClick={() => setViewMode('all')}
                    className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center"
                  >
                    View all {analytics.urgentAttention.length} urgent patients
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            )}

            {/* Follow-up Today Section */}
            {analytics.followUpToday.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-yellow-600" />
                    📅 Follow-ups Due ({analytics.followUpToday.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {analytics.followUpToday.slice(0, 8).map(baby => (
                    <FollowUpCard key={baby._id} baby={baby} />
                  ))}
                </div>
                {analytics.followUpToday.length > 8 && (
                  <button
                    onClick={() => setViewMode('all')}
                    className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center"
                  >
                    View all {analytics.followUpToday.length} follow-ups
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            )}

            {/* Recent Assessments Section */}
            {analytics.recentAssessments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-blue-600" />
                    🕐 Recent Assessments (Last 24h)
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {analytics.recentAssessments.slice(0, 8).map(baby => (
                    <RecentAssessmentCard key={baby._id} baby={baby} />
                  ))}
                </div>
              </div>
            )}

            {/* Trend Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics.deteriorating.length > 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-900">Deteriorating</h3>
                  </div>
                  <p className="text-3xl font-bold text-red-700 mb-1">
                    {analytics.deteriorating.length}
                  </p>
                  <p className="text-sm text-red-700">
                    Risk increased since last visit
                  </p>
                </div>
              )}

              {analytics.improving.length > 0 && (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-900">Improving</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-700 mb-1">
                    {analytics.improving.length}
                  </p>
                  <p className="text-sm text-green-700">
                    Risk decreased since last visit
                  </p>
                </div>
              )}

              {analytics.stable.length > 0 && (
                <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <h3 className="font-bold text-gray-900">Stable</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-700 mb-1">
                    {analytics.stable.length}
                  </p>
                  <p className="text-sm text-gray-700">
                    No change in risk level
                  </p>
                </div>
              )}
            </div>

            {/* Empty State */}
            {analytics.urgentAttention.length === 0 && 
             analytics.followUpToday.length === 0 && 
             analytics.recentAssessments.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">All Caught Up!</h3>
                <p className="text-gray-600 mb-6">No urgent items or follow-ups at this time.</p>
                <button
                  onClick={() => setViewMode('all')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  View All Patients
                </button>
              </div>
            )}

          </div>
        )}

        {/* All Patients View */}
        {viewMode === 'all' && (
          <div>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-500 w-5 h-5" />
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Risk Levels</option>
                    <option value="Low Risk">Low Risk</option>
                    <option value="Medium Risk">Medium Risk</option>
                    <option value="High Risk">High Risk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* All Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {babies.map(baby => (
                <div
                  key={baby._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-500 cursor-pointer"
                  onClick={() => navigate(`/baby/${baby.babyId}/history`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {baby.babyInfo?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-600 font-mono">{baby.babyId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      baby.currentRiskLevel === 'High Risk' 
                        ? 'bg-red-100 text-red-800' 
                        : baby.currentRiskLevel === 'Medium Risk'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {baby.currentRiskLevel}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Visits</p>
                      <p className="font-bold text-gray-900">{baby.totalVisits}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Visit</p>
                      <p className="font-bold text-gray-900">
                        {new Date(baby.lastVisitDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/assessment', { state: { baby } });
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    New Assessment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DashboardPage;