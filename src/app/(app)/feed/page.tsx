"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Lightning, ArrowsClockwise } from "@phosphor-icons/react";
import Link from "next/link";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { AuraMomentCard } from "@/components/feed/aura-moment-card";
import { AuraOpportunityCard } from "@/components/aura/aura-opportunity-card";
import { FeedSkeleton } from "@/components/states/feed-skeleton";
import { EmptyState, ErrorState } from "@/components/states/empty-state";
import { formatAura } from "@/lib/utils/format";

export default function FeedPage() {
  const { currentUser, auraScore, streakCurrent } = useAuraStore();

  const {
    data: moments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["feed", currentUser.id],
    queryFn: () => mockApi.getFeed(currentUser.id),
  });

  const { data: opportunity } = useQuery({
    queryKey: ["opportunity", currentUser.id],
    queryFn: () => mockApi.getOpportunity(currentUser.id),
  });

  const { data: notifs } = useQuery({
    queryKey: ["notifications", currentUser.id],
    queryFn: () => mockApi.getNotifications(currentUser.id),
  });

  const unreadCount = notifs?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black aura-gradient-text">AuraIT</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Lightning size={14} weight="fill" className="text-primary" />
              <span>{formatAura(auraScore)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{streakCurrent}d streak</p>
          </div>
          <Link href="/notifications" className="relative tap-target flex items-center">
            <Bell size={22} className="text-muted-foreground hover:text-foreground transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Daily Opportunity */}
        {opportunity && <AuraOpportunityCard opportunity={opportunity} userId={currentUser.id} />}

        {/* Feed */}
        {isLoading && <FeedSkeleton />}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && moments?.length === 0 && (
          <EmptyState
            title="Your feed is quiet"
            description="Add a few friends and their Aura moments will show up here."
            ctaLabel="Find friends"
            ctaHref="/friends"
          />
        )}

        {!isLoading && !isError && (
          <div className="space-y-4">
            <AnimatePresence>
              {moments?.map((moment, i) => (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <AuraMomentCard moment={moment} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pull to refresh hint */}
        {moments && moments.length > 0 && (
          <button
            onClick={() => refetch()}
            className="w-full flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowsClockwise size={14} />
            Refresh feed
          </button>
        )}
      </div>
    </div>
  );
}
