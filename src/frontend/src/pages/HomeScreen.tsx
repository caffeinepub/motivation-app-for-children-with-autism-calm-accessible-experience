import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Star, Settings, Sparkles } from 'lucide-react';
import { GENERATED_ASSETS } from '../components/branding/GeneratedAssets';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Encouragement</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/settings' })}
              className="touch-target"
            >
              <Settings className="w-6 h-6" />
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="touch-target">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center space-y-8">
        {/* Mascot */}
        <div className="w-48 h-48 relative">
          <img
            src={GENERATED_ASSETS.mascot.path}
            alt={GENERATED_ASSETS.mascot.alt}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            Hello{userProfile?.name ? `, ${userProfile.name}` : ''}!
          </h2>
          <p className="text-xl text-muted-foreground">What would you like to do today?</p>
        </div>

        {/* Primary Action */}
        <Card className="w-full max-w-md shadow-gentle">
          <CardContent className="p-6">
            <Button
              onClick={() => navigate({ to: '/encouragement' })}
              className="w-full touch-target-lg text-xl font-semibold"
              size="lg"
              data-testid="show-encouragement-btn"
              aria-label="Show me encouragement messages"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Show Me Encouragement
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/routine' })}
            className="touch-target-lg flex flex-col items-center gap-2 h-auto py-6"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <span className="text-lg font-medium">Routine Mode</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate({ to: '/favorites' })}
            className="touch-target-lg flex flex-col items-center gap-2 h-auto py-6"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-lg font-medium">Favorites</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate({ to: '/badges' })}
            className="touch-target-lg flex flex-col items-center gap-2 h-auto py-6"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-lg font-medium">My Badges</span>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with{' '}
            <Heart className="inline w-4 h-4 text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
