"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lightning, Trophy, Clock, Scroll, Star } from "@phosphor-icons/react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { AuraScoreHero } from "@/components/aura/aura-score";
import { AuraOpportunityCard } from "@/components/aura/aura-opportunity-card";
import { getNextLevel } from "@/lib/constants/aura";
import { formatStreak } from "@/lib/utils/format";

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function AuraHubPage() {
  const { currentUser, auraScore, streakCurrent } = useAuraStore();

  const { data: summary, isLoading } = useQuery({
    queryKey: ["aura-summary", currentUser.id],
    queryFn: () => mockApi.getAuraSummary(currentUser.id),
  });

  const { data: opportunity } = useQuery({
    queryKey: ["opportunity", currentUser.id],
    queryFn: () => mockApi.getOpportunity(currentUser.id),
  });

  const level = summary?.level ?? currentUser.auraLevel;
  const nextLevel = summary ? summary.nextLevel : getNextLevel(level);
  const auraToNext = nextLevel ? nextLevel.minAura - (summary?.score ?? auraScore) : 0;

  const weekDays = Array.from({ length: 7 }, (_, i) => i < streakCurrent % 7 + 1);

  const QUICK_LINKS = [
    { href: "/challenges", icon: Trophy, label: "Challenges", desc: "10 active" },
    { href: "/leaderboard", icon: Star, label: "Leaderboards", desc: `#3 friends` },
    { href: "/aura/history", icon: Scroll, label: "Aura History", desc: `${summary?.weeklyGain ?? 0}+ this week` },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3">
        <h1 className="text-xl font-black aura-gradient-text">Aura Hub</h1>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Hero Score */}
        <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
          {isLoading ? (
            <div className="h-48 animate-shimmer rounded-2xl" />
          ) : (
            <AuraScoreHero
              score={summary?.score ?? auraScore}
              levelName={`Level ${level.level} — ${level.name}`}
              levelColor={level.color}
              weeklyGain={summary?.weeklyGain ?? currentUser.weeklyAuraGain}
              progressToNext={summary?.progressToNextLevel ?? 60}
              nextLevelName={nextLevel?.name}
              auraToNext={auraToNext > 0 ? auraToNext : undefined}
            />
          )}
        </div>

        {/* Streak */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightning size={20} weight="fill" className="text-primary" />
              <h2 className="font-semibold">{formatStreak(streakCurrent)} Aura streak</h2>
            </div>
            <span className="text-xs text-muted-foreground">Next milestone: {
              [3, 7, 14, 21, 30].find((m) => m > streakCurrent) ?? 30
            } days</span>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {WEEK_DAYS.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    weekDays[i]
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {weekDays[i] ? "✓" : day}
                </div>
                <span className="text-[10px] text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {streakCurrent > 0
              ? "Do one good thing today to keep it alive."
              : "Start your streak with one good action."}
          </p>
        </div>

        {/* Daily Opportunity */}
        {opportunity && (
          <div>
            <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Today&apos;s Aura Opportunity</h2>
            <AuraOpportunityCard opportunity={opportunity} userId={currentUser.id} />
          </div>
        )}

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Explore</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-card rounded-2xl p-4 border border-border/50 flex flex-col items-center gap-2 text-center hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={20} weight="fill" className="text-primary" />
                  </div>
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[10px] text-muted-foreground">{desc}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Rankings */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <h2 className="font-semibold mb-3">Your rankings</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Among friends</span>
              <span className="text-sm font-bold text-primary">#3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">In {currentUser.city}</span>
              <span className="text-sm font-bold">Top 8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">In {currentUser.country}</span>
              <span className="text-sm font-bold">Top 14%</span>
            </div>
          </div>
          <Link href="/leaderboard" className="block mt-4 text-sm text-primary font-semibold">
            View full leaderboards →
          </Link>
        </div>
      </div>
    </div>
  );
}
