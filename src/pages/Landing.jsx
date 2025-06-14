import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import FeaturedStays from "../components/FeaturedStays";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";

function Landing() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturedStays />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}

export default Landing;
