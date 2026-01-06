// frontend/src/components/GlobalSearch.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Eye, 
  FileText, 
  Loader,
  AlertCircle,
  User,
  Phone,
  Calendar
} from 'lucide-react';
import { useSearchContext } from '../context/SearchContext';
import { useSearch } from '../hooks/useSearch';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  
  const {
    isSearchOpen,
    closeSearch,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    recentSearches,
    removeRecentSearch,
    clearRecentSearches
  } = useSearchContext();
  
  const { error, selectResult } = useSearch();

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen, closeSearch]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, closeSearch]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  // Handle result selection
  const handleSelectResult = (baby) => {
    selectResult(baby);
    closeSearch();
    navigate(`/baby/${baby.babyId}/history`);
  };

  // Handle new assessment
  const handleNewAssessment = (baby) => {
    selectResult(baby);
    closeSearch();
    navigate('/assessment', { state: { baby } });
  };

  // Get risk badge color
  const getRiskBadge = (risk) => {
    const badges = {
      'Low Risk': 'bg-green-100 text-green-800 border-green-300',
      'Medium Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'High Risk': 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[risk] || badges['Medium Risk'];
  };

  if (!isSearchOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20">
        <div
          ref={modalRef}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all"
        >
          
          {/* Search Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by baby name, ID, parent name, or phone..."
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base sm:text-lg"
                />
                {isSearching && (
                  <Loader className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
                )}
              </div>
              <button
                onClick={closeSearch}
                className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>

            {/* Search hints */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">Esc</kbd>
                to close
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">↑↓</kbd>
                to navigate
              </span>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Search Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery.length >= 1 && !isSearching && searchResults.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                </h3>
                <div className="space-y-3">
                  {searchResults.map((baby) => (
                    <SearchResultCard
                      key={baby._id}
                      baby={baby}
                      onSelect={() => handleSelectResult(baby)}
                      onNewAssessment={() => handleNewAssessment(baby)}
                      getRiskBadge={getRiskBadge}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery.length >= 1 && !isSearching && searchResults.length === 0 && !error && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold mb-2">No patients found</p>
                <p className="text-sm text-gray-400">
                  Try searching by baby name, ID, or parent contact
                </p>
              </div>
            )}

            {/* Recent Searches */}
            {searchQuery.length < 1 && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Patients
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentSearches.map((baby) => (
                    <RecentSearchCard
                      key={baby.babyId}
                      baby={baby}
                      onSelect={() => handleSelectResult(baby)}
                      onNewAssessment={() => handleNewAssessment(baby)}
                      onRemove={() => removeRecentSearch(baby.babyId)}
                      getRiskBadge={getRiskBadge}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {searchQuery.length < 1 && recentSearches.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold mb-4">Search for patients</p>
                <div className="text-sm text-gray-400 space-y-2">
                  <p>💡 <strong>Tips:</strong></p>
                  <p>• Type baby name or ID</p>
                  <p>• Search by parent name</p>
                  <p>• Enter phone number</p>
                  <p>• Minimum 1 characters</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

// Search Result Card Component
const SearchResultCard = ({ baby, onSelect, onNewAssessment, getRiskBadge }) => {
  const ageDays = baby.ageDays || 0;
  const lastVisit = baby.lastVisitDate 
    ? new Date(baby.lastVisitDate).toLocaleDateString()
    : 'N/A';

  return (
    <div className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <h4 className="font-bold text-gray-900 text-base sm:text-lg">
              {baby.babyInfo?.name || 'Unknown'}
            </h4>
          </div>
          <p className="text-sm text-gray-600 font-mono">
            {baby.babyId} • {ageDays} days old
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadge(baby.currentRiskLevel)}`}>
          {baby.currentRiskLevel || 'Unknown'}
        </span>
      </div>

      <div className="space-y-1 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>Parent: {baby.parentInfo?.motherName || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{baby.parentInfo?.contactNumber || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Last visit: {lastVisit}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSelect}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          View History
        </button>
        <button
          onClick={onNewAssessment}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>
    </div>
  );
};

// Recent Search Card Component
const RecentSearchCard = ({ baby, onSelect, onNewAssessment, onRemove, getRiskBadge }) => {
  const ageDays = baby.ageDays || 0;

  return (
    <div className="bg-gray-50 border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">
              {baby.babyInfo?.name || 'Unknown'}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getRiskBadge(baby.currentRiskLevel)}`}>
              {baby.currentRiskLevel}
            </span>
          </div>
          <p className="text-xs text-gray-600 font-mono mt-1">
            {baby.babyId} • {ageDays} days
          </p>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Remove from recent"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={onSelect}
          className="flex-1 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
        >
          View
        </button>
        <button
          onClick={onNewAssessment}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          Assess
        </button>
      </div>
    </div>
  );
};

export default GlobalSearch;