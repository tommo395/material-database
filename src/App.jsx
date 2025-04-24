// App.jsx (modified to include logo)
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddMaterial from "./pages/AddMaterial";
import MaterialTypePage from "./pages/MaterialTypePage";
import ComparisonPage from "./pages/ComparisonPage";
import Info from "./pages/Info";
import { loadMaterials } from "./data";
import config from "./config";

function App() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      const data = await loadMaterials();
      setMaterials(data);
      setLoading(false);
    };

    fetchMaterials();
  }, []);

  // Close mobile menu when route changes
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
              <div className="flex justify-between w-full md:w-auto items-center">
                <Link
                  to="/"
                  className="text-2xl font-bold flex items-center"
                  onClick={closeMobileMenu}
                >
                  <div className="w-8 h-8 mr-2 bg-accent flex items-center justify-center rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  EquaLab <i className="text-2xl"> Materials</i>
                </Link>
                <div className="md:hidden">
                  <button
                    className="focus:outline-none p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                  >
                    <div className="w-6 h-5 relative">
                      <span
                        className={`absolute left-0 h-0.5 w-6 bg-white transform transition-transform duration-300 ease-in-out ${
                          mobileMenuOpen ? "top-2 rotate-45" : "top-0"
                        }`}
                      ></span>
                      <span
                        className={`absolute left-0 h-0.5 w-6 bg-white top-2 transition-opacity duration-200 ease-in-out ${
                          mobileMenuOpen ? "opacity-0" : "opacity-100"
                        }`}
                      ></span>
                      <span
                        className={`absolute left-0 h-0.5 w-6 bg-white transform transition-transform duration-300 ease-in-out ${
                          mobileMenuOpen ? "top-2 -rotate-45" : "top-4"
                        }`}
                      ></span>
                    </div>
                  </button>
                </div>
              </div>
              <nav
                className={`${
                  mobileMenuOpen ? "flex" : "hidden"
                } md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto transition-all duration-300 mt-4 md:mt-0`}
              >
                <Link
                  to="/"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link
                  to="/add"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                  onClick={closeMobileMenu}
                >
                  Add Material
                </Link>
                <Link
                  to="/compare"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                  onClick={closeMobileMenu}
                >
                  Compare
                </Link>
                <Link
                  to="/info"
                  className="hover:text-accent transition-colors py-1 px-2 rounded hover:bg-primary-dark"
                  onClick={closeMobileMenu}
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
                className="text-light hover:underline"
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