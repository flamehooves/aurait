import type { AuraLevel, AuraCard } from "@/types";

export const AURA_ECONOMY = {
  MOMENT_POSTED: 20,
  UNIQUE_FRIEND_AURA_MIN: 10,
  UNIQUE_FRIEND_AURA_MAX: 30,
  POSITIVE_COMMENT_MIN: 5,
  POSITIVE_COMMENT_MAX: 20,
  STREAK_BONUS_3: 50,
  STREAK_BONUS_7: 150,
  STREAK_BONUS_14: 400,
  LEVEL_MILESTONE: 100,
  DAILY_OPPORTUNITY: 30,
  NEGATIVE_COMMENT_MIN: -10,
  NEGATIVE_COMMENT_MAX: -50,
  CHALLENGE_EASY_MIN: 40,
  CHALLENGE_EASY_MAX: 70,
  CHALLENGE_MEDIUM_MIN: 120,
  CHALLENGE_MEDIUM_MAX: 300,
  CHALLENGE_HARD: 800,
  CHALLENGE_LEGENDARY: 2500,
  MAX_DAILY_AURA: 500,
  DAILY_AURA_LIMIT_PER_USER: 1,
} as const;

export const AURA_LEVELS: AuraLevel[] = [
  { level: 1, name: "Spark", minAura: 0, maxAura: 999, color: "#F97316" },
  { level: 2, name: "Flicker", minAura: 1000, maxAura: 2999, color: "#FBBF24" },
  { level: 3, name: "Glow", minAura: 3000, maxAura: 5999, color: "#FCD34D" },
  { level: 4, name: "Bright", minAura: 6000, maxAura: 9999, color: "#A3E635" },
  { level: 5, name: "Shining", minAura: 10000, maxAura: 14999, color: "#34D399" },
  { level: 6, name: "Luminous", minAura: 15000, maxAura: 19999, color: "#22D3EE" },
  { level: 7, name: "Glowing", minAura: 20000, maxAura: 29999, color: "#818CF8" },
  { level: 8, name: "Radiant", minAura: 30000, maxAura: 49999, color: "#C084FC" },
  { level: 9, name: "Magnetic", minAura: 50000, maxAura: 99999, color: "#F472B6" },
  { level: 10, name: "Aura Legend", minAura: 100000, maxAura: Infinity, color: "#FFD700" },
];

export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 100];

export const AURA_CARDS: AuraCard[] = [
  { id: "1", text: "This is my kind of day", variant: "minimal" },
  { id: "2", text: "+Aura kind of day", variant: "bold" },
  { id: "3", text: "Aura gained", variant: "gradient" },
  { id: "4", text: "Tiny deed. Big Aura.", variant: "contrast" },
  { id: "5", text: "Quiet Aura hits different", variant: "soft" },
  { id: "6", text: "Did it for the Aura", variant: "playful" },
  { id: "7", text: "Aura farming IRL", variant: "dark" },
  { id: "8", text: "Today's Aura moment", variant: "clean" },
  { id: "9", text: "Good energy only", variant: "warm" },
  { id: "10", text: "Main character Aura", variant: "premium" },
];

export function getAuraLevel(score: number): AuraLevel {
  return AURA_LEVELS.find((l) => score >= l.minAura && score <= l.maxAura) ?? AURA_LEVELS[0];
}

export function getNextLevel(currentLevel: AuraLevel): AuraLevel | null {
  const next = AURA_LEVELS.find((l) => l.level === currentLevel.level + 1);
  return next ?? null;
}

export function getLevelProgress(score: number, level: AuraLevel): number {
  if (level.maxAura === Infinity) return 100;
  const range = level.maxAura - level.minAura;
  const progress = score - level.minAura;
  return Math.min(100, Math.round((progress / range) * 100));
}
