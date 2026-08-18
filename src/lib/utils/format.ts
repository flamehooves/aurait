export function formatAura(score: number): string {
  if (score >= 1_000_000) return `${(score / 1_000_000).toFixed(1)}M`;
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
  return score.toString();
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function formatAuraDelta(amount: number): string {
  return amount >= 0 ? `+${amount}` : `${amount}`;
}

export function formatStreak(days: number): string {
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function formatRank(rank: number): string {
  const suffix = rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th";
  return `#${rank}`;
}

export function formatPercentile(pct: number): string {
  return `Top ${pct}%`;
}
