import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MaterialCard from '../components/MaterialCard';

const ComparisonPage = ({ materials }) => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState(materials);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse URL parameters for pre-selected materials
    const params = new URLSearchParams(location.search);
    const selected = params.get('compare');
    
    if (selected) {
      const ids = selected.split(',');
      const materialsToCompare = materials.filter(m => ids.includes(m.id));
      setSelectedMaterials(materialsToCompare);
    }
  }, [location.search, materials]);

  useEffect(() => {
    // Update URL when selected materials change
    if (selectedMaterials.length > 0) {
      const ids = selectedMaterials.map(m => m.id).join(',');
      navigate(`/compare?compare=${ids}`, { replace: true });
    } else if (location.search) {
      navigate('/compare', { replace: true });
    }
  }, [selectedMaterials, navigate, location.search]);

  useEffect(() => {
    setFilteredMaterials(
      materials.filter(
        material =>
          !searchTerm ||
          material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, materials]);

  const handleMaterialSelect = (material) => {
    setSelectedMaterials(prev => {
      const isSelected = prev.some(m => m.id === material.id);
      
      if (isSelected) {
        return prev.filter(m => m.id !== material.id);
      } else {
        if (prev.length >= 3) {
          // Limit to 3 materials for comparison
          return [...prev.slice(1), material];
        }
        return [...prev, material];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedMaterials([]);
  };

  const renderComparisonTable = () => {
    if (selectedMaterials.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-6">
          <p className="text-secondary text-lg">Select up to 3 materials to compare their properties.</p>
        </div>
      );
    }
    
    // Get all property keys
    const allProperties = selectedMaterials.reduce((props, material) => {
      Object.keys(material.properties).forEach(key => {
        if (!props.includes(key)) {
          props.push(key);
        }
      });
      return props;
    }, []);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Comparison</h2>
          <button
            onClick={handleClearAll}
            className="px-3 py-1 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors shadow-sm text-sm"
          >
            Clear All
          </button>
        </div>
        
        <table className="min-w-full divide-y divide-neutral">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-light">
                Property
              </th>
              {selectedMaterials.map(material => (
                <th key={material.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-light">
                  {material.name} ({material.shortName})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-secondary">
                Type
              </td>
              {selectedMaterials.map(material => (
                <td key={material.id} className="px-4 py-3 text-sm text-primary">
                  {material.type}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-secondary">
                Designation
              </td>
              {selectedMaterials.map(material => (
                <td key={material.id} className="px-4 py-3 text-sm text-primary">
                  {material.designation}
                </td>
              ))}
            </tr>
            {allProperties.map(prop => (
              <tr key={prop}>
                <td className="px-4 py-3 text-sm font-medium text-secondary">
                  {formatPropertyName(prop)}
                </td>
                {selectedMaterials.map(material => (
                  <td 
                    key={material.id} 
                    className="px-4 py-3 text-sm text-primary"
                    style={{
                      backgroundColor: getPropertyColor(prop, material.properties[prop], selectedMaterials)
                    }}
                  >
                    {material.properties[prop] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper function to format property names
  const formatPropertyName = (prop) => {
    return prop
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/Mod$/, 'Modulus')
      .replace(/Coef$/, 'Coefficient')
      .replace(/Temp$/, 'Temperature')
      .replace(/Cap$/, 'Capacity');
  };

  // Helper function to highlight best values (simplified approach)
  const getPropertyColor = (property, value, materials) => {
    if (!value) return 'transparent';
    
    // Properties where higher is better
    const higherIsBetter = [
      'youngsModulus', 'uts', 'flexuralMod', 'impactCharpy', 
      'notchedImpactCharpy', 'meltingTemp', 'specificHeatCap', 
      'thermalConductivity', 'electricalResistance', 'resistivity'
    ];
    
    // Properties where lower is better
    const lowerIsBetter = [
      'density', 'waterAbsorption', 'frictionCoef'
    ];
    
    // Skip coloring for properties with complex formats or where comparison doesn't make sense
    if (!/^[\d.-]+/.test(value)) {
      return 'transparent';
    }
    
    const numericValues = materials
      .map(m => m.properties[property])
      .filter(v => v && /^[\d.-]+/.test(v))
      .map(v => parseFloat(v.match(/^[\d.-]+/)[0]));
    
    if (numericValues.length < 2) return 'transparent';
    
    const thisValue = parseFloat(value.match(/^[\d.-]+/)[0]);
    const isMax = thisValue === Math.max(...numericValues);
    const isMin = thisValue === Math.min(...numericValues);
    
    if ((higherIsBetter.includes(property) && isMax) || 
        (lowerIsBetter.includes(property) && isMin)) {
      return 'rgba(52, 211, 153, 0.1)'; // Light green for best value
    }
    
    if ((higherIsBetter.includes(property) && isMin) || 
        (lowerIsBetter.includes(property) && isMax)) {
      return 'rgba(239, 131, 84, 0.1)'; // Light accent color for worst value
    }
    
    return 'transparent';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Compare Materials</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="mb-4">
          Select up to 3 materials to compare their properties side by side.
        </p>
        
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent mb-4"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredMaterials.map(material => (
              <div 
                key={material.id}
                onClick={() => handleMaterialSelect(material)}
                className={`
                  p-3 border rounded-md cursor-pointer transition-all duration-200
                  ${selectedMaterials.some(m => m.id === material.id) 
                    ? 'border-accent bg-accent bg-opacity-5 shadow-md' 
                    : 'border-neutral bg-white hover:border-secondary'}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-primary">{material.name}</h3>
                    <p className="text-sm text-secondary">{material.type}</p>
                  </div>
                  <span className="bg-secondary text-white text-xs px-2 py-1 rounded">
                    {material.shortName}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredMaterials.length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-secondary">No materials found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {renderComparisonTable()}
    </div>
  );
};

export default ComparisonPage;