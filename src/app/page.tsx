import CTASection from "@/components/layout/Home/cta-section";
import FeaturesSection from "@/components/layout/Home/features-section";
import HeroSection from "@/components/layout/Home/hero-section";
import HowItWorksSection from "@/components/layout/Home/how-it-works-section";

export default function Home() {
  return (
    <main className="container flex-1">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
