import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="bg-[#0A2640] py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Help Today?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Book a service in minutes and get connected with a professional right away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" href="/services" size="lg">
              Book a Service Now
            </Button>
            <Button variant="secondary" href="/contact" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

