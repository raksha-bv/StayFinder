import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import AuthPage from "./components/AuthPage";

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
    <div className="App">
      <Navbar onAuthClick={handleAuthClick} />
      <Landing />

      <AuthPage
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
      <Footer />
    </div>
  );
}

export default App;
