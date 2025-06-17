import React from "react";
import AuthModal from "../components/AuthPage/AuthModal";

const AuthPage = ({ isOpen, onClose, initialMode = "login" }) => {
  return (
    <AuthModal isOpen={isOpen} onClose={onClose} initialMode={initialMode} />
  );
};

export default AuthPage;
