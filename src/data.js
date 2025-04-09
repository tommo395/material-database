export const loadMaterials = async () => {
  try {
    const response = await fetch('/data.json');
    const data = await response.json();
    
    // Add IDs to materials if they don't already have them
    const materialsWithIds = data.materials.map((material, index) => ({
      ...material,
      id: material.id || `${index + 1}`
    }));
    
    return materialsWithIds;
  } catch (error) {
    console.error("Error loading materials:", error);
    return [];
  }
};

// Helper function to get unique material types
export const getMaterialTypes = (materials) => {
  return [...new Set(materials.map(material => material.type))];
};