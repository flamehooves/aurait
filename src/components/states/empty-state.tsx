import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
  className?: string;
};

export function EmptyState({ icon, title, description, ctaLabel, ctaHref, onCta, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6 gap-3", className)}>
      {icon && <div className="text-muted-foreground/50 mb-2">{icon}</div>}
      <h3 className="font-semibold text-base">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xs">{description}</p>}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          {ctaLabel}
        </Link>
      )}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="text-4xl">⚡</div>
      <h3 className="font-semibold">Something went wrong</h3>
      <p className="text-sm text-muted-foreground">Couldn&apos;t load your friends&apos; Aura moments.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
