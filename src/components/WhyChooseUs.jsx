import React from "react";
import { Shield, Heart, Award, MapPin, Clock, Users } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Hosts",
      description:
        "All our hosts are thoroughly verified with background checks and property inspections for your safety.",
      gradient: "from-blue-400 to-blue-600",
      bgGradient: "from-blue-400/20 to-blue-600/20",
    },
    {
      icon: Heart,
      title: "Guest Favorites",
      description:
        "Handpicked accommodations loved by previous guests with ratings of 4.5+ stars consistently.",
      gradient: "from-rose-400 to-rose-600",
      bgGradient: "from-rose-400/20 to-rose-600/20",
    },
    {
      icon: Award,
      title: "Best Price Guarantee",
      description:
        "Found a lower price elsewhere? We'll match it and give you an extra 5% off your booking.",
      gradient: "from-amber-400 to-amber-600",
      bgGradient: "from-amber-400/20 to-amber-600/20",
    },
    {
      icon: MapPin,
      title: "Unique Locations",
      description:
        "Discover hidden gems and extraordinary places you won't find on other platforms.",
      gradient: "from-emerald-400 to-emerald-600",
      bgGradient: "from-emerald-400/20 to-emerald-600/20",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you before, during, and after your stay.",
      gradient: "from-purple-400 to-purple-600",
      bgGradient: "from-purple-400/20 to-purple-600/20",
    },
    {
      icon: Users,
      title: "Travel Community",
      description:
        "Join a community of like-minded travelers sharing experiences and recommendations.",
      gradient: "from-teal-400 to-teal-600",
      bgGradient: "from-teal-400/20 to-teal-600/20",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
              StayFinder
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            We're not just another booking platform. We're your trusted partner
            in discovering extraordinary travel experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100"
              >
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${feature.bgGradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-6`}
                  >
                    <IconComponent
                      className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto">
          <div className="group">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1 sm:mb-2">
              300+
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">
              Unique Stays
            </div>
          </div>
          <div className="group">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1 sm:mb-2">
              50K+
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">
              Happy Guests
            </div>
          </div>
          <div className="group">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1 sm:mb-2">
              4.9★
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">
              Average Rating
            </div>
          </div>
          <div className="group">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1 sm:mb-2">
              24/7
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">
              Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
