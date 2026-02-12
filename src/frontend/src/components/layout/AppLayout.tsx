import { type ReactNode } from 'react';
import { useSettings } from '../../state/SettingsContext';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { textSize, reducedMotion } = useSettings();

  const textSizeClass = `text-size-${textSize}`;
  const motionClass = reducedMotion ? 'reduce-motion' : '';

  return (
    <div
      className={`min-h-screen ${textSizeClass} ${motionClass}`}
      style={{
        backgroundImage: 'url(/assets/generated/background-pattern.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'soft-light',
      }}
    >
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
