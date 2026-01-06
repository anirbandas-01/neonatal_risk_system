// frontend/src/pages/TestSearchPage.jsx
import { useSearchContext } from '../context/SearchContext';

function TestSearchPage() {
  const { 
    openSearch, 
    closeSearch, 
    recentSearches, 
    addRecentSearch,
    searchQuery,
    setSearchQuery
  } = useSearchContext();
  
  const handleTestSearch = () => {
    const testQuery = `Test Search ${Date.now()}`;
    setSearchQuery(testQuery);
    addRecentSearch(testQuery);
    openSearch();
    
    setTimeout(() => {
      closeSearch();
      console.log('Search context working! Recent searches:', recentSearches);
    }, 1000);
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Search Context Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold mb-2">Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={openSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open Search
            </button>
            <button 
              onClick={closeSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close Search
            </button>
            <button 
              onClick={handleTestSearch}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Full Flow
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Current State</h2>
          <p><strong>Search Query:</strong> {searchQuery || '(empty)'}</p>
          <p><strong>Recent Searches Count:</strong> {recentSearches.length}</p>
        </div>
        
        {recentSearches.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h2 className="font-semibold mb-2">Recent Searches</h2>
            <ul className="list-disc pl-5">
              {recentSearches.map((item, index) => (
                <li key={index} className="py-1">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestSearchPage;