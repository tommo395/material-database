import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddMaterial from "./pages/AddMaterial";
import MaterialTypePage from "./pages/MaterialTypePage";
import ComparisonPage from "./pages/ComparisonPage";
import Info from "./pages/Info";
import { loadMaterials } from "./data";
import config from './config';

function App() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      const data = await loadMaterials();
      setMaterials(data);
      setLoading(false);
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-light flex flex-col">
        <header className="bg-primary text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Link to="/" className="text-2xl font-bold mb-4 md:mb-0">
                Materials Database
              </Link>
              <nav className="flex space-x-4">
                <Link
                  to="/"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                >
                  Home
                </Link>
                <Link
                  to="/add"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                >
                  Add Material
                </Link>
                <Link
                  to="/compare"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                >
                  Compare
                </Link>
                <Link
                  to="/info"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                >
                  Info
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 flex-grow">
          <Routes>
            <Route path="/" element={<Home materials={materials} />} />
            <Route
              path="/add"
              element={<AddMaterial materials={materials} />}
            />
            <Route
              path="/type/:typeId"
              element={<MaterialTypePage materials={materials} />}
            />
            <Route
              path="/compare"
              element={<ComparisonPage materials={materials} />}
            />
            <Route path="/info" element={<Info />} />
          </Routes>
        </main>
        <footer className="bg-primary text-white py-4 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>
            <a 
        href={config.github.url} 
        className="text-accent hover:underline"
        target="_blank" 
        rel="noopener noreferrer"
      >
        Contribute on GitHub
      </a>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
