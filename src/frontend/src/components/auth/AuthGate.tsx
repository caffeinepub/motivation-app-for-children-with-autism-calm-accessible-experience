import { type ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Heart } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { identity, login, isLoggingIn, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-gentle">
          <CardContent className="pt-6 text-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-gentle">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription className="text-lg">
              Let's get started with some encouragement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full touch-target-lg text-lg font-semibold"
              size="lg"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to save your favorites and track your progress
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
