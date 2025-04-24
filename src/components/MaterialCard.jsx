// MaterialCard.jsx (modified with full-height accent bar)
import React, { useState, useRef } from 'react';

const MaterialCard = ({ material, onClick, isSelected }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardContentRef = useRef(null);

  const toggleExpand = (e) => {
    // If it's selectable, don't expand on click
    if (onClick) {
      onClick(material);
      return;
    }
    setExpanded(!expanded);
  };

  // Prevent clicks inside the content from closing the card
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const copyPropertiesToClipboard = (e) => {
    e.stopPropagation();
    
    // Create a formatted string of all properties
    let content = `${material.name} (${material.shortName})\n`;
    content += `Type: ${material.type}\n`;
    content += `Designation: ${material.designation}\n\n`;
    content += `Properties:\n`;
    
    Object.entries(material.properties).forEach(([key, value]) => {
      content += `${formatPropertyLabel(key)}: ${value}\n`;
    });
    
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden 
        ${expanded ? 'shadow-lg' : 'hover:shadow-lg'} 
        ${isSelected ? 'ring-2 ring-accent' : ''}
        animate-fade-in relative
      `}
    >
      {/* Vertical accent line that spans full height when expanded */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-accent`}></div>
      
      <div 
        className="flex justify-between items-center p-4 pl-5 cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="text-lg font-medium text-primary">{material.name}</h3>
        <span className="font-bold bg-secondary text-white py-1 px-2 rounded text-sm">
          {material.shortName}
        </span>
      </div>
      
      {expanded && (
        <div 
          className="p-4 pl-5 animate-slide-in border-t border-light" 
          onClick={handleContentClick}
          ref={cardContentRef}
        >
          <div className="mb-4">
            <p className="mb-1">
              <span className="font-semibold text-secondary">Type:</span> {material.type}
            </p>
            <p className="mb-1">
              <span className="font-semibold text-secondary">Designation:</span> {material.designation}
            </p>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between items-center border-b border-light pb-1 mb-3">
              <h4 className="text-md font-semibold text-primary">Properties</h4>
              <button 
                onClick={copyPropertiesToClipboard}
                className="text-secondary hover:text-accent transition-colors text-sm flex items-center"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l-3-3" />
                    </svg>
                    Copy All
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-0">
              {Object.entries(material.properties).map(([key, value], index) => (
                <div 
                  key={key} 
                  className={`flex justify-between py-2 px-2 border-b border-light last:border-0 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <span className="font-medium text-secondary mr-2">{formatPropertyLabel(key)}:</span>
                  <span className="text-primary font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format property labels
const formatPropertyLabel = (key) => {
  // First handle special cases to prevent double replacements
  if (key === 'youngsModulus') return "Young's Modulus";
  if (key === 'flexuralMod') return "Flexural Modulus";
  if (key === 'costPerKg') return "Cost Per kg";
  
  // Then apply the general formatting rules for other properties
  const formatted = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
  
  // Replace common abbreviations
  return formatted
    .replace('Uts', 'UTS')
    .replace('Coef', 'Coefficient')
    .replace(' Mod', ' Modulus') // Add space before Mod to avoid partial word matches
    .replace('Temp', 'Temperature')
    .replace('Cap', 'Capacity');
};

export default MaterialCard;