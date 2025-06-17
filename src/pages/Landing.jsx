import HeroSection from "../components/LandingPage/HeroSection";
import FeaturedStays from "../components/LandingPage/FeaturedStays";
import WhyChooseUs from "../components/LandingPage/WhyChooseUs";

function Landing() {
  return (
    <div className="no-scrollbar overflow-x-hidden">
      <HeroSection />
      <FeaturedStays />
      <WhyChooseUs />
    </div>
  );
}

export default Landing;
