"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DotsThree, ChatCircle, Share, MapPin, Lock, Globe, Users, UserCircle } from "@phosphor-icons/react";
import type { AuraMoment } from "@/types";
import { AuraButton } from "@/components/aura/aura-button";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { AURA_CARDS } from "@/lib/constants/aura";
import { CommentSheet } from "./comment-sheet";

type Props = { moment: AuraMoment };

const VISIBILITY_ICONS = {
  friends: Users,
  close_friends: UserCircle,
  public: Globe,
  only_me: Lock,
};

const VISIBILITY_LABELS = {
  friends: "Friends",
  close_friends: "Close Friends",
  public: "Public",
  only_me: "Only Me",
};

const CARD_STYLES: Record<string, string> = {
  minimal: "bg-black/70 text-white font-light italic",
  bold: "bg-primary text-primary-foreground font-black uppercase tracking-wider",
  gradient: "bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-semibold",
  contrast: "bg-white text-black font-black text-lg",
  soft: "bg-white/80 text-gray-800 font-medium italic backdrop-blur-sm",
  playful: "bg-yellow-400 text-yellow-900 font-bold",
  dark: "bg-gray-900 text-white font-semibold border border-white/20",
  clean: "bg-white/90 text-gray-900 font-medium backdrop-blur-sm",
  warm: "bg-amber-500 text-white font-semibold",
  premium: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-black",
};

export function AuraMomentCard({ moment }: Props) {
  const { currentUser } = useAuraStore();
  const [commentsOpen, setCommentsOpen] = useState(false);

  const auraCard = moment.auraCardId ? AURA_CARDS.find((c) => c.id === moment.auraCardId) : null;
  const VisibilityIcon = VISIBILITY_ICONS[moment.visibility];

  const handleGiveAura = async () => {
    await mockApi.giveAura(moment.id, currentUser.id);
  };

  const handleUndoAura = async () => {
    await mockApi.removeAura(moment.id, currentUser.id);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
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
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm truncate">{moment.author.displayName}</span>
              {moment.challengeTitle && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {moment.challengeTitle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <span>{moment.author.username}</span>
              <span>·</span>
              <span>{formatRelativeTime(moment.createdAt)}</span>
              {moment.location && (
                <>
                  <span>·</span>
                  <MapPin size={10} />
                  <span>{moment.location}</span>
                </>
              )}
              <span>·</span>
              <VisibilityIcon size={10} />
              <span>{VISIBILITY_LABELS[moment.visibility]}</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1 tap-target">
            <DotsThree size={20} />
          </button>
        </div>

        {/* Caption */}
        <div className="px-4 pb-3">
          <p className="text-sm leading-relaxed">{moment.caption}</p>
        </div>

        {/* Media + Aura Card */}
        {moment.mediaUrl && (
          <div className="relative mx-4 mb-3 rounded-xl overflow-hidden aspect-[4/3] bg-muted">
            <Image
              src={moment.mediaUrl}
              alt="Aura moment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {auraCard && (
              <div
                className={cn(
                  "absolute bottom-3 left-3 right-3 py-2 px-3 rounded-lg text-sm text-center",
                  CARD_STYLES[auraCard.variant] ?? CARD_STYLES.clean
                )}
              >
                {moment.auraCardText ?? auraCard.text}
              </div>
            )}
          </div>
        )}

        {/* Text-only Aura Card */}
        {!moment.mediaUrl && auraCard && (
          <div className="mx-4 mb-3">
            <div
              className={cn(
                "py-3 px-4 rounded-xl text-sm text-center",
                CARD_STYLES[auraCard.variant] ?? CARD_STYLES.clean
              )}
            >
              {moment.auraCardText ?? auraCard.text}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-border/40">
          <AuraButton
            auraCount={moment.auraCount}
            hasGiven={moment.hasGivenAura}
            onGive={handleGiveAura}
            onUndo={handleUndoAura}
          />

          <button
            onClick={() => setCommentsOpen(true)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm tap-target"
            aria-label="Comments"
          >
            <ChatCircle size={18} />
            <span>{moment.commentCount}</span>
          </button>

          <button
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 tap-target"
            aria-label="Share"
          >
            <Share size={18} />
          </button>
        </div>
      </motion.article>

      <CommentSheet
        momentId={moment.id}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </>
  );
}
