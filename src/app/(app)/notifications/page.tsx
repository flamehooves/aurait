"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Bell, Lightning, Trophy, UserPlus, ArrowUp, Fire } from "@phosphor-icons/react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const NOTIF_ICONS: Record<NotificationType, React.ReactNode> = {
  aura_received: <Lightning size={16} weight="fill" className="text-primary" />,
  comment_received: <Bell size={16} className="text-blue-500" />,
  challenge_completed_friend: <Trophy size={16} weight="fill" className="text-amber-500" />,
  leaderboard_moved: <ArrowUp size={16} weight="bold" className="text-emerald-500" />,
  streak_reminder: <Fire size={16} weight="fill" className="text-orange-500" />,
  level_reached: <Lightning size={16} weight="fill" className="text-violet-500" />,
  challenge_milestone: <Trophy size={16} className="text-amber-500" />,
  friend_request: <UserPlus size={16} className="text-primary" />,
  friend_accepted: <UserPlus size={16} weight="fill" className="text-emerald-500" />,
  aura_adjustment: <Lightning size={16} className="text-red-500" />,
};

export default function NotificationsPage() {
  const { currentUser } = useAuraStore();
  const qc = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", currentUser.id],
    queryFn: () => mockApi.getNotifications(currentUser.id),
  });

  const markReadMutation = useMutation({
    mutationFn: (ids: string[]) => mockApi.markNotificationsRead(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unread = notifications?.filter((n) => !n.isRead) ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Notifications</h1>
        {unread.length > 0 && (
          <button
            onClick={() => markReadMutation.mutate(unread.map((n) => n.id))}
            className="text-xs text-primary font-medium tap-target"
          >
            Mark all read
          </button>
        )}
      </header>

      <div className="px-4 py-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl animate-shimmer" />
            ))}
          </div>
        )}

        {!isLoading && notifications?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">All caught up.</p>
          </div>
        )}

        <div className="space-y-1">
          {notifications?.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-colors",
                !notif.isRead ? "bg-primary/5 border border-primary/10" : "hover:bg-muted/50"
              )}
            >
              {notif.fromUser ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {notif.fromUser.avatarUrl ? (
                    <Image src={notif.fromUser.avatarUrl} alt={notif.fromUser.displayName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                      {notif.fromUser.displayName[0]}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-card rounded-full flex items-center justify-center border border-border">
                    {NOTIF_ICONS[notif.type]}
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {NOTIF_ICONS[notif.type]}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{formatRelativeTime(notif.createdAt)}</span>
                {!notif.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
