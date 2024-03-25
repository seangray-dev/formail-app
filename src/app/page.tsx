import FeaturesSection from "@/components/layout/Home/features-section";
import HeroSection from "@/components/layout/Home/hero-section";

export default function Home() {
  return (
    <main data-testid="main" className="container my-8 flex-1 md:my-20">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
