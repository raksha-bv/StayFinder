import React, { useState } from "react";
import { Heart, Star } from "lucide-react";

const StayCard = ({
  images = [
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
  ],
  location = "Kollam, India",
  area = "Kollam beach",
  dates = "9-15 Jan",
  price = "₹2,568",
  rating = 4.79,
  isGuestFavorite = true,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  return (
    <div className="w-full bg-white group cursor-pointer">
      {/* Image Container - Square Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden rounded-xl">
        {/* Guest Favorite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 z-20 bg-white px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 shadow-sm">
            Guest favourite
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300"
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-white"
            }`}
          />
        </button>

        {/* Image */}
        <img
          src={images[currentImage]}
          alt={`${location} accommodation`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Navigation Overlay */}
        <div className="absolute inset-0 flex">
          <button
            onClick={prevImage}
            className="flex-1 bg-transparent"
          />
          <button
            onClick={nextImage}
            className="flex-1 bg-transparent"
          />
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentImage
                  ? "bg-white"
                  : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-3">
        {/* Location and Rating */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {location}
            </h3>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Star size={12} className="text-black fill-current" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
        </div>

        {/* Area */}
        <p className="text-gray-500 text-sm mb-1">{area}</p>

        {/* Dates */}
        <p className="text-gray-500 text-sm mb-2">{dates}</p>

        {/* Price */}
        <div className="flex items-baseline space-x-1">
          <span className="text-sm font-semibold text-gray-900">{price}</span>
          <span className="text-gray-500 text-sm">night</span>
        </div>
      </div>
    </div>
  );
};

export default StayCard;
