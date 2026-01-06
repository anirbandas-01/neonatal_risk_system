// frontend/src/hooks/useSearch.jsx
import { useState, useEffect, useCallback } from 'react';
import { babyAPI } from '../services/api';
import { useSearchContext } from '../context/SearchContext';

export const useSearch = () => {
  const { 
    searchQuery, 
    setSearchResults, 
    setIsSearching,
    addToRecentSearches 
  } = useSearchContext();
  
  const [error, setError] = useState(null);

  // Debounced search function
  useEffect(() => {
    // Don't search if query is too short
    if (searchQuery.length < 1) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Set loading state
    setIsSearching(true);
    setError(null);

    // Debounce timer (wait 400ms after user stops typing)
    const timeoutId = setTimeout(async () => {
      try {
        // Call the API (we'll create this endpoint next)
        const response = await babyAPI.search(searchQuery);
        
        if (response.success) {
          setSearchResults(response.results || []);
        } else {
          setError('Search failed');
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message || 'Search failed');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // Wait 400ms after user stops typing

    // Cleanup function - cancel search if user keeps typing
    return () => clearTimeout(timeoutId);
  }, [searchQuery, setSearchResults, setIsSearching]);

  // Function to handle when user selects a result
  const selectResult = useCallback((baby) => {
    addToRecentSearches(baby);
  }, [addToRecentSearches]);

  return {
    error,
    selectResult
  };
};