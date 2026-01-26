// apps/web/src/features/auth/LoginPage.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming shadcn components exist
import { AuthLayout } from '../components/AuthLayout';

// 1. Define Validation Schema
const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // 2. Setup Form Hook
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Handle Submit
  async function onSubmit(data: LoginValues) {
    setIsLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      console.log('Login Data:', data);
      setIsLoading(false);
      navigate('/dashboard'); // Redirect after login
    }, 2000);
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your email to sign in to your account"
      linkText="Don't have an account?"
      linkUrl="/signup"
      linkLabel="Sign Up"
    >
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <Button variant="outline" type="button" disabled={isLoading}>
           Google (Demo)
        </Button>
      </div>
    </AuthLayout>
  );
}