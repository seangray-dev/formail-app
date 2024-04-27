import CTASection from "@/components/layout/home/cta-section";
import FeaturesSection from "@/components/layout/home/features-section";
import HeroSection from "@/components/layout/home/hero-section";
import HowItWorksSection from "@/components/layout/home/how-it-works-section";

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
