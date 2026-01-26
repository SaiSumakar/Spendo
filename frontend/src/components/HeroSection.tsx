// apps/web/src/features/landing/components/HeroSection.tsx
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HeroVisual } from './HeroVisual';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl xl:text-7xl">
                Stop losing money on <span className="text-primary">forgotten</span> subscriptions.
              </h1>
              <p className="text-xl text-muted-foreground max-w-150 mx-auto lg:mx-0">
                Track your recurring expenses, visualize your monthly burn rate, and get alerted before you get charged.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Tracking Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                 <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Free for individuals
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required
              </span>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="mx-auto lg:mr-0">
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
};