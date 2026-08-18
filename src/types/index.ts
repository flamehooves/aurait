export type AuraLevel = {
  level: number;
  name: string;
  minAura: number;
  maxAura: number;
  color: string;
};

export type User = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  city: string;
  country: string;
  auraScore: number;
  auraLevel: AuraLevel;
  streakCurrent: number;
  streakLongest: number;
  weeklyAuraGain: number;
  privacySettings: PrivacySettings;
  createdAt: string;
};

export type UserProfile = User & {
  friendCount: number;
  momentCount: number;
  completedChallenges: number;
  rankAmongFriends: number;
  cityPercentile: number;
};

export type FriendStatus = "friends" | "requested" | "add" | "none";

export type Friendship = {
  id: string;
  userId: string;
  friendId: string;
  status: "accepted" | "pending" | "declined";
  createdAt: string;
};

export type MomentVisibility = "friends" | "close_friends" | "public" | "only_me";

export type AuraMoment = {
  id: string;
  authorId: string;
  author: User;
  caption: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  auraCardId?: string;
  auraCardText?: string;
  visibility: MomentVisibility;
  challengeId?: string;
  challengeTitle?: string;
  auraCount: number;
  commentCount: number;
  hasGivenAura: boolean;
  location?: string;
  createdAt: string;
};

export type AuraInteraction = {
  id: string;
  momentId: string;
  fromUserId: string;
  toUserId: string;
  auraAmount: number;
  createdAt: string;
};

export type Comment = {
  id: string;
  momentId: string;
  authorId: string;
  author: User;
  text: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
};

export type AuraLedgerReason =
  | "moment_posted"
  | "aura_received"
  | "positive_comment"
  | "streak_bonus_3"
  | "streak_bonus_7"
  | "streak_bonus_14"
  | "challenge_completed"
  | "level_milestone"
  | "daily_opportunity"
  | "negative_comment"
  | "spam_penalty"
  | "moderation_penalty"
  | "reciprocal_abuse"
  | "challenge_abuse";

export type AuraLedgerEntry = {
  id: string;
  userId: string;
  amount: number;
  reason: AuraLedgerReason;
  description: string;
  relatedMomentId?: string;
  relatedChallengeId?: string;
  relatedUserId?: string;
  createdAt: string;
};

export type AuraSummary = {
  score: number;
  level: AuraLevel;
  nextLevel: AuraLevel | null;
  streakCurrent: number;
  streakLongest: number;
  weeklyGain: number;
  progressToNextLevel: number;
  rankAmongFriends: number;
  cityPercentile: number;
};

export type AuraStreak = {
  current: number;
  longest: number;
  lastQualifyingDate: string | null;
  weekDays: boolean[];
  nextMilestone: number;
};

export type AuraOpportunityCategory =
  | "Friends"
  | "Family"
  | "Gratitude"
  | "Community"
  | "Environment"
  | "Kindness"
  | "Quiet Aura"
  | "Social Aura"
  | "Helping"
  | "Inclusion";

export type AuraOpportunity = {
  id: string;
  title: string;
  description: string;
  category: AuraOpportunityCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  auraReward: number;
  isQuietAura: boolean;
};

export type ChallengeDifficulty = "Easy" | "Medium" | "Hard" | "Legendary";

export type ChallengeStatus = "locked" | "available" | "in_progress" | "completed";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  task: string;
  difficulty: ChallengeDifficulty;
  auraReward: number;
  streakRequirement?: number;
  participantCount: number;
  friendParticipants: User[];
  recentCompletions: { user: User; completedAt: string }[];
  imageUrl?: string;
};

export type ChallengeProgress = {
  challengeId: string;
  userId: string;
  status: ChallengeStatus;
  startedAt?: string;
  completedAt?: string;
  currentStreak: number;
};

export type LeaderboardScope = "friends" | "nearby" | "locality" | "city" | "country" | "global";
export type LeaderboardTimeRange = "today" | "week" | "month" | "all_time";

export type LeaderboardEntry = {
  rank: number;
  user: User;
  auraGained: number;
  streak: number;
  movement: number;
  isCurrentUser: boolean;
  percentile?: number;
};

export type NotificationType =
  | "aura_received"
  | "comment_received"
  | "challenge_completed_friend"
  | "leaderboard_moved"
  | "streak_reminder"
  | "level_reached"
  | "challenge_milestone"
  | "friend_request"
  | "friend_accepted"
  | "aura_adjustment";

export type Notification = {
  id: string;
  type: NotificationType;
  fromUser?: User;
  title: string;
  body: string;
  relatedMomentId?: string;
  relatedChallengeId?: string;
  isRead: boolean;
  createdAt: string;
};

export type PrivacySettings = {
  defaultVisibility: MomentVisibility;
  publicProfile: boolean;
  leaderboardParticipation: boolean;
  locationLeaderboard: boolean;
  friendRequests: "everyone" | "friends_of_friends";
};

export type UserSettings = {
  privacy: PrivacySettings;
  streakReminders: boolean;
  challengeReminders: boolean;
  milestonesNotifications: boolean;
  theme: "light" | "dark" | "system";
};

export type AuraCard = {
  id: string;
  text: string;
  variant: string;
};

export type DemoPersona = "maya" | "arjun" | "zoe";
