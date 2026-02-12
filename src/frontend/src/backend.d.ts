import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    favorites: Array<MessageId>;
    name: string;
    stats: UserStats;
}
export type Category = string;
export type Time = bigint;
export type MessageId = bigint;
export interface RewardBadge {
    id: BadgeId;
    name: string;
    description: string;
}
export type BadgeId = bigint;
export interface EncouragementMessage {
    id: MessageId;
    text: string;
    category: Category;
}
export interface UserStats {
    lastViewedTimestamp: Time;
    messagesViewed: bigint;
    badgesEarned: Array<BadgeId>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEncouragementMessage(text: string, category: Category): Promise<MessageId>;
    addFavorite(messageId: MessageId): Promise<void>;
    addRewardBadge(name: string, description: string): Promise<BadgeId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimReward(badgeId: BadgeId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEncouragementMessages(): Promise<Array<EncouragementMessage>>;
    getMessagesByCategory(category: Category): Promise<Array<EncouragementMessage>>;
    getRewardBadges(): Promise<Array<RewardBadge>>;
    getTodayEncouragement(): Promise<string>;
    getUserFavorites(): Promise<Array<EncouragementMessage>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStats(): Promise<UserStats>;
    isCallerAdmin(): Promise<boolean>;
    removeFavorite(messageId: MessageId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateStats(): Promise<boolean>;
}
