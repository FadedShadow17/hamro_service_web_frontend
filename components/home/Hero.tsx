import { Button } from '@/components/ui/Button';
import { StatsCards } from './StatsCards';

export function Hero() {
  return (
    <section className="relative bg-[#0A2640] overflow-hidden">
      {/* Subtle gradient shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#69E6A6]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A9EFF]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Save time by booking fast with{' '}
              <span className="text-[#69E6A6]">Hamro Service</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
              Connect with skilled professionals for all your home service needs.
              From plumbing to electrical work, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="primary" href="/services">
                Book a Service
              </Button>
              <Button variant="outline" href="/services">
                Explore Services
              </Button>
            </div>
          </div>

          {/* Right Side - Dashboard Cards */}
          <div className="lg:pl-8">
            <StatsCards />
          </div>
        </div>
      </div>
    </section>
  );
}

