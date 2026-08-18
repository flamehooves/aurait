"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Comment } from "@/types";
import { PaperPlaneTilt } from "@phosphor-icons/react";

type Props = {
  momentId: string;
  open: boolean;
  onClose: () => void;
};

export function CommentSheet({ momentId, open, onClose }: Props) {
  const { currentUser } = useAuraStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    mockApi.getComments(momentId).then((c) => {
      setComments(c);
      setLoading(false);
    });
  }, [momentId, open]);

  const handlePost = async () => {
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      const comment = await mockApi.postComment(momentId, currentUser.id, text.trim());
      setComments((prev) => [...prev, comment]);
      setText("");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-shimmer h-12 rounded-xl" />
              ))}
            </div>
          )}
          {!loading && comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No comments yet. Be the first.
            </div>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {comment.author.avatarUrl ? (
                  <Image src={comment.author.avatarUrl} alt={comment.author.displayName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                    {comment.author.displayName[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{comment.author.displayName}</span>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm mt-0.5">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {currentUser.avatarUrl && (
              <Image src={currentUser.avatarUrl} alt={currentUser.displayName} fill className="object-cover" />
            )}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePost()}
              placeholder="Add a comment..."
              className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handlePost}
              disabled={!text.trim() || posting}
              className="text-primary disabled:text-muted-foreground transition-colors tap-target"
              aria-label="Post comment"
            >
              <PaperPlaneTilt size={20} weight="fill" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
