import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { ROUTINE_CATEGORIES } from '../constants/routineCategories';
import { useGetMessagesByCategory, useUpdateStats } from '../hooks/useQueries';
import { GentleLoading, GentleEmpty } from '../components/feedback/GentleStates';
import { useSettings } from '../state/SettingsContext';
import { playClickSound } from '../utils/sound';
import { useRewardFlow } from '../hooks/useRewardFlow';

export default function RoutineModeScreen() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { data: messages, isLoading } = useGetMessagesByCategory(selectedCategory || '');
  const updateStats = useUpdateStats();
  const { soundEnabled } = useSettings();

  useRewardFlow();

  const handleCategorySelect = (categoryId: string) => {
    if (soundEnabled) playClickSound();
    setSelectedCategory(categoryId);
    setCurrentMessageIndex(0);
    updateStats.mutate();
  };

  const handleBack = () => {
    if (soundEnabled) playClickSound();
    setSelectedCategory(null);
    setCurrentMessageIndex(0);
  };

  const handleNext = () => {
    if (soundEnabled) playClickSound();
    if (messages && messages.length > 0) {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      updateStats.mutate();
    }
  };

  const currentCategory = ROUTINE_CATEGORIES.find((cat) => cat.id === selectedCategory);

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
          <h1 className="text-2xl font-bold">Routine Mode</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {!selectedCategory ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold">Choose What You Need</h2>
              <p className="text-lg text-muted-foreground">Pick a category to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROUTINE_CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  className="shadow-soft cursor-pointer hover:shadow-gentle transition-shadow"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                    <CardDescription className="text-lg">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`h-2 rounded-full ${category.color}`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {isLoading && <GentleLoading message="Loading messages..." />}

            {!isLoading && messages && messages.length > 0 && (
              <>
                <Card className="shadow-gentle">
                  <CardHeader className={`${currentCategory?.color} rounded-t-lg`}>
                    <CardTitle className="text-xl">{currentCategory?.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 md:p-12">
                    <p className="text-2xl md:text-3xl text-center leading-relaxed font-medium">
                      {messages[currentMessageIndex].text}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="touch-target-lg flex-1 max-w-xs"
                  >
                    Back to Categories
                  </Button>
                  {messages.length > 1 && (
                    <Button
                      onClick={handleNext}
                      className="touch-target-lg flex-1 max-w-xs"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Next Message
                    </Button>
                  )}
                </div>
              </>
            )}

            {!isLoading && (!messages || messages.length === 0) && (
              <div className="space-y-4">
                <GentleEmpty message="No messages in this category yet" />
                <div className="flex justify-center">
                  <Button onClick={handleBack} className="touch-target-lg">
                    Back to Categories
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
