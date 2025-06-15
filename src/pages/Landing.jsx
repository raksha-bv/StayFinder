import HeroSection from "../components/HeroSection";
import FeaturedStays from "../components/FeaturedStays";
import WhyChooseUs from "../components/WhyChooseUs";

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
