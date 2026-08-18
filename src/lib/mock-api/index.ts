import type {
  AuraMoment,
  AuraLedgerEntry,
  AuraOpportunity,
  AuraSummary,
  Challenge,
  ChallengeProgress,
  Comment,
  LeaderboardEntry,
  LeaderboardScope,
  LeaderboardTimeRange,
  Notification,
  UserProfile,
  UserSettings,
} from "@/types";
import {
  MOCK_MOMENTS,
  MOCK_FRIENDS,
  MOCK_CHALLENGES,
  MOCK_AURA_HISTORY,
  MOCK_NOTIFICATIONS,
  MOCK_OPPORTUNITIES,
  LEADERBOARD_FRIENDS,
  LEADERBOARD_CITY,
  MOCK_COMMENTS,
  DEMO_USERS,
  SUGGESTED_USERS,
} from "@/lib/mock-data";
import { getAuraLevel, getNextLevel, getLevelProgress, AURA_ECONOMY } from "@/lib/constants/aura";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return delay(250 + Math.random() * 500);
}

// In-memory mutable state
let moments = [...MOCK_MOMENTS];
let notifications = [...MOCK_NOTIFICATIONS];
let challenges: Challenge[] = [...MOCK_CHALLENGES];
let challengeProgress: ChallengeProgress[] = [];
let currentOpportunityIndex = 0;

export const mockApi = {
  async getFeed(userId: string): Promise<AuraMoment[]> {
    await randomDelay();
    return [...moments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getMoment(id: string): Promise<AuraMoment | null> {
    await randomDelay();
    return moments.find((m) => m.id === id) ?? null;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    await randomDelay();
    const key = Object.keys(DEMO_USERS).find(
      (k) => DEMO_USERS[k as keyof typeof DEMO_USERS].id === userId
    );
    if (key) return DEMO_USERS[key as keyof typeof DEMO_USERS];
    const friend = MOCK_FRIENDS.find((f) => f.id === userId);
    if (friend) {
      return {
        ...friend,
        friendCount: 8 + Math.floor(Math.random() * 15),
        momentCount: 10 + Math.floor(Math.random() * 40),
        completedChallenges: Math.floor(Math.random() * 8),
        rankAmongFriends: 1 + Math.floor(Math.random() * 12),
        cityPercentile: 5 + Math.floor(Math.random() * 20),
      };
    }
    return null;
  },

  async getFriends(): Promise<typeof MOCK_FRIENDS> {
    await randomDelay();
    return MOCK_FRIENDS;
  },

  async getSuggestedUsers() {
    await randomDelay();
    return SUGGESTED_USERS;
  },

  async sendFriendRequest(userId: string): Promise<void> {
    await randomDelay();
  },

  async acceptFriendRequest(userId: string): Promise<void> {
    await randomDelay();
  },

  async postMoment(
    userId: string,
    data: { caption: string; mediaUrl?: string; auraCardId?: string; auraCardText?: string; challengeId?: string; visibility: string }
  ): Promise<AuraMoment> {
    await delay(800 + Math.random() * 400);
    const demoUser = Object.values(DEMO_USERS).find((u) => u.id === userId);
    if (!demoUser) throw new Error("User not found");
    const newMoment: AuraMoment = {
      id: `moment-${Date.now()}`,
      authorId: userId,
      author: demoUser,
      caption: data.caption,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaUrl ? "image" : undefined,
      auraCardId: data.auraCardId,
      auraCardText: data.auraCardText,
      visibility: data.visibility as AuraMoment["visibility"],
      challengeId: data.challengeId,
      auraCount: 0,
      commentCount: 0,
      hasGivenAura: false,
      createdAt: new Date().toISOString(),
    };
    moments = [newMoment, ...moments];
    return newMoment;
  },

  async giveAura(momentId: string, userId: string): Promise<{ newCount: number }> {
    await randomDelay();
    moments = moments.map((m) =>
      m.id === momentId
        ? { ...m, auraCount: m.auraCount + Math.floor(10 + Math.random() * 20), hasGivenAura: true }
        : m
    );
    const updated = moments.find((m) => m.id === momentId);
    return { newCount: updated?.auraCount ?? 0 };
  },

  async removeAura(momentId: string, userId: string): Promise<{ newCount: number }> {
    await randomDelay();
    moments = moments.map((m) =>
      m.id === momentId
        ? { ...m, auraCount: Math.max(0, m.auraCount - 15), hasGivenAura: false }
        : m
    );
    const updated = moments.find((m) => m.id === momentId);
    return { newCount: updated?.auraCount ?? 0 };
  },

  async postComment(momentId: string, userId: string, text: string): Promise<Comment> {
    await randomDelay();
    const demoUser = Object.values(DEMO_USERS).find((u) => u.id === userId);
    if (!demoUser) throw new Error("User not found");
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      momentId,
      authorId: userId,
      author: demoUser,
      text,
      createdAt: new Date().toISOString(),
    };
    moments = moments.map((m) =>
      m.id === momentId ? { ...m, commentCount: m.commentCount + 1 } : m
    );
    return comment;
  },

  async getComments(momentId: string): Promise<Comment[]> {
    await randomDelay();
    return MOCK_COMMENTS.filter((c) => c.momentId === momentId);
  },

  async getAuraSummary(userId: string): Promise<AuraSummary> {
    await randomDelay();
    const key = Object.keys(DEMO_USERS).find(
      (k) => DEMO_USERS[k as keyof typeof DEMO_USERS].id === userId
    ) as keyof typeof DEMO_USERS | undefined;
    const user = key ? DEMO_USERS[key] : DEMO_USERS.maya;
    const level = getAuraLevel(user.auraScore);
    const nextLevel = getNextLevel(level);
    return {
      score: user.auraScore,
      level,
      nextLevel,
      streakCurrent: user.streakCurrent,
      streakLongest: user.streakLongest,
      weeklyGain: user.weeklyAuraGain,
      progressToNextLevel: getLevelProgress(user.auraScore, level),
      rankAmongFriends: 3,
      cityPercentile: 8,
    };
  },

  async getAuraHistory(userId: string): Promise<AuraLedgerEntry[]> {
    await randomDelay();
    return MOCK_AURA_HISTORY.filter((e) => e.userId === userId);
  },

  async getOpportunity(userId: string): Promise<AuraOpportunity> {
    await randomDelay();
    return MOCK_OPPORTUNITIES[currentOpportunityIndex % MOCK_OPPORTUNITIES.length];
  },

  async swapOpportunity(userId: string): Promise<AuraOpportunity> {
    await randomDelay();
    currentOpportunityIndex = (currentOpportunityIndex + 1) % MOCK_OPPORTUNITIES.length;
    return MOCK_OPPORTUNITIES[currentOpportunityIndex];
  },

  async acceptOpportunity(userId: string, opportunityId: string): Promise<void> {
    await randomDelay();
  },

  async getChallenges(): Promise<Challenge[]> {
    await randomDelay();
    return challenges;
  },

  async getChallenge(id: string): Promise<Challenge | null> {
    await randomDelay();
    return challenges.find((c) => c.id === id) ?? null;
  },

  async startChallenge(challengeId: string, userId: string): Promise<ChallengeProgress> {
    await randomDelay();
    const existing = challengeProgress.find(
      (p) => p.challengeId === challengeId && p.userId === userId
    );
    if (existing) return existing;
    const progress: ChallengeProgress = {
      challengeId,
      userId,
      status: "in_progress",
      startedAt: new Date().toISOString(),
      currentStreak: 0,
    };
    challengeProgress = [...challengeProgress, progress];
    return progress;
  },

  async completeChallenge(challengeId: string, userId: string): Promise<ChallengeProgress> {
    await delay(1000);
    challengeProgress = challengeProgress.map((p) =>
      p.challengeId === challengeId && p.userId === userId
        ? { ...p, status: "completed" as const, completedAt: new Date().toISOString() }
        : p
    );
    return challengeProgress.find(
      (p) => p.challengeId === challengeId && p.userId === userId
    )!;
  },

  async getChallengeProgress(userId: string): Promise<ChallengeProgress[]> {
    await randomDelay();
    return challengeProgress.filter((p) => p.userId === userId);
  },

  async getLeaderboard(
    scope: LeaderboardScope,
    timeRange: LeaderboardTimeRange
  ): Promise<LeaderboardEntry[]> {
    await randomDelay();
    if (scope === "friends") return LEADERBOARD_FRIENDS;
    return LEADERBOARD_CITY.map((e, i) => ({
      ...e,
      auraGained:
        timeRange === "today"
          ? Math.floor(e.auraGained / 7)
          : timeRange === "month"
          ? e.auraGained * 4
          : timeRange === "all_time"
          ? e.auraGained * 52
          : e.auraGained,
    }));
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    await randomDelay();
    return notifications;
  },

  async markNotificationsRead(ids: string[]): Promise<void> {
    await randomDelay();
    notifications = notifications.map((n) =>
      ids.includes(n.id) ? { ...n, isRead: true } : n
    );
  },

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    await randomDelay();
    return { ...DEMO_USERS.maya, ...data };
  },

  async updateSettings(userId: string, data: Partial<UserSettings>): Promise<UserSettings> {
    await randomDelay();
    return {
      privacy: DEMO_USERS.maya.privacySettings,
      streakReminders: true,
      challengeReminders: true,
      milestonesNotifications: true,
      theme: "system",
      ...data,
    };
  },

  async getUserMoments(userId: string): Promise<AuraMoment[]> {
    await randomDelay();
    return moments.filter((m) => m.authorId === userId).slice(0, 10);
  },
};
