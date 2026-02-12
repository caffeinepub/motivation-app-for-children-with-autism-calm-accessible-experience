import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';
import { useGetUserStats, useGetRewardBadges } from '../hooks/useQueries';
import { GentleLoading, GentleEmpty, GentleError } from '../components/feedback/GentleStates';
import { GENERATED_ASSETS } from '../components/branding/GeneratedAssets';

export default function BadgesScreen() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetUserStats();
  const { data: badges, isLoading: badgesLoading, error: badgesError } = useGetRewardBadges();

  const isLoading = statsLoading || badgesLoading;
  const error = statsError || badgesError;

  const earnedBadgeIds = stats?.badgesEarned || [];
  const earnedBadges = badges?.filter((badge) =>
    earnedBadgeIds.some((id) => id === badge.id)
  ) || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="touch-target"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Home
          </Button>
          <h1 className="text-2xl font-bold">My Badges</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading && <GentleLoading message="Loading your badges..." />}
        {error && <GentleError message="Couldn't load badges right now" />}

        {!isLoading && !error && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Stats Summary */}
            <Card className="shadow-soft">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your Progress</CardTitle>
                <CardDescription className="text-lg">
                  You've viewed {stats ? Number(stats.messagesViewed) : 0} encouragement messages!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-48 h-48">
                  <img
                    src={GENERATED_ASSETS.badgesSet.path}
                    alt={GENERATED_ASSETS.badgesSet.alt}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Earned Badges */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">
                Badges Earned: {earnedBadges.length}
              </h2>

              {earnedBadges.length === 0 ? (
                <GentleEmpty message="Keep viewing messages to earn badges!" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {earnedBadges.map((badge) => (
                    <Card key={Number(badge.id)} className="shadow-soft">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <Star className="w-6 h-6 text-accent-foreground fill-current" />
                          </div>
                          <CardTitle className="text-xl">{badge.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-lg">{badge.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
