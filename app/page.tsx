import { Hero } from '@/components/home/Hero';
import { CategorySection } from '@/components/home/CategorySection';
import { TrustSection } from '@/components/home/TrustSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { Testimonials } from '@/components/home/Testimonials';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <section id="home" className="scroll-mt-20">
        <Hero />
      </section>
      <section id="services" className="scroll-mt-20">
        <CategorySection />
      </section>
      <section id="how-it-works" className="scroll-mt-20">
        <HowItWorksSection />
      </section>
      <section id="why-us" className="scroll-mt-20">
        <TrustSection />
      </section>
      <section id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </section>
      <CTASection />
    </>
  );
}
