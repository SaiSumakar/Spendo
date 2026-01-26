// apps/web/src/features/landing/LandingPage.tsx
import { LandingNavbar } from '../components/LandingNavbar';
import { HeroSection } from '../components/HeroSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Optional: Add Social Proof / Features Grid here later */}
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by [Your Name]. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}