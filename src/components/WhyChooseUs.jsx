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
    <section className="min-h-screen w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center">
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
              StayFinder
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're not just another booking platform. We're your trusted partner
            in discovering extraordinary travel experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 lg:mb-12 flex-1">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${feature.bgGradient} rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <IconComponent
                      className={`w-6 h-6 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-center max-w-4xl mx-auto pt-4">
          <div className="group">
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              300+
            </div>
            <div className="text-sm text-gray-600">Unique Stays</div>
          </div>
          <div className="group">
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              50K+
            </div>
            <div className="text-sm text-gray-600">Happy Guests</div>
          </div>
          <div className="group">
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              4.9★
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="group">
            <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              24/7
            </div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
