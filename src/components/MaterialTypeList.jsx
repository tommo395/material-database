import React from 'react';
import { Link } from 'react-router-dom';

const MaterialTypeList = ({ materials }) => {
  // Get unique material types
  const types = [...new Set(materials.map(material => material.type))];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold text-primary mb-4">Material Types</h2>
      <div className="flex flex-col space-y-2">
        {types.map(type => (
          <Link 
            key={type} 
            to={`/type/${encodeURIComponent(type)}`} 
            className="bg-neutral text-secondary py-2 px-4 rounded hover:bg-accent hover:text-white transition-all duration-200 text-center shadow-sm"
          >
            {type}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MaterialTypeList;