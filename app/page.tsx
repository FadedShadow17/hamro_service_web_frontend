import { Hero } from '@/components/home/Hero';
import { CategorySection } from '@/components/home/CategorySection';
import { TrustSection } from '@/components/home/TrustSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { Testimonials } from '@/components/home/Testimonials';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <TrustSection />
      <HowItWorksSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
