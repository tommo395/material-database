import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

const SearchBar = ({ materials, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    // Initialize fuzzy search
    const fuseOptions = {
      keys: ['name', 'shortName', 'type', 'designation'],
      threshold: 0.4,
      includeScore: true
    };
    setFuse(new Fuse(materials, fuseOptions));
  }, [materials]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      onSearch(materials);
      return;
    }
    
    if (fuse) {
      const results = fuse.search(value).map(result => result.item);
      onSearch(results);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search materials (name, code, type...)"
        value={searchTerm}
        onChange={handleSearch}
        className="block w-full pl-10 pr-3 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white shadow-sm transition-all duration-300 hover:shadow"
      />
      {searchTerm && (
        <button 
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-accent"
          onClick={() => {
            setSearchTerm('');
            onSearch(materials);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;