"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass, Lightning, Fire, UserPlus, Check } from "@phosphor-icons/react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { formatAura } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

function FriendCard({ friend, isSuggested = false }: { friend: User; isSuggested?: boolean }) {
  const qc = useQueryClient();
  const [added, setAdded] = useState(false);

  const addMutation = useMutation({
    mutationFn: () => mockApi.sendFriendRequest(friend.id),
    onSuccess: () => setAdded(true),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 py-3 border-b border-border/40"
    >
      <Link href={`/profile/${friend.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {friend.avatarUrl ? (
            <Image src={friend.avatarUrl} alt={friend.displayName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold">
              {friend.displayName[0]}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{friend.displayName}</p>
          <p className="text-xs text-muted-foreground">{friend.username}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Lightning size={10} weight="fill" className="text-primary" />
              {formatAura(friend.auraScore)}
            </span>
            <span className="flex items-center gap-0.5">
              <Fire size={10} className="text-orange-400" />
              {friend.streakCurrent}d
            </span>
          </div>
        </div>
      </Link>

      {isSuggested && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addMutation.mutate()}
          disabled={added || addMutation.isPending}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tap-target transition-colors",
            added
              ? "bg-primary/10 text-primary"
              : "bg-primary text-primary-foreground"
          )}
        >
          {added ? <><Check size={12} weight="bold" />Added</> : <><UserPlus size={12} />Add</>}
        </motion.button>
      )}
    </motion.div>
  );
}

export default function FriendsPage() {
  const { currentUser } = useAuraStore();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", currentUser.id],
    queryFn: mockApi.getFriends,
  });

  const { data: suggested } = useQuery({
    queryKey: ["suggested-users"],
    queryFn: mockApi.getSuggestedUsers,
  });

  const filteredFriends = friends?.filter(
    (f) =>
      f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3">
        <h1 className="text-xl font-black aura-gradient-text mb-2">Friends</h1>
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </header>

      <div className="px-4">
        {/* Friends list */}
        <div className="py-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Your friends ({filteredFriends?.length ?? 0})
          </h2>
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl animate-shimmer" />)}
            </div>
          )}
          {filteredFriends?.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
          {!isLoading && filteredFriends?.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">No friends found.</p>
          )}
        </div>

        {/* Suggested */}
        {!searchQuery && suggested && suggested.length > 0 && (
          <div className="py-4 border-t border-border/40">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Suggested
            </h2>
            {suggested.map((user) => (
              <FriendCard key={user.id} friend={user} isSuggested />
            ))}
          </div>
        )}

        {/* Leaderboard shortcut */}
        <div className="py-4 border-t border-border/40">
          <Link href="/leaderboard">
            <div className="bg-card rounded-2xl p-4 border border-border/50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Friend leaderboard</p>
                <p className="text-xs text-muted-foreground">#3 this week</p>
              </div>
              <Lightning size={20} weight="fill" className="text-primary" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
