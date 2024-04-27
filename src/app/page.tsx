import CTASection from "@/components/layout/Home/cta-section";
import FeaturesSection from "@/components/layout/Home/features-section";
import HeroSection from "@/components/layout/Home/hero-section";
import HowItWorksSection from "@/components/layout/Home/how-it-works-section";

export default function Home() {
  return (
    <main className="container mt-8 flex-1 md:mt-20">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
