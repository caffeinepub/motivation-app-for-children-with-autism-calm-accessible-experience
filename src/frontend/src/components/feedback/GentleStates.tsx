import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export function GentleLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
}

interface GentleEmptyProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function GentleEmpty({ message = 'Nothing here yet', actionLabel, onAction }: GentleEmptyProps) {
  return (
    <Card className="shadow-soft">
      <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
        <Inbox className="w-16 h-16 text-muted-foreground/50" />
        <p className="text-xl text-muted-foreground text-center">{message}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline" className="touch-target">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface GentleErrorProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function GentleError({ message = 'Something went wrong', actionLabel, onAction }: GentleErrorProps) {
  return (
    <Card className="shadow-soft border-destructive/20">
      <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
        <AlertCircle className="w-16 h-16 text-destructive/70" />
        <p className="text-xl text-destructive/90 text-center">{message}</p>
        <p className="text-sm text-muted-foreground text-center">Please try again in a moment</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline" className="touch-target">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
