// apps/web/src/features/auth/components/AuthLayout.tsx
import { WalletCards } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  linkLabel: string;
}

export const AuthLayout = ({
  children,
  title,
  description,
  linkText,
  linkUrl,
  linkLabel,
}: AuthLayoutProps) => {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      
      {/* Right Side: Visual/Branding (Hidden on mobile) */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <WalletCards className="mr-2 h-6 w-6" />
          SubTrack
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than
              ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* Left Side: Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          {children}

          <p className="px-8 text-center text-sm text-muted-foreground">
            {linkText}{' '}
            <Link to={linkUrl} className="underline underline-offset-4 hover:text-primary">
              {linkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};