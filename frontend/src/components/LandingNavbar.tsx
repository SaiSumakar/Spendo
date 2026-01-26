// apps/web/src/features/landing/components/LandingNavbar.tsx
import { WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; 

export const LandingNavbar = () => {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 fixed top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <WalletCards className="w-5 h-5" />
          </div>
          <span>SubTrack</span>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};