"use client";

import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  SpeakerHigh,
  SpeakerSlash,
  ChatCircle,
  Export,
  MapPin,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { AuraButton } from "@/components/aura/aura-button";
import { formatRelativeTime } from "@/lib/utils/format";
import type { AuraMoment } from "@/types";

export default function AuraBitesPage() {
  const { currentUser } = useAuraStore();
  const [muted, setMuted] = useState(true);
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mutedRef = useRef(true);

  const { data: videos, isLoading } = useQuery<AuraMoment[]>({
    queryKey: ["videoFeed"],
    queryFn: () => mockApi.getVideoFeed(),
  });

  // IntersectionObserver: auto-play video in viewport, pause others
  useEffect(() => {
    if (!videos?.length) return;

    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = videoRefs.current[index];
            if (!video) return;

            if (entry.isIntersecting) {
              // Pause all other videos
              videoRefs.current.forEach((v, i) => {
                if (v && i !== index) v.pause();
              });
              video.muted = mutedRef.current;
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.6 }
      );

      observer.observe(item);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [videos]);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    mutedRef.current = newMuted;
    videoRefs.current.forEach((v) => {
      if (v) v.muted = newMuted;
    });
  };

  const toggleCaption = (momentId: string) => {
    setExpandedCaptions((prev) => {
      const next = new Set(prev);
      if (next.has(momentId)) {
        next.delete(momentId);
      } else {
        next.add(momentId);
      }
      return next;
    });
  };

  const handleGiveAura = async (momentId: string) => {
    await mockApi.giveAura(momentId, currentUser.id);
  };

  const handleUndoAura = async (momentId: string) => {
    await mockApi.removeAura(momentId, currentUser.id);
  };

  return (
    <div style={{ position: "relative", height: "100svh", overflow: "hidden" }}>
      {/* Sticky overlay header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 px-4 py-4 pointer-events-auto">
          <Link
            href="/feed"
            className="text-white hover:text-white/80 transition-colors tap-target flex items-center"
            aria-label="Back to feed"
          >
            <ArrowLeft size={22} weight="bold" />
          </Link>
          <h1 className="text-lg font-black aura-gradient-text">AuraBites</h1>
        </div>
      </div>

      {/* Scroll container */}
      <div
        className="h-full overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Loading skeleton */}
        {isLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-black flex items-center justify-center"
                style={{ height: "100svh", scrollSnapAlign: "start" }}
              >
                <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            ))}
          </>
        )}

        {/* Empty state */}
        {!isLoading && (!videos || videos.length === 0) && (
          <div
            className="bg-black flex flex-col items-center justify-center gap-4 text-white"
            style={{ height: "100svh", scrollSnapAlign: "start" }}
          >
            <p className="text-2xl">🎬</p>
            <p className="font-semibold">No public videos yet</p>
            <p className="text-sm text-white/60 text-center px-8">
              Be the first to share an Aura Bites moment.
            </p>
          </div>
        )}

        {/* Video items */}
        {videos?.map((moment, index) => {
          const isCaptionExpanded = expandedCaptions.has(moment.id);
          return (
            <div
              key={moment.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              className="relative bg-black"
              style={{ height: "100svh", scrollSnapAlign: "start" }}
            >
              {/* Video */}
              {moment.mediaUrl && (
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={moment.mediaUrl}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

              {/* Mute toggle — top right */}
              <button
                onClick={toggleMute}
                className="absolute top-16 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors tap-target"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <SpeakerSlash size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
              </button>

              {/* Bottom layout: author/caption (left) + actions (right) */}
              <div className="absolute bottom-24 left-0 right-0 z-10 flex items-end gap-4 px-4">
                {/* Left: author + caption */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/80 flex-shrink-0">
                      {moment.author.avatarUrl ? (
                        <Image
                          src={moment.author.avatarUrl}
                          alt={moment.author.displayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {moment.author.displayName[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm leading-none">
                        {moment.author.displayName}
                      </p>
                      <p className="text-white/60 text-xs mt-0.5">
                        {formatRelativeTime(moment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Caption */}
                  <button
                    onClick={() => toggleCaption(moment.id)}
                    className="text-left"
                  >
                    <p
                      className={
                        isCaptionExpanded
                          ? "text-white text-sm leading-relaxed"
                          : "text-white text-sm leading-relaxed line-clamp-2"
                      }
                    >
                      {moment.caption}
                    </p>
                    {!isCaptionExpanded && moment.caption.length > 80 && (
                      <span className="text-white/60 text-xs">more</span>
                    )}
                  </button>

                  {/* Location */}
                  {moment.location && (
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                      <MapPin size={11} />
                      <span>{moment.location}</span>
                    </div>
                  )}
                </div>

                {/* Right: action bar */}
                <div className="flex flex-col items-center gap-5 pb-1 flex-shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <AuraButton
                      auraCount={moment.auraCount}
                      hasGiven={moment.hasGivenAura}
                      onGive={() => handleGiveAura(moment.id)}
                      onUndo={() => handleUndoAura(moment.id)}
                      size="sm"
                    />
                  </div>

                  <button
                    className="flex flex-col items-center gap-1 text-white tap-target"
                    aria-label="Comments"
                  >
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <ChatCircle size={20} weight="fill" />
                    </div>
                    <span className="text-xs font-medium text-white/80">
                      {moment.commentCount}
                    </span>
                  </button>

                  <button
                    className="flex flex-col items-center gap-1 text-white tap-target"
                    aria-label="Share"
                  >
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <Export size={20} weight="fill" />
                    </div>
                    <span className="text-xs font-medium text-white/80">Share</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
