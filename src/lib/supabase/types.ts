export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AuraDifficulty = "Easy" | "Medium" | "Hard" | "Legendary";
export type MomentVisibility = "public" | "friends" | "private";
export type FriendshipStatus = "pending" | "accepted" | "blocked";
export type NotificationType =
  | "aura_received"
  | "comment_received"
  | "challenge_completed_friend"
  | "friend_request"
  | "friend_accepted"
  | "streak_reminder"
  | "leaderboard_moved"
  | "level_reached"
  | "challenge_milestone"
  | "aura_adjustment";

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          display_name: string;
          bio: string | null;
          avatar_url: string | null;
          city: string | null;
          country: string | null;
          aura_score: number;
          streak_current: number;
          streak_best: number;
          rank_friends: number | null;
          rank_city: number | null;
          city_percentile: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          display_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          country?: string | null;
          aura_score?: number;
          streak_current?: number;
          streak_best?: number;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
      moments: {
        Row: {
          id: string;
          author_id: string;
          caption: string;
          media_url: string | null;
          media_type: "image" | "video" | null;
          aura_card: string | null;
          visibility: MomentVisibility;
          challenge_id: string | null;
          aura_count: number;
          comment_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          caption: string;
          media_url?: string | null;
          media_type?: "image" | "video" | null;
          aura_card?: string | null;
          visibility?: MomentVisibility;
          challenge_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["moments"]["Insert"]>;
      };
      aura_given: {
        Row: {
          id: string;
          moment_id: string;
          giver_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          moment_id: string;
          giver_id: string;
          amount: number;
        };
        Update: never;
      };
      aura_ledger: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          description: string;
          related_moment_id: string | null;
          related_user_id: string | null;
          related_challenge_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          reason: string;
          description: string;
          related_moment_id?: string | null;
          related_user_id?: string | null;
          related_challenge_id?: string | null;
        };
        Update: never;
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          task: string;
          difficulty: AuraDifficulty;
          aura_reward: number;
          streak_requirement: number | null;
          participant_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          task: string;
          difficulty: AuraDifficulty;
          aura_reward: number;
          streak_requirement?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["challenges"]["Insert"]>;
      };
      challenge_progress: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          started_at: string;
          completed_at: string | null;
          status: "in_progress" | "completed" | "abandoned";
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["challenge_progress"]["Insert"]>;
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: FriendshipStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: FriendshipStatus;
        };
        Update: Partial<Database["public"]["Tables"]["friendships"]["Insert"]>;
      };
      comments: {
        Row: {
          id: string;
          moment_id: string;
          author_id: string;
          body: string;
          is_positive: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          moment_id: string;
          author_id: string;
          body: string;
          is_positive?: boolean | null;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          from_user_id: string | null;
          title: string;
          body: string;
          related_moment_id: string | null;
          related_challenge_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          from_user_id?: string | null;
          title: string;
          body: string;
          related_moment_id?: string | null;
          related_challenge_id?: string | null;
          is_read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      aura_opportunities: {
        Row: {
          id: string;
          title: string;
          description: string;
          aura_reward: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          aura_reward: number;
          expires_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["aura_opportunities"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      aura_difficulty: AuraDifficulty;
      moment_visibility: MomentVisibility;
      friendship_status: FriendshipStatus;
      notification_type: NotificationType;
    };
  };
}
