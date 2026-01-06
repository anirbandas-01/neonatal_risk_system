// frontend/src/context/SearchContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SearchContext = createContext();

// Custom hook to use search context
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return context;
};

// Provider component
export const SearchProvider = ({ children }) => {
  // State for search modal visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for recent searches (last 10 patients)
  const [recentSearches, setRecentSearches] = useState([]);
  
  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  
  // Loading state
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
  }, []);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Open search modal
  const openSearch = () => {
    setIsSearchOpen(true);
    // Auto-focus will be handled in the modal component
  };

  // Close search modal
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Toggle search modal
  const toggleSearch = () => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  };

  // Add a patient to recent searches
  const addToRecentSearches = (baby) => {
    setRecentSearches(prev => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter(item => item.babyId !== baby.babyId);
      
      // Add to beginning
      const updated = [baby, ...filtered];
      
      // Keep only last 10
      return updated.slice(0, 10);
    });
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Remove a specific recent search
  const removeRecentSearch = (babyId) => {
    setRecentSearches(prev => prev.filter(item => item.babyId !== babyId));
  };

  // Value object that will be provided to consumers
  const value = {
    // State
    isSearchOpen,
    searchQuery,
    recentSearches,
    searchResults,
    isSearching,
    
    // Actions
    openSearch,
    closeSearch,
    toggleSearch,
    setSearchQuery,
    setSearchResults,
    setIsSearching,
    addToRecentSearches,
    clearRecentSearches,
    removeRecentSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;