"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowsClockwise, Check, Lightning } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuraOpportunity } from "@/types";
import { mockApi } from "@/lib/mock-api";
import { cn } from "@/lib/utils";

type Props = {
  opportunity: AuraOpportunity;
  userId: string;
};

export function AuraOpportunityCard({ opportunity, userId }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const qc = useQueryClient();

  const handleAccept = async () => {
    await mockApi.acceptOpportunity(userId, opportunity.id);
    setAccepted(true);
  };

  const handleSwap = async () => {
    setSwapping(true);
    await mockApi.swapOpportunity(userId);
    await qc.invalidateQueries({ queryKey: ["opportunity"] });
    setSwapping(false);
  };

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={opportunity.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="relative bg-gradient-to-br from-primary/5 to-accent/30 rounded-2xl p-4 border border-primary/10"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightning size={16} weight="fill" className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary">Your Aura move today</p>
              <p className="text-[10px] text-muted-foreground">{opportunity.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {opportunity.isQuietAura && (
              <span className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-medium">
                Quiet Aura
              </span>
            )}
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", difficultyColors[opportunity.difficulty])}>
              {opportunity.difficulty}
            </span>
          </div>
        </div>

        <p className="font-semibold text-sm mb-1">{opportunity.title}</p>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{opportunity.description}</p>

        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <span>~{opportunity.estimatedMinutes} min</span>
          <span>·</span>
          <span className="text-primary font-medium">+{opportunity.auraReward} Aura</span>
        </div>

        {accepted ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Check size={16} weight="bold" />
            You&apos;re in. Go do something good.
          </div>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAccept}
              className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-xl tap-target"
            >
              I&apos;m in
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSwap}
              disabled={swapping}
              className="px-3 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors tap-target"
              aria-label="Show another"
            >
              <ArrowsClockwise size={16} className={swapping ? "animate-spin" : ""} />
            </motion.button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
