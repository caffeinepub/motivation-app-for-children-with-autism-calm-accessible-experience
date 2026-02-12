import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Star, Sparkles } from 'lucide-react';
import { useSettings } from '../state/SettingsContext';
import { playSuccessSound } from '../utils/sound';

export default function BadgeCelebrationScreen() {
  const navigate = useNavigate();
  const { soundEnabled, reducedMotion } = useSettings();

  useEffect(() => {
    if (soundEnabled) {
      playSuccessSound();
    }
  }, [soundEnabled]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-gentle">
        <CardContent className="p-12 text-center space-y-8">
          <div className="relative">
            <div
              className={`w-32 h-32 mx-auto bg-accent rounded-full flex items-center justify-center ${
                !reducedMotion ? 'animate-gentle-bounce' : ''
              }`}
            >
              <Star className="w-16 h-16 text-accent-foreground fill-current" />
            </div>
            {!reducedMotion && (
              <>
                <Sparkles className="w-8 h-8 text-primary absolute top-0 left-1/4 animate-pulse" />
                <Sparkles className="w-8 h-8 text-primary absolute top-0 right-1/4 animate-pulse delay-100" />
              </>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Great Job!</h1>
            <p className="text-2xl text-muted-foreground">
              You've earned a new badge for viewing encouragement messages!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate({ to: '/badges' })}
              className="touch-target-lg text-lg"
              size="lg"
            >
              <Star className="w-5 h-5 mr-2" />
              View My Badges
            </Button>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
              className="touch-target-lg text-lg"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
