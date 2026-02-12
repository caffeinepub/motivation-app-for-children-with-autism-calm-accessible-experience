import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Heart, Volume2, RefreshCw, Sparkles } from 'lucide-react';
import {
  useGetEncouragementMessages,
  useGetTodayEncouragement,
  useAddFavorite,
  useRemoveFavorite,
  useGetUserFavorites,
  useUpdateStats,
} from '../hooks/useQueries';
import { GentleLoading, GentleEmpty, GentleError } from '../components/feedback/GentleStates';
import { useSettings } from '../state/SettingsContext';
import { speak, isTTSSupported } from '../utils/tts';
import { playClickSound } from '../utils/sound';
import { useRewardFlow } from '../hooks/useRewardFlow';
import type { EncouragementMessage } from '../backend';

export default function EncouragementScreen() {
  const navigate = useNavigate();
  const { data: messages, isLoading, error, refetch } = useGetEncouragementMessages();
  const { data: todayMessage, isLoading: todayLoading, error: todayError } = useGetTodayEncouragement();
  const { data: favorites } = useGetUserFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const updateStats = useUpdateStats();
  const { ttsEnabled, soundEnabled } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  useRewardFlow();

  useEffect(() => {
    if (messages && messages.length > 0 && history.length === 0) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setCurrentIndex(randomIndex);
      setHistory([randomIndex]);
      updateStats.mutate();
    }
  }, [messages]);

  const currentMessage = messages && messages.length > 0 ? messages[currentIndex] : null;
  const isFavorite = currentMessage ? favorites?.some((fav) => fav.id === currentMessage.id) || false : false;

  const handleNext = () => {
    if (!messages || messages.length === 0) return;
    if (soundEnabled) playClickSound();
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentIndex(randomIndex);
    setHistory((prev) => [...prev, randomIndex]);
    updateStats.mutate();
  };

  const handlePrevious = () => {
    if (soundEnabled) playClickSound();
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevIndex = newHistory[newHistory.length - 1];
      setCurrentIndex(prevIndex);
      setHistory(newHistory);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentMessage) return;
    if (soundEnabled) playClickSound();
    if (isFavorite) {
      await removeFavorite.mutateAsync(currentMessage.id);
    } else {
      await addFavorite.mutateAsync(currentMessage.id);
    }
  };

  const handleSpeak = () => {
    if (!currentMessage) return;
    if (soundEnabled) playClickSound();
    speak(currentMessage.text);
  };

  const handleSpeakDaily = () => {
    if (soundEnabled) playClickSound();
    if (todayMessage) {
      speak(todayMessage);
    }
  };

  const handleRetry = () => {
    if (soundEnabled) playClickSound();
    refetch();
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
          <h1 className="text-2xl font-bold">Encouragement</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          {/* Today's Encouragement Section - Always visible */}
          <div>
            {todayLoading ? (
              <Card className="shadow-gentle border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    <span className="text-sm">Loading today's message...</span>
                  </div>
                </CardContent>
              </Card>
            ) : todayError ? (
              <Card className="shadow-gentle border-muted">
                <CardContent className="p-6">
                  <p className="text-center text-sm text-muted-foreground">
                    Today's message isn't available right now
                  </p>
                </CardContent>
              </Card>
            ) : todayMessage ? (
              <Card className="shadow-gentle border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Today's Encouragement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl md:text-2xl text-center leading-relaxed font-medium">
                    {todayMessage}
                  </p>
                  {ttsEnabled && isTTSSupported() && (
                    <div className="flex justify-center">
                      <Button onClick={handleSpeakDaily} variant="ghost" size="sm" className="touch-target">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Speak
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Random Message Section */}
          <div className="space-y-6">
            {isLoading ? (
              <GentleLoading message="Finding more encouragement for you..." />
            ) : error ? (
              <GentleError 
                message="Couldn't load messages right now" 
                actionLabel="Try again"
                onAction={handleRetry}
              />
            ) : !messages || messages.length === 0 ? (
              <GentleEmpty 
                message="No random messages are available at the moment" 
                actionLabel="Try again"
                onAction={handleRetry}
              />
            ) : currentMessage ? (
              <>
                {/* Message Card */}
                <Card className="shadow-gentle">
                  <CardContent className="p-8 md:p-12">
                    <p className="text-2xl md:text-3xl text-center leading-relaxed font-medium">
                      {currentMessage.text}
                    </p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={handleToggleFavorite}
                    variant={isFavorite ? 'default' : 'outline'}
                    className="touch-target-lg"
                    disabled={addFavorite.isPending || removeFavorite.isPending}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Favorited' : 'Favorite'}
                  </Button>

                  {ttsEnabled && isTTSSupported() && (
                    <Button onClick={handleSpeak} variant="outline" className="touch-target-lg">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Speak
                    </Button>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    disabled={history.length <= 1}
                    className="touch-target-lg flex-1 max-w-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="touch-target-lg flex-1 max-w-xs"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Another One
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
