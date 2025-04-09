import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MaterialTypeList = ({ materials }) => {
  // Get unique material types
  const uniqueTypes = [...new Set(materials.map(material => material.type))];
  
  // Count materials of each type
  const typeCounts = uniqueTypes.reduce((counts, type) => {
    counts[type] = materials.filter(m => m.type === type).length;
    return counts;
  }, {});
  
  // Sort types by frequency (descending)
  const types = uniqueTypes.sort((a, b) => typeCounts[b] - typeCounts[a]);
  
  const [displayLimit, setDisplayLimit] = useState(8);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showMoreTypes = () => {
    setDisplayLimit(prev => prev + 8);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold text-primary mb-4">Material Types</h2>
      <div className="flex flex-col space-y-2">
        {types.slice(0, displayLimit).map(type => (
          <Link 
            key={type} 
            to={`/type/${encodeURIComponent(type)}`} 
            className="bg-neutral text-secondary py-2 px-4 rounded hover:bg-accent hover:text-white transition-all duration-200 text-center shadow-sm"
          >
            {type}
          </Link>
        ))}
        
        {isMobile && types.length > displayLimit && (
          <button 
            onClick={showMoreTypes}
            className="w-full py-2 px-4 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors shadow-sm mt-2"
          >
            Show More ({types.length - displayLimit} more types)
          </button>
        )}
      </div>
    </div>
  );
};

export default MaterialTypeList;