import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { useGetUserFavorites, useRemoveFavorite } from '../hooks/useQueries';
import { GentleLoading, GentleEmpty, GentleError } from '../components/feedback/GentleStates';
import { useSettings } from '../state/SettingsContext';
import { playClickSound } from '../utils/sound';

export default function FavoritesScreen() {
  const navigate = useNavigate();
  const { data: favorites, isLoading, error } = useGetUserFavorites();
  const removeFavorite = useRemoveFavorite();
  const { soundEnabled } = useSettings();

  const handleRemove = async (messageId: bigint) => {
    if (soundEnabled) playClickSound();
    await removeFavorite.mutateAsync(messageId);
  };

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
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading && <GentleLoading message="Loading your favorites..." />}
        {error && <GentleError message="Couldn't load favorites right now" />}
        {!isLoading && !error && (!favorites || favorites.length === 0) && (
          <GentleEmpty message="No favorites yet. Add some from the encouragement screen!" />
        )}

        {favorites && favorites.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-4">
            {favorites.map((message) => (
              <Card key={Number(message.id)} className="shadow-soft">
                <CardContent className="p-6 flex items-start gap-4">
                  <Heart className="w-6 h-6 text-primary fill-current flex-shrink-0 mt-1" />
                  <p className="text-lg flex-1 leading-relaxed">{message.text}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(message.id)}
                    disabled={removeFavorite.isPending}
                    className="touch-target flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
