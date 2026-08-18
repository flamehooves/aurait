"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Lightning, Plus, Minus } from "@phosphor-icons/react";
import Link from "next/link";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { useUIStore } from "@/stores/ui-store";
import { formatRelativeTime, formatAuraDelta } from "@/lib/utils/format";
import { EmptyState } from "@/components/states/empty-state";
import { cn } from "@/lib/utils";
import type { AuraLedgerReason } from "@/types";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "moments", label: "Moments" },
  { id: "streaks", label: "Streaks" },
  { id: "challenges", label: "Challenges" },
  { id: "community", label: "Community" },
  { id: "adjustments", label: "Adjustments" },
];

const REASON_LABELS: Record<AuraLedgerReason, string> = {
  moment_posted: "Posted an Aura moment",
  aura_received: "Aura from a friend",
  positive_comment: "Positive comment",
  streak_bonus_3: "3-day streak bonus",
  streak_bonus_7: "7-day streak bonus",
  streak_bonus_14: "14-day streak bonus",
  challenge_completed: "Challenge completed",
  level_milestone: "Level milestone reached",
  daily_opportunity: "Daily opportunity completed",
  negative_comment: "Comment removed",
  spam_penalty: "Spam penalty",
  moderation_penalty: "Moderation penalty",
  reciprocal_abuse: "Aura farming flagged",
  challenge_abuse: "Challenge abuse detected",
};

const REASON_TO_FILTER: Record<AuraLedgerReason, string> = {
  moment_posted: "moments",
  aura_received: "community",
  positive_comment: "community",
  streak_bonus_3: "streaks",
  streak_bonus_7: "streaks",
  streak_bonus_14: "streaks",
  challenge_completed: "challenges",
  level_milestone: "moments",
  daily_opportunity: "moments",
  negative_comment: "adjustments",
  spam_penalty: "adjustments",
  moderation_penalty: "adjustments",
  reciprocal_abuse: "adjustments",
  challenge_abuse: "adjustments",
};

export default function AuraHistoryPage() {
  const { currentUser } = useAuraStore();
  const { activeHistoryFilter, setHistoryFilter } = useUIStore();

  const { data: history, isLoading } = useQuery({
    queryKey: ["aura-history", currentUser.id],
    queryFn: () => mockApi.getAuraHistory(currentUser.id),
  });

  const filtered = history?.filter((entry) => {
    if (activeHistoryFilter === "all") return true;
    return REASON_TO_FILTER[entry.reason] === activeHistoryFilter;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link href="/aura" className="tap-target">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold">Aura History</h1>
      </header>

      {/* Filter tabs */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setHistoryFilter(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap tap-target",
                activeHistoryFilter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 space-y-1">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-xl animate-shimmer" />
            ))}
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <EmptyState
            title="Your Aura story starts with your first moment."
            ctaLabel="Share a moment"
            ctaHref="/create"
          />
        )}

        {filtered?.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 py-3 border-b border-border/40"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                entry.amount >= 0 ? "bg-primary/10" : "bg-destructive/10"
              )}
            >
              {entry.amount >= 0 ? (
                <Plus size={16} className="text-primary" />
              ) : (
                <Minus size={16} className="text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{REASON_LABELS[entry.reason]}</p>
              <p className="text-xs text-muted-foreground truncate">{entry.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span
                className={cn(
                  "text-sm font-bold",
                  entry.amount >= 0 ? "text-primary" : "text-destructive"
                )}
              >
                {formatAuraDelta(entry.amount)}
              </span>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(entry.createdAt)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
