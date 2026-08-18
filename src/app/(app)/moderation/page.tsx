"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  Trash,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { mockApi } from "@/lib/mock-api";
import { formatRelativeTime } from "@/lib/utils/format";

export default function ModerationPage() {
  const queryClient = useQueryClient();

  const { data: queue, isLoading } = useQuery({
    queryKey: ["moderation"],
    queryFn: () => mockApi.getModerationQueue(),
    refetchInterval: 5000,
  });

  const handleAction = async (momentId: string, action: "restore" | "remove") => {
    await mockApi.moderateContent(momentId, action);
    void queryClient.invalidateQueries({ queryKey: ["moderation"] });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link
          href="/feed"
          className="text-muted-foreground hover:text-foreground transition-colors tap-target flex items-center"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-base flex-1">Moderation Queue</h1>
        {queue && queue.length > 0 && (
          <span className="bg-destructive/10 text-destructive text-xs px-2.5 py-1 rounded-full font-semibold">
            {queue.length} item{queue.length !== 1 ? "s" : ""}
          </span>
        )}
      </header>

      <div className="px-4 py-4">
        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!queue || queue.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <ShieldCheck size={52} weight="duotone" className="text-primary/40" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Queue is clear</p>
              <p className="text-sm mt-1">No moments are currently under moderation.</p>
            </div>
          </div>
        )}

        {/* Moderation items */}
        <AnimatePresence>
          {queue?.map((moment) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="border border-border rounded-2xl p-4 mb-3 bg-card"
            >
              {/* Author row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {moment.author.avatarUrl ? (
                    <Image
                      src={moment.author.avatarUrl}
                      alt={moment.author.displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {moment.author.displayName[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{moment.author.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {moment.author.username} · {formatRelativeTime(moment.createdAt)}
                  </p>
                </div>
                {/* Report count badge */}
                <span className="flex-shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-500/20">
                  {moment.reportCount ?? 2}+ reports
                </span>
              </div>

              {/* Caption preview */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {moment.caption}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(moment.id, "restore")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors"
                >
                  <Check size={16} weight="bold" />
                  Restore
                </button>
                <button
                  onClick={() => handleAction(moment.id, "remove")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors"
                >
                  <Trash size={16} weight="bold" />
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
