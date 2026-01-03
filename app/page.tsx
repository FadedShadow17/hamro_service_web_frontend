import { Hero } from '@/components/home/Hero';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { TrustSection } from '@/components/home/TrustSection';
import { Testimonials } from '@/components/home/Testimonials';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustSection />
      <ServicesPreview />
      <Testimonials />
      <CTASection />
    </>
  );
}
