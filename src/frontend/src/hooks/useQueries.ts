import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EncouragementMessage, UserProfile, UserStats, RewardBadge, MessageId, BadgeId, Category } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetEncouragementMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EncouragementMessage[]>({
    queryKey: ['encouragementMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEncouragementMessages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTodayEncouragement() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['todayEncouragement'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTodayEncouragement();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since it's daily
  });
}

export function useGetMessagesByCategory(category: Category) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EncouragementMessage[]>({
    queryKey: ['encouragementMessages', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessagesByCategory(category);
    },
    enabled: !!actor && !actorFetching && !!category,
  });
}

export function useGetUserFavorites() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EncouragementMessage[]>({
    queryKey: ['userFavorites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserFavorites();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: MessageId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFavorite(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: MessageId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFavorite(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserStats>({
    queryKey: ['userStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserStats();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStats();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetRewardBadges() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RewardBadge[]>({
    queryKey: ['rewardBadges'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRewardBadges();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useClaimReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (badgeId: BadgeId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.claimReward(badgeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
