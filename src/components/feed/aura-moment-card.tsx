"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DotsThree,
  ChatCircle,
  Share,
  MapPin,
  Lock,
  Globe,
  Users,
  UserCircle,
  LinkSimple,
  Flag,
} from "@phosphor-icons/react";
import type { AuraMoment } from "@/types";
import { AuraButton } from "@/components/aura/aura-button";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { AURA_CARDS } from "@/lib/constants/aura";
import { CommentSheet } from "./comment-sheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

const REPORT_REASONS = [
  "Spam or misleading",
  "Inappropriate content",
  "Harassment",
  "Misinformation",
];

export function AuraMomentCard({ moment }: Props) {
  const { currentUser } = useAuraStore();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const auraCard = moment.auraCardId ? AURA_CARDS.find((c) => c.id === moment.auraCardId) : null;
  const VisibilityIcon = VISIBILITY_ICONS[moment.visibility];

  const handleGiveAura = async () => {
    await mockApi.giveAura(moment.id, currentUser.id);
  };

  const handleUndoAura = async () => {
    await mockApi.removeAura(moment.id, currentUser.id);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/moment/${moment.id}`).catch(() => {});
    setMenuOpen(false);
  };

  const handleShare = () => {
    setMenuOpen(false);
  };

  const handleOpenReport = () => {
    setMenuOpen(false);
    setSelectedReason(null);
    setReportOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!selectedReason || submitting) return;
    setSubmitting(true);
    try {
      await mockApi.reportMoment(moment.id, currentUser.id, selectedReason);
      setReportOpen(false);
      setSelectedReason(null);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/20"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
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

          {/* DotsThree menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 tap-target"
              aria-label="More options"
            >
              <DotsThree size={20} weight="bold" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 z-20 bg-popover border border-border rounded-xl shadow-lg min-w-[160px] py-1 overflow-hidden"
                >
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <LinkSimple size={15} />
                    Copy link
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <Share size={15} />
                    Share
                  </button>
                  <div className="h-px bg-border/60 mx-2 my-0.5" />
                  <button
                    onClick={handleOpenReport}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left text-destructive"
                  >
                    <Flag size={15} />
                    Report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Caption */}
        <div className="px-4 pb-3">
          <p className="text-sm leading-relaxed">{moment.caption}</p>
        </div>

        {/* Media + Aura Card overlay */}
        {moment.mediaUrl && (
          <div className="relative mb-3 overflow-hidden aspect-[4/3] bg-muted">
            {moment.mediaType === "video" ? (
              <video
                src={moment.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={moment.mediaUrl}
                alt="Aura moment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            )}
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
        <div className="flex items-center gap-3 px-4 py-3">
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

      {/* Report Sheet */}
      <Sheet open={reportOpen} onOpenChange={(o) => !o && setReportOpen(false)}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="pb-2">
            <SheetTitle>Report this moment</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-2 space-y-2">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm border transition-colors",
                  selectedReason === reason
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border/60 hover:bg-muted text-foreground"
                )}
              >
                {reason}
              </button>
            ))}
          </div>
          <div className="px-4 pb-6 pt-2">
            <button
              onClick={handleSubmitReport}
              disabled={!selectedReason || submitting}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-semibold transition-colors",
                selectedReason && !submitting
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {submitting ? "Submitting…" : "Submit report"}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Comment sheet */}
      <CommentSheet
        momentId={moment.id}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-5 py-2.5 rounded-2xl text-sm font-medium shadow-lg whitespace-nowrap pointer-events-none"
          >
            Report submitted
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
