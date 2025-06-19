import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import ListingsPage from "./pages/ListingsPage";
import useAuthStore from "./store/useAuthStore";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login", // 'login' or 'signup'
  });

  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
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
            path="/listings/:id"
            element={
              <>
                <Navbar onAuthClick={handleAuthClick} />
                <ListingDetailsPage />
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
          {/* Updated route for booking confirmation */}
          <Route
            path="/booking-confirmation/:id"
            element={
              <>
                <Navbar onAuthClick={handleAuthClick} />
                <BookingConfirmationPage />
                <AuthPage
                  isOpen={authModal.isOpen}
                  onClose={closeAuthModal}
                  initialMode={authModal.mode}
                />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar onAuthClick={handleAuthClick} />
                <ProfilePage />
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
