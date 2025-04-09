import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MaterialCard from '../components/MaterialCard';

const MaterialTypePage = ({ materials }) => {
  const { typeId } = useParams();
  const decodedType = decodeURIComponent(typeId);
  const [displayLimit, setDisplayLimit] = useState(24);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const materialsOfType = materials.filter(material => 
    material.type === decodedType
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDisplayLimit(mobile ? 24 : 32);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial values
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showMoreItems = () => {
    setDisplayLimit(prev => prev + (isMobile ? 24 : 32));
  };
  
  const showLessItems = () => {
    setDisplayLimit(isMobile ? 24 : 32);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center text-secondary hover:text-accent transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to All Materials
          </Link>
          <h1 className="text-2xl font-bold text-primary">
            {decodedType} Materials 
            <span className="ml-2 text-lg text-secondary">({materialsOfType.length})</span>
          </h1>
        </div>
        
        <Link 
          to="/compare" 
          className="mt-4 sm:mt-0 bg-accent text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors inline-flex items-center self-start"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Compare Materials
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {materialsOfType.length > 0 ? (
          <>
            {materialsOfType.slice(0, displayLimit).map(material => (
              <MaterialCard key={material.id} material={material} />
            ))}
            
            {materialsOfType.length > displayLimit && (
              <button 
                onClick={showMoreItems}
                className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm mt-2"
              >
                Show More ({materialsOfType.length - displayLimit} remaining)
              </button>
            )}
            
            {displayLimit > (isMobile ? 24 : 32) && materialsOfType.length > (isMobile ? 24 : 32) && (
              <button 
                onClick={showLessItems}
                className="w-full py-3 bg-light-gray text-secondary rounded-lg hover:bg-opacity-90 transition-colors shadow-sm mt-2"
              >
                Show Less
              </button>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-secondary text-lg">No materials found for this type.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialTypePage;