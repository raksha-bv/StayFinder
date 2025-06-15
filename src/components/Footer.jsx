import React from "react";
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  const companyLinks = ["About Us", "Careers", "Press", "Blog"];
  const supportLinks = [
    "Help Center",
    "Contact Us",
    "Safety",
    "Trust & Safety",
  ];
  const hostingLinks = [
    "Become a Host",
    "Host Resources",
    "Community Forum",
    "Host Guarantee",
  ];
  const legalLinks = [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "Disclaimer",
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white h-screen lg:h-[50vh] flex flex-col mt-0">
      {/* Main Footer Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
          {/* Top Section - Company Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Brand Section */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 lg:mb-4">
                Stay
                <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
                  Finder
                </span>
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed max-w-md mx-auto lg:mx-0">
                Discover extraordinary stays and unforgettable experiences
                around the world. Your perfect getaway is just a click away.
              </p>

              {/* Social Links */}
              <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="group p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-rose-500/25"
                    >
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center lg:text-right">
              <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-3 lg:mb-4">
                Get in Touch
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center lg:justify-end space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full">
                    <Mail className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm">
                    hello@stayfinder.com
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-end space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full">
                    <Phone className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-end space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full">
                    <MapPin className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm">
                    San Francisco, CA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Company */}
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-2 sm:mb-3 text-white">
                Company
              </h4>
              <div className="space-y-1 sm:space-y-2">
                {companyLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-300 hover:translate-x-1"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-2 sm:mb-3 text-white">
                Support
              </h4>
              <div className="space-y-1 sm:space-y-2">
                {supportLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-300 hover:translate-x-1"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Hosting */}
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-2 sm:mb-3 text-white">
                Hosting
              </h4>
              <div className="space-y-1 sm:space-y-2">
                {hostingLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-300 hover:translate-x-1"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-2 sm:mb-3 text-white">
                Legal
              </h4>
              <div className="space-y-1 sm:space-y-2">
                {legalLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-300 hover:translate-x-1"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800/50 bg-black">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <p className="text-gray-400 text-xs text-center sm:text-left">
                © 2025 StayFinder, Inc. All rights reserved. Made with ❤️ for
                travelers worldwide.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-4 text-xs">
                <span className="text-gray-500">🌍 Global</span>
                <span className="text-gray-500">🛡️ Secure</span>
                <span className="text-gray-500">⭐ Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
