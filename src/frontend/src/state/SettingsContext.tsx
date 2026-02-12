import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type TextSize = 'small' | 'medium' | 'large';

export interface SettingsState {
  textSize: TextSize;
  reducedMotion: boolean;
  soundEnabled: boolean;
  ttsEnabled: boolean;
  rewardThreshold: number;
}

interface SettingsContextValue extends SettingsState {
  setTextSize: (size: TextSize) => void;
  setReducedMotion: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTtsEnabled: (enabled: boolean) => void;
  setRewardThreshold: (threshold: number) => void;
}

const defaultSettings: SettingsState = {
  textSize: 'medium',
  reducedMotion: false,
  soundEnabled: true,
  ttsEnabled: false,
  rewardThreshold: 5,
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const STORAGE_KEY = 'motivation-app-settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }, [settings]);

  const setTextSize = (size: TextSize) => {
    setSettings((prev) => ({ ...prev, textSize: size }));
  };

  const setReducedMotion = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, reducedMotion: enabled }));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled: enabled }));
  };

  const setTtsEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, ttsEnabled: enabled }));
  };

  const setRewardThreshold = (threshold: number) => {
    setSettings((prev) => ({ ...prev, rewardThreshold: threshold }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTextSize,
        setReducedMotion,
        setSoundEnabled,
        setTtsEnabled,
        setRewardThreshold,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
