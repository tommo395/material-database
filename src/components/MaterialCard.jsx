import React, { useState } from 'react';

const MaterialCard = ({ material, onClick, isSelected }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (e) => {
    // If it's selectable, don't expand on click
    if (onClick) {
      onClick(material);
      return;
    }
    setExpanded(!expanded);
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden 
        ${expanded ? 'shadow-lg' : 'hover:shadow-lg'} 
        ${isSelected ? 'ring-2 ring-accent' : ''}
        animate-fade-in
      `}
      onClick={toggleExpand}
    >
      <div className="flex justify-between items-center p-4 border-l-4 border-accent">
        <h3 className="text-lg font-medium text-primary">{material.name}</h3>
        <span className="font-bold bg-secondary text-white py-1 px-2 rounded text-sm">
          {material.shortName}
        </span>
      </div>
      
      {expanded && (
        <div className="p-4 animate-slide-in border-t border-light">
          <div className="mb-4">
            <p className="mb-1">
              <span className="font-semibold text-secondary">Type:</span> {material.type}
            </p>
            <p className="mb-1">
              <span className="font-semibold text-secondary">Designation:</span> {material.designation}
            </p>
          </div>
          
          <div className="mb-2">
            <h4 className="text-md font-semibold text-primary border-b border-light pb-1 mb-3">Properties</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {Object.entries(material.properties).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1 border-b border-light last:border-0">
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