import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

const Info = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">About Materials Database</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Project Overview</h2>
        <p className="mb-4">
          The Materials Database is a comprehensive tool for scientists, engineers, and researchers to access, compare, 
          and contribute information about various materials and their properties. This application allows users to:
        </p>
        
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Browse materials by type (polymer, metal, ceramic, etc.)</li>
          <li>Search for specific materials by name or designation</li>
          <li>Compare up to three materials side-by-side</li>
          <li>View detailed material properties including mechanical, electrical, and thermal characteristics</li>
          <li>Contribute new materials to the database through GitHub</li>
        </ul>
        
        <h3 className="text-lg font-semibold text-primary mb-2 mt-6">Project Origin</h3>
        <p>
          This database was created based on an idea by Thomas Bell, an aspiring materials scientist. Thomas envisioned a
          comprehensive, accessible platform where researchers and students could easily access and compare material properties
          for both reference and research purposes.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Using the Database</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary mb-2">Browsing Materials</h3>
          <p>
            Materials are organized by type. Click on any type in the sidebar to view all materials of that category.
            Each material is displayed as a card showing its name and short code. Click on a card to expand it and view all properties.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary mb-2">Searching</h3>
          <p>
            Use the search bar at the top of the home page to find materials by name or short code.
            The search uses fuzzy matching to help you find materials even with partial or approximate terms.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary mb-2">Comparing Materials</h3>
          <p>
            Navigate to the "Compare" page to select up to three materials for side-by-side comparison.
            The system will highlight the best values for relevant properties, making it easy to identify optimal materials.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-2">Contributing</h3>
          <p>
            To add new materials to the database, use the "Add Material" page to enter properties, then contribute the generated JSON
            to our GitHub repository. This crowd-sourced approach allows the database to grow with accurate, peer-reviewed information.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Technical Information</h2>
        <p className="mb-4">
          The Materials Database is built with modern web technologies:
        </p>
        
        <ul className="list-disc pl-6 mb-4">
          <li>React for the user interface</li>
          <li>Tailwind CSS for styling</li>
          <li>JSON for data storage</li>
          <li>GitHub integration for contribution management</li>
        </ul>
        
        <p>
  The source code is available on <a href={config.github.url} className="text-accent hover:underline">GitHub</a> under an open-source license, allowing for community contributions and improvements.
</p>
        
        <div className="mt-6 pt-4 border-t border-light-gray">
          <Link to="/" className="bg-secondary text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Database
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Info;