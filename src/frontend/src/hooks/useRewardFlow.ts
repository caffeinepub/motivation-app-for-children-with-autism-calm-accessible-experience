import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSettings } from '../state/SettingsContext';
import { useGetUserStats } from './useQueries';
import { playSuccessSound } from '../utils/sound';

export function useRewardFlow() {
  const navigate = useNavigate();
  const { rewardThreshold, soundEnabled } = useSettings();
  const { data: stats } = useGetUserStats();
  const lastCheckedRef = useRef<bigint>(BigInt(0));

  useEffect(() => {
    if (!stats) return;

    const currentViewed = stats.messagesViewed;
    
    // Only trigger if we haven't checked this count yet
    if (currentViewed > lastCheckedRef.current) {
      lastCheckedRef.current = currentViewed;
      
      // Check if we hit a reward milestone
      if (currentViewed > BigInt(0) && Number(currentViewed) % rewardThreshold === 0) {
        if (soundEnabled) {
          playSuccessSound();
        }
        navigate({ to: '/celebration' });
      }
    }
  }, [stats, rewardThreshold, soundEnabled, navigate]);
}
