"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Users,
  Plus,
  Lightning,
  User,
  Bell,
  Gear,
  Play,
  ShieldCheck,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuraStore } from "@/stores/aura-store";
import { formatAura } from "@/lib/utils/format";

const NAV_ITEMS = [
  { href: "/feed", icon: House, label: "Home" },
  { href: "/friends", icon: Users, label: "Friends" },
  { href: "/aurabites", icon: Play, label: "AuraBites" },
  { href: "/create", icon: Plus, label: "Create", isCreate: true },
  { href: "/aura", icon: Lightning, label: "Aura" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/moderation", icon: ShieldCheck, label: "Moderation" },
  { href: "/settings", icon: Gear, label: "Settings" },
];

export function DesktopNavRail() {
  const pathname = usePathname();
  const { auraScore } = useAuraStore();

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 border-r border-border/50 flex-col z-40 bg-card/80 backdrop-blur-xl">
      <div className="p-6 border-b border-border/50">
        <Link href="/feed">
          <h1 className="text-2xl font-black aura-gradient-text tracking-tight">AuraIT</h1>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">{formatAura(auraScore)} Aura</p>
      </div>

      <div className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label, isCreate }) => {
          const isActive = pathname.startsWith(href);

          if (isCreate) {
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl",
                    "bg-primary text-primary-foreground font-semibold",
                    "aura-glow-sm transition-all"
                  )}
                >
                  <Icon size={20} weight="bold" />
                  <span>{label}</span>
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                <span className="text-sm">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
