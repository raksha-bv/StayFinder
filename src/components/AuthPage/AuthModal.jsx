import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import MobileAuthLayout from "./MobileAuthLayout";
import DesktopAuthLayout from "./DesktopAuthLayout";
import useAuthStore from "../../store/useAuthStore"; // Add this import

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const { authUser } = useAuthStore(); // Add this
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false,
    isHost: false,
  });

  // Close modal when user is authenticated
  useEffect(() => {
    if (authUser && isOpen) {
      onClose();
    }
  }, [authUser, isOpen, onClose]);

  // Update auth mode when initialMode changes
  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      agreeToTerms: false,
      isHost: false,
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const commonProps = {
    isLogin,
    formData,
    onInputChange: handleInputChange,
    onSubmit: handleSubmit,
    onToggleAuthMode: toggleAuthMode,
    onClose,
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <MobileAuthLayout {...commonProps} />
      <DesktopAuthLayout {...commonProps} />
    </div>
  );
};

export default AuthModal;
