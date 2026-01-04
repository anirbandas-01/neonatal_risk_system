import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, RefreshCw, AlertCircle, Plus, User, Calendar, Eye, Trash2 } from 'lucide-react';
import { babyAPI, assessmentAPI } from '../services/api';

// Helper functions from first code
const getRiskColor = (risk) => {
  const colors = {
    'Low Risk': 'bg-green-100 text-green-800 border-green-300',
    'Medium Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Moderate Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'High Risk': 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[risk] || colors['Medium Risk'];
};

const normalizeRiskLevel = (risk) => {
  if (risk === 'Medium Risk') return 'Moderate Risk';
  return risk;
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const diffTime = Math.abs(today - birthDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

function DashboardPage() {
  const navigate = useNavigate();

  const [babies, setBabies] = useState([]);
  const [filteredBabies, setFilteredBabies] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteBaby = async (baby) => {
    if (deleteConfirm !== baby._id) {
      setDeleteConfirm(baby._id);
      return;
    }

    setDeleting(true);
    try {
      await babyAPI.deleteBaby(baby.babyId);
      
      // Update local state
      setBabies(babies.filter(b => b._id !== baby._id));
      setDeleteConfirm(null);
      
      // Show success message
      alert(`Neonate ${baby.babyInfo.name} deleted successfully`);
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete neonate record. Please try again.');
    } finally {
      setDeleting(false);
    }
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

  // Helper function to get latest assessment
  const getLatestAssessment = (baby) => {
    if (!baby.assessments || baby.assessments.length === 0) return null;
    
    // Sort by date to get the latest assessment
    const sortedAssessments = [...baby.assessments].sort((a, b) => 
      new Date(b.assessmentDate || b.createdAt) - new Date(a.assessmentDate || a.createdAt)
    );
    
    return sortedAssessments[0];
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
            Back to Overview
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Patient Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  View and manage neonatal clinical records
                </p>
              </div>
              
              <button
                onClick={() => navigate('/assessment')}
                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Clinical Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-2">Total Neonates</p>
              <p className="text-3xl font-bold text-gray-800">{statistics.totalBabies}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-2">Total Clinical Assessments</p>
              <p className="text-3xl font-bold text-gray-800">{statistics.totalAssessments}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-2">Low Risk Category</p>
              <p className="text-3xl font-bold text-green-600">{statistics.lowRisk}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-2">Moderate Risk Category</p>
              <p className="text-3xl font-bold text-yellow-600">{statistics.mediumRisk}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-2">High Risk Category</p>
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
                placeholder="Search by Neonate ID or Name..."
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
                <option value="All">All Risk Categories</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Moderate Risk</option>
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
                  Risk: {riskFilter === 'Medium Risk' ? 'Moderate Risk' : riskFilter}
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
            <p className="ml-4 text-gray-600 text-lg">Loading neonatal records...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredBabies.length}</span> of <span className="font-semibold">{babies.length}</span> neonates
              </p>
            </div>

            {/* Babies List */}
            {filteredBabies.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  {searchTerm || riskFilter !== 'All' 
                    ? 'No neonates match your filters' 
                    : 'No neonatal records found'}
                </p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Create First Neonate Record
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBabies.map((baby) => {
                  const normalizedRisk = normalizeRiskLevel(baby.currentRiskLevel);
                  const ageDays = calculateAge(baby.babyInfo.dateOfBirth);
                  const latestAssessment = getLatestAssessment(baby);
                  
                  return (
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
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {baby.babyInfo.name || `Neonate ${baby.babyId.split('-')[1]}`}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mb-1">
                                <User className="w-4 h-4 mr-2" />
                                <span className="font-mono">Neonate ID: {baby.babyId}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>DOB: {new Date(baby.babyInfo.dateOfBirth).toLocaleDateString()} (Age: {ageDays} days)</span>
                              </div>
                            </div>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteBaby(baby)}
                              disabled={deleting && deleteConfirm === baby._id}
                              className={`p-2 rounded-lg transition-colors ${
                                deleteConfirm === baby._id
                                  ? 'bg-red-500 text-white hover:bg-red-600'
                                  : 'bg-gray-100 text-red-500 hover:bg-red-100'
                              }`}
                              title={deleteConfirm === baby._id ? 'Click again to confirm' : 'Delete neonate'}
                            >
                              {deleting && deleteConfirm === baby._id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Risk Status */}
                        <div className={`mb-4 px-4 py-3 rounded-lg ${getRiskColor(baby.currentRiskLevel)}`}>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold">Risk Category: {normalizedRisk}</span>
                            </div>
                            <span className="text-xs opacity-80">Most Recent Assessment</span>
                            <span className="text-xs opacity-70 mt-1 italic">Clinical interpretation required</span>
                          </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Total Assessments</p>
                            <p className="text-lg font-bold text-gray-800">{baby.totalVisits || baby.assessments?.length || 0}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Last Assessment Date</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {baby.lastVisitDate ? new Date(baby.lastVisitDate).toLocaleDateString() : 'No assessments'}
                            </p>
                          </div>
                        </div>

                        {/* Latest Assessment Info - THIS IS THE SECTION YOU WANT */}
                        {latestAssessment && latestAssessment.healthParameters && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-2">Latest Clinical Parameters</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Weight:</span>{' '}
                                <span className="font-semibold">
                                  {latestAssessment.healthParameters.weightKg || latestAssessment.healthParameters.weight || 'N/A'} kg
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">O₂:</span>{' '}
                                <span className="font-semibold">
                                  {latestAssessment.healthParameters.oxygenSaturation || latestAssessment.healthParameters.spO2 || 'N/A'}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Additional parameters if available */}
                        {latestAssessment && latestAssessment.healthParameters && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-2">Latest Clinical Parameters</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Weight:</span>{' '}
                                <span className="font-semibold">
                                  {latestAssessment.healthParameters.weightKg || latestAssessment.healthParameters.weight || 'N/A'} kg
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">O₂:</span>{' '}
                                <span className="font-semibold">
                                  {latestAssessment.healthParameters.oxygenSaturation || latestAssessment.healthParameters.spO2 || 'N/A'}%
                                </span>
                              </div>
                              {/* Add more parameters if they exist in your data */}
                              {latestAssessment.healthParameters.temperature && (
                                <div>
                                  <span className="text-gray-500">Temp:</span>{' '}
                                  <span className="font-semibold">
                                    {latestAssessment.healthParameters.temperature}°C
                                  </span>
                                </div>
                              )}
                              {latestAssessment.healthParameters.heartRate && (
                                <div>
                                  <span className="text-gray-500">HR:</span>{' '}
                                  <span className="font-semibold">
                                    {latestAssessment.healthParameters.heartRate} bpm
                                  </span>
                                </div>
                              )}
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
                            View Clinical History
                          </button>
                          <button
                            onClick={() => handleAddAssessment(baby)}
                            className="flex items-center justify-center py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                            title="New Assessment"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            <span className="text-sm">New</span>
                          </button>
                        </div>
                        
                        {/* Delete Confirmation Message */}
                        {deleteConfirm === baby._id && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-center">
                            <p className="text-sm text-red-700 font-semibold">
                              Click delete again to confirm
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Clinical Disclaimer Footer */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <p className="text-gray-800 text-center leading-relaxed">
            <strong>Clinical Decision Support Notice:</strong> This system is intended to support clinical assessment. 
            Final diagnosis and treatment decisions remain the responsibility of the attending physician.
          </p>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;