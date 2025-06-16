import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import ListingsPage from "./pages/ListingsPage";

function App() {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login", // 'login' or 'signup'
  });

  const handleAuthClick = (authType) => {
    setAuthModal({
      isOpen: true,
      mode: authType,
    });
  };

  const closeAuthModal = () => {
    setAuthModal({
      isOpen: false,
      mode: "login",
    });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar onAuthClick={handleAuthClick} />
                <Landing />
                <Footer />
                <AuthPage
                  isOpen={authModal.isOpen}
                  onClose={closeAuthModal}
                  initialMode={authModal.mode}
                />
              </>
            }
          />
          <Route
            path="/listings"
            element={
              <>
                <Navbar onAuthClick={handleAuthClick} />
                <ListingsPage />
                <Footer />
                <AuthPage
                  isOpen={authModal.isOpen}
                  onClose={closeAuthModal}
                  initialMode={authModal.mode}
                />
              </>
            }
          />
          <Route
            path="/experiences"
            element={
              <>
                <Navbar onAuthClick={handleAuthClick} />
                <div className="min-h-screen bg-gray-50 pt-20">
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold">Experiences Page</h1>
                    <p className="text-gray-600 mt-4">Coming soon...</p>
                  </div>
                </div>
                <Footer />
                <AuthPage
                  isOpen={authModal.isOpen}
                  onClose={closeAuthModal}
                  initialMode={authModal.mode}
                />
              </>
            }
          />
          <Route
            path="/help"
            element={
              <>
                <Navbar onAuthClick={handleAuthClick} />
                <div className="min-h-screen bg-gray-50 pt-20">
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold">Help & Support</h1>
                    <p className="text-gray-600 mt-4">Coming soon...</p>
                  </div>
                </div>
                <Footer />
                <AuthPage
                  isOpen={authModal.isOpen}
                  onClose={closeAuthModal}
                  initialMode={authModal.mode}
                />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
