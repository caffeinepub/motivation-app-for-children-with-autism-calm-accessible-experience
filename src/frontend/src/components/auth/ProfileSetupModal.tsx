import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function ProfileSetupModal() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;

  const handleSave = async () => {
    if (!name.trim()) return;

    await saveProfile.mutateAsync({
      name: name.trim(),
      favorites: [],
      stats: {
        messagesViewed: BigInt(0),
        lastViewedTimestamp: BigInt(0),
        badgesEarned: [],
      },
    });
  };

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">What's your name?</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Let's personalize your experience
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="touch-target text-lg"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full touch-target-lg text-lg font-semibold"
            size="lg"
          >
            {saveProfile.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
