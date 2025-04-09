import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import MaterialTypeList from '../components/MaterialTypeList';
import MaterialCard from '../components/MaterialCard';

const Home = ({ materials }) => {
  const [searchResults, setSearchResults] = useState(materials);
  const [displayLimit, setDisplayLimit] = useState(8);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (results) => {
    setSearchResults(results);
    setDisplayLimit(8); // Reset display limit when searching
  };

  const showMoreItems = () => {
    setDisplayLimit(prev => prev + 8);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/4">
        <MaterialTypeList materials={materials} />
      </div>
      
      <div className="w-full lg:w-3/4">
        <div className="mb-6">
          <SearchBar materials={materials} onSearch={handleSearch} />
        </div>
        
        <h2 className="text-xl font-bold text-primary mb-4">
          All Materials {searchResults.length > 0 ? `(${searchResults.length})` : ''}
        </h2>
        
        <div className="grid gap-4 grid-cols-1">
          {searchResults.length > 0 ? (
            <>
              {searchResults.slice(0, displayLimit).map(material => (
                <MaterialCard key={material.id} material={material} />
              ))}
              
              {isMobile && searchResults.length > displayLimit && (
                <button 
                  onClick={showMoreItems}
                  className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm mt-2"
                >
                  Show More ({searchResults.length - displayLimit} remaining)
                </button>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-secondary text-lg">No materials found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;