import React from "react";
import { MapPin, Star, Wifi } from "lucide-react";

const BrandingSection = () => {
  return (
    <div className="w-1/2 bg-gradient-to-br from-rose-500 to-rose-600 p-6 xl:p-8 flex flex-col justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-8 h-8 bg-white rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-6 h-6 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 text-white">
        <div className="mb-6 xl:mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-3 xl:mb-4">
            StayFinder
          </h1>
          <p className="text-lg xl:text-xl opacity-90">
            Your perfect stay awaits
          </p>
        </div>

        <div className="space-y-4 xl:space-y-6">
          <FeatureItem
            icon={<MapPin className="w-5 h-5 xl:w-6 xl:h-6" />}
            title="Prime Locations"
            description="Discover amazing stays in the best neighborhoods"
          />
          <FeatureItem
            icon={<Star className="w-5 h-5 xl:w-6 xl:h-6" />}
            title="Top Rated"
            description="Only the highest quality accommodations"
          />
          <FeatureItem
            icon={<Wifi className="w-5 h-5 xl:w-6 xl:h-6" />}
            title="Premium Amenities"
            description="WiFi, parking, and luxury facilities included"
          />
        </div>

        <div className="mt-6 xl:mt-8 flex items-center space-x-6">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-white rounded-full border-2 border-rose-500"></div>
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-rose-200 rounded-full border-2 border-rose-500"></div>
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-rose-300 rounded-full border-2 border-rose-500"></div>
          </div>
          <p className="text-sm xl:text-base opacity-90">
            Join 10,000+ happy travelers
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white/20 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-base xl:text-lg">{title}</h3>
        <p className="text-sm xl:text-base opacity-80">{description}</p>
      </div>
    </div>
  );
};

export default BrandingSection;
