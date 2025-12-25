import { useState } from 'react';
import { Search, Loader, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { babyAPI } from '../services/api';

function BabySearch({ onBabyFound, onNewBaby }) {
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Please enter a Baby ID');
      return;
    }

    setSearching(true);
    setError('');
    setSearchResult(null);

    try {
      const response = await babyAPI.checkExists(searchId.trim());
      
      if (response.exists) {
        setSearchResult(response.data);
        onBabyFound(response.data);
      } else {
        setError('Baby ID not found. You can create a new baby with this ID.');
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Search Existing Baby
      </h3>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Baby ID (e.g., BABY-001)"
            className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center"
        >
          {searching ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Search
            </>
          )}
        </button>
      </div>

      {/* Search Result - Baby Found */}
      {searchResult && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 mb-2">Baby Found!</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-gray-700">
                    <strong>Name:</strong> {searchResult.babyInfo.name}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-gray-700">
                    <strong>DOB:</strong> {new Date(searchResult.babyInfo.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className="text-gray-700">
                    <strong>Total Visits:</strong> {searchResult.totalVisits} | 
                    <strong className="ml-2">Current Risk:</strong> 
                    <span className={`ml-1 ${
                      searchResult.currentRiskLevel === 'Low Risk' ? 'text-green-600' :
                      searchResult.currentRiskLevel === 'Medium Risk' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {searchResult.currentRiskLevel}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-yellow-800">{error}</p>
              {error.includes('not found') && (
                <button
                  onClick={() => onNewBaby(searchId)}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  Create new baby with ID: {searchId}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t-2 border-gray-200 text-center">
        <p className="text-gray-600 mb-2">Or</p>
        <button
          onClick={() => onNewBaby('')}
          className="text-blue-600 hover:text-blue-700 font-semibold underline"
        >
          Create a completely new baby record
        </button>
      </div>
    </div>
  );
}

export default BabySearch;