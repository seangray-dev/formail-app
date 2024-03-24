import FeaturesSection from '@/components/layout/Home/features-section';
import HeroSection from '@/components/layout/Home/hero-section';

export default function Home() {
  return (
    <main className='container flex-1 my-8 md:my-20'>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
