import React, { useState } from 'react';
import { getMaterialTypes } from '../data';
import config from '../config';

const AddMaterial = ({ materials }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    type: '',
    customType: '',
    designation: '',
    properties: {
      hardness: '',
      density: '',
      youngsModulus: '',
      uts: '',
      frictionCoef: '',
      waterAbsorption: '',
      electricalResistance: '',
      resistivity: '',
      flexuralMod: '',
      impactCharpy: '',
      notchedImpactCharpy: '',
      meltingTemp: '',
      specificHeatCap: '',
      thermalConductivity: '',
      costPerKg: '',
      recyclability: '',
      biocompatible: '',
      application: ''
    },
    customProperties: []
  });

  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: '', value: '' });
  
  const materialTypes = getMaterialTypes(materials);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: value,
      customType: '',
    }));
  };

  const handleNewPropertyChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCustomProperty = () => {
    if (newProperty.name.trim() && newProperty.value.trim()) {
      // Convert property name to camelCase for consistency
      const propertyName = newProperty.name
        .trim()
        .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
        .replace(/\s/g, '')
        .replace(/^(.)/, (_, c) => c.toLowerCase());
      
      setFormData(prev => ({
        ...prev,
        customProperties: [
          ...prev.customProperties,
          { name: propertyName, label: newProperty.name.trim(), value: newProperty.value.trim() }
        ]
      }));
      
      // Reset new property fields
      setNewProperty({ name: '', value: '' });
    }
  };

  const removeCustomProperty = (index) => {
    setFormData(prev => ({
      ...prev,
      customProperties: prev.customProperties.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty properties
    const filteredProperties = {};
    Object.entries(formData.properties).forEach(([key, value]) => {
      if (value.trim() !== '') {
        filteredProperties[key] = value.trim();
      }
    });
    
    // Add custom properties
    formData.customProperties.forEach(prop => {
      filteredProperties[prop.name] = prop.value;
    });
    
    // Create the new material object without id
    const newMaterial = {
      name: formData.name,
      shortName: formData.shortName,
      type: formData.type === 'custom' ? formData.customType : formData.type,
      designation: formData.designation,
      properties: filteredProperties
    };
    
    // Generate JSON code for GitHub contribution
    const code = JSON.stringify(newMaterial, null, 2);
    setGeneratedCode(code);
    
    // Scroll to the code section
    setTimeout(() => {
      document.getElementById('code-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Add New Material</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="mb-4">
          Fill out this form to generate the JSON code needed to add a new material to the database.
          After submitting, you can copy the code and contribute it via a GitHub pull request.
        </p>
        <a 
          href={config?.github?.url || "https://github.com/username/materials-database"} 
          className="text-accent hover:underline" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          View GitHub Repository →
        </a>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-secondary">Material Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. High-Density Polyethylene"
            />
          </div>
          
          <div>
            <label htmlFor="shortName" className="block mb-1 font-medium text-secondary">Short Name/Code*</label>
            <input
              type="text"
              id="shortName"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. HDPE"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block mb-1 font-medium text-secondary">Material Type*</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              required
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select a Type</option>
              {materialTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
              <option value="custom">Add New Type</option>
            </select>
          </div>
          
          {formData.type === 'custom' && (
            <div>
              <label htmlFor="customType" className="block mb-1 font-medium text-secondary">New Type Name*</label>
              <input
                type="text"
                id="customType"
                name="customType"
                value={formData.customType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g. Composite"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="designation" className="block mb-1 font-medium text-secondary">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. Type III"
            />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-primary mb-4 border-b border-neutral pb-2">Standard Properties</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="hardness" className="block mb-1 font-medium text-secondary">Hardness</label>
            <input
              type="text"
              id="hardness"
              name="properties.hardness"
              value={formData.properties.hardness}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. D65 Shore"
            />
          </div>
          
          <div>
            <label htmlFor="density" className="block mb-1 font-medium text-secondary">Density</label>
            <input
              type="text"
              id="density"
              name="properties.density"
              value={formData.properties.density}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 0.95 g/cm³"
            />
          </div>
          
          <div>
            <label htmlFor="youngsModulus" className="block mb-1 font-medium text-secondary">Young's Modulus</label>
            <input
              type="text"
              id="youngsModulus"
              name="properties.youngsModulus"
              value={formData.properties.youngsModulus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 1.2 GPa"
            />
          </div>
          
          <div>
            <label htmlFor="uts" className="block mb-1 font-medium text-secondary">UTS</label>
            <input
              type="text"
              id="uts"
              name="properties.uts"
              value={formData.properties.uts}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 30 MPa"
            />
          </div>
          
          <div>
            <label htmlFor="frictionCoef" className="block mb-1 font-medium text-secondary">Friction Coefficient</label>
            <input
              type="text"
              id="frictionCoef"
              name="properties.frictionCoef"
              value={formData.properties.frictionCoef}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 0.29"
            />
          </div>
          
          <div>
            <label htmlFor="waterAbsorption" className="block mb-1 font-medium text-secondary">Water Absorption</label>
            <input
              type="text"
              id="waterAbsorption"
              name="properties.waterAbsorption"
              value={formData.properties.waterAbsorption}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. <0.01%"
            />
          </div>
          
          <div>
            <label htmlFor="electricalResistance" className="block mb-1 font-medium text-secondary">Electrical Resistance</label>
            <input
              type="text"
              id="electricalResistance"
              name="properties.electricalResistance"
              value={formData.properties.electricalResistance}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 10^16 Ω·m"
            />
          </div>
          
          <div>
            <label htmlFor="resistivity" className="block mb-1 font-medium text-secondary">Resistivity</label>
            <input
              type="text"
              id="resistivity"
              name="properties.resistivity"
              value={formData.properties.resistivity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 10^16 Ω·m"
            />
          </div>
          
          <div>
            <label htmlFor="flexuralMod" className="block mb-1 font-medium text-secondary">Flexural Modulus</label>
            <input
              type="text"
              id="flexuralMod"
              name="properties.flexuralMod"
              value={formData.properties.flexuralMod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 1.25 GPa"
            />
          </div>
          
          <div>
            <label htmlFor="impactCharpy" className="block mb-1 font-medium text-secondary">Impact Charpy</label>
            <input
              type="text"
              id="impactCharpy"
              name="properties.impactCharpy"
              value={formData.properties.impactCharpy}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. No break"
            />
          </div>
          
          <div>
            <label htmlFor="notchedImpactCharpy" className="block mb-1 font-medium text-secondary">Notched Impact Charpy</label>
            <input
              type="text"
              id="notchedImpactCharpy"
              name="properties.notchedImpactCharpy"
              value={formData.properties.notchedImpactCharpy}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 8 kJ/m²"
            />
          </div>
          
          <div>
            <label htmlFor="meltingTemp" className="block mb-1 font-medium text-secondary">Melting Temperature</label>
            <input
              type="text"
              id="meltingTemp"
              name="properties.meltingTemp"
              value={formData.properties.meltingTemp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 135°C"
            />
          </div>
          
          <div>
            <label htmlFor="specificHeatCap" className="block mb-1 font-medium text-secondary">Specific Heat Capacity</label>
            <input
              type="text"
              id="specificHeatCap"
              name="properties.specificHeatCap"
              value={formData.properties.specificHeatCap}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 1900 J/(kg·K)"
            />
          </div>
          
          <div>
            <label htmlFor="thermalConductivity" className="block mb-1 font-medium text-secondary">Thermal Conductivity</label>
            <input
              type="text"
              id="thermalConductivity"
              name="properties.thermalConductivity"
              value={formData.properties.thermalConductivity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 0.48 W/(m·K)"
            />
          </div>
          
          <div>
            <label htmlFor="costPerKg" className="block mb-1 font-medium text-secondary">Cost Per kg</label>
            <input
              type="text"
              id="costPerKg"
              name="properties.costPerKg"
              value={formData.properties.costPerKg}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. 2.50 USD"
            />
          </div>
          
          <div>
            <label htmlFor="recyclability" className="block mb-1 font-medium text-secondary">Recyclability</label>
            <input
              type="text"
              id="recyclability"
              name="properties.recyclability"
              value={formData.properties.recyclability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. Yes/No/Partial"
            />
          </div>
          
          <div>
            <label htmlFor="biocompatible" className="block mb-1 font-medium text-secondary">Biocompatibility</label>
            <input
              type="text"
              id="biocompatible"
              name="properties.biocompatible"
              value={formData.properties.biocompatible}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. Yes/No/Conditional"
            />
          </div>
          
          <div>
            <label htmlFor="application" className="block mb-1 font-medium text-secondary">Common Applications</label>
            <input
              type="text"
              id="application"
              name="properties.application"
              value={formData.properties.application}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. Automotive parts, Medical devices"
            />
          </div>
        </div>

        {/* Custom Properties Section */}
        <div className="mb-6 border-t border-neutral pt-4">
          <h3 className="text-lg font-semibold text-primary mb-4">Custom Properties</h3>
          
          {formData.customProperties.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-secondary mb-3">Added Custom Properties:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.customProperties.map((prop, index) => (
                  <div key={index} className="bg-neutral bg-opacity-10 p-3 rounded relative group">
                    <button 
                      type="button"
                      onClick={() => removeCustomProperty(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove property"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <p className="font-medium text-primary">{prop.label}</p>
                    <p className="text-secondary mt-1">{prop.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-light p-4 rounded-lg">
            <h4 className="text-md font-medium text-secondary mb-3">Add New Custom Property:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="customPropertyName" className="block mb-1 font-medium text-secondary">Property Name</label>
                <input
                  type="text"
                  id="customPropertyName"
                  name="name"
                  value={newProperty.name}
                  onChange={handleNewPropertyChange}
                  className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. Glass Transition Temperature"
                />
              </div>
              
              <div>
                <label htmlFor="customPropertyValue" className="block mb-1 font-medium text-secondary">Property Value</label>
                <input
                  type="text"
                  id="customPropertyValue"
                  name="value"
                  value={newProperty.value}
                  onChange={handleNewPropertyChange}
                  className="w-full px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. 105°C"
                />
              </div>
              
              <div>
                <button 
                  type="button"
                  onClick={addCustomProperty}
                  disabled={!newProperty.name.trim() || !newProperty.value.trim()}
                  className="w-full px-3 py-2 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-6 py-3 bg-accent text-white rounded hover:bg-opacity-90 transition-colors shadow-sm font-medium"
          >
            Generate Contribution Code
          </button>
        </div>
      </form>
      
      {generatedCode && (
        <div id="code-section" className="bg-white rounded-lg shadow-md p-6 mt-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-primary">Generated Material JSON</h3>
            <button 
              onClick={copyToClipboard}
              className="px-3 py-1 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors shadow-sm text-sm flex items-center"
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
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-md p-4 text-gray-200 overflow-x-auto">
            <pre className="text-sm">
              <code>
                {generatedCode}
              </code>
            </pre>
          </div>
          
          <div className="mt-6 border-t border-neutral pt-4">
            <h4 className="text-md font-semibold text-primary mb-2">How to contribute:</h4>
            <ol className="list-decimal pl-6 space-y-2 text-secondary">
              <li>Copy the JSON code above</li>
              <li>Go to the <a href={config?.github?.url || "https://github.com/username/materials-database"} className="text-accent hover:underline">GitHub repository</a></li>
              <li>Fork the repository if you haven't already</li>
              <li>Navigate to the <code className="bg-neutral px-1 py-0.5 rounded text-xs">data.json</code> file</li>
              <li>Click on Edit (pencil icon)</li>
              <li>Find the closing <code className="bg-neutral px-1 py-0.5 rounded text-xs">]</code> before the last <code className="bg-neutral px-1 py-0.5 rounded text-xs">{'}'}</code> and add a comma after the previous material's closing brace</li>
              <li>Paste your new material JSON</li>
              <li>Add a commit message explaining your addition</li>
              <li>Create a pull request</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMaterial;