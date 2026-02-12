import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../state/SettingsContext';
import { isTTSSupported } from '../utils/tts';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const {
    textSize,
    setTextSize,
    reducedMotion,
    setReducedMotion,
    soundEnabled,
    setSoundEnabled,
    ttsEnabled,
    setTtsEnabled,
  } = useSettings();

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
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Text Size */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Text Size</CardTitle>
              <CardDescription>Choose how large you want the text to be</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={textSize} onValueChange={(value: any) => setTextSize(value)}>
                <SelectTrigger className="touch-target text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small" className="text-lg">
                    Small
                  </SelectItem>
                  <SelectItem value="medium" className="text-lg">
                    Medium
                  </SelectItem>
                  <SelectItem value="large" className="text-lg">
                    Large
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Reduced Motion */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Reduced Motion</CardTitle>
              <CardDescription>Turn off animations and movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="text-lg cursor-pointer">
                  Reduce animations
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                  className="touch-target"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sound */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Sound</CardTitle>
              <CardDescription>Play gentle sounds for actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="text-lg cursor-pointer">
                  Enable sounds
                </Label>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  className="touch-target"
                />
              </div>
            </CardContent>
          </Card>

          {/* Text-to-Speech */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Text-to-Speech</CardTitle>
              <CardDescription>
                {isTTSSupported()
                  ? 'Have messages read aloud to you'
                  : 'Not supported in this browser'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="tts" className="text-lg cursor-pointer">
                  Enable text-to-speech
                </Label>
                <Switch
                  id="tts"
                  checked={ttsEnabled}
                  onCheckedChange={setTtsEnabled}
                  disabled={!isTTSSupported()}
                  className="touch-target"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
