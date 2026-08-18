"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Play, Plus, Lightning, User } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/feed", icon: House, label: "Home" },
  { href: "/aurabites", icon: Play, label: "Bites" },
  { href: "/create", icon: Plus, label: "Create", isCreate: true },
  { href: "/aura", icon: Lightning, label: "Aura" },
  { href: "/profile", icon: User, label: "You" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-lg">
        <div
          className={cn(
            "glass border-t border-border/50 px-2 bottom-nav-safe",
            "dark:border-border/30"
          )}
        >
          <div className="flex items-center justify-around h-16">
            {NAV_ITEMS.map(({ href, icon: Icon, label, isCreate }) => {
              const isActive = pathname.startsWith(href);

              if (isCreate) {
                return (
                  <Link key={href} href={href} className="flex items-center justify-center tap-target">
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-2xl",
                        "bg-primary text-primary-foreground shadow-lg",
                        isActive && "aura-glow-sm"
                      )}
                    >
                      <Icon size={26} weight="bold" />
                    </motion.div>
                  </Link>
                );
              }

              return (
                <Link key={href} href={href} className="flex flex-col items-center gap-0.5 tap-target justify-center">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="relative">
                      <Icon
                        size={24}
                        weight={isActive ? "fill" : "regular"}
                        className={cn(
                          "transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
