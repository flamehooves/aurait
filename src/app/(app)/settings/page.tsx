"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Desktop, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    publicProfile: true,
    leaderboard: true,
    locationLeaderboard: false,
    streakReminders: true,
    challengeReminders: true,
    milestoneNotifs: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link href="/profile" className="tap-target">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold">Settings</h1>
      </header>

      <div className="px-4 py-4 space-y-8">
        {/* Appearance */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Appearance</h2>
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <p className="text-sm font-medium mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon },
                { id: "system", label: "System", icon: Desktop },
              ].map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors",
                    theme === id ? "bg-primary/10 border-primary/30 text-primary" : "border-border/50 text-muted-foreground"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Privacy</h2>
          <div className="bg-card rounded-2xl border border-border/50 px-4">
            <SettingRow label="Public profile" description="Let anyone view your profile">
              <Switch checked={settings.publicProfile} onCheckedChange={() => toggle("publicProfile")} />
            </SettingRow>
            <SettingRow label="Leaderboard participation" description="Appear in global leaderboards">
              <Switch checked={settings.leaderboard} onCheckedChange={() => toggle("leaderboard")} />
            </SettingRow>
            <SettingRow label="Location leaderboards" description="Opt into nearby and city rankings">
              <Switch checked={settings.locationLeaderboard} onCheckedChange={() => toggle("locationLeaderboard")} />
            </SettingRow>
          </div>
        </section>

        {/* Aura notifications */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Aura</h2>
          <div className="bg-card rounded-2xl border border-border/50 px-4">
            <SettingRow label="Streak reminders" description="Get nudged to keep your streak alive">
              <Switch checked={settings.streakReminders} onCheckedChange={() => toggle("streakReminders")} />
            </SettingRow>
            <SettingRow label="Challenge reminders" description="Updates on your active challenges">
              <Switch checked={settings.challengeReminders} onCheckedChange={() => toggle("challengeReminders")} />
            </SettingRow>
            <SettingRow label="Milestone notifications" description="Celebrate new levels and streaks">
              <Switch checked={settings.milestoneNotifs} onCheckedChange={() => toggle("milestoneNotifs")} />
            </SettingRow>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account</h2>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/40">
            {["Edit profile", "Change username", "Update bio"].map((item) => (
              <button key={item} className="w-full text-left px-4 py-3 text-sm hover:bg-muted/50 transition-colors">
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Safety */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Safety</h2>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/40">
            {["Muted users", "Blocked users", "Report history"].map((item) => (
              <button key={item} className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                {item}
              </button>
            ))}
          </div>
        </section>

        <p className="text-xs text-muted-foreground text-center pb-4">AuraIT — Demo experience</p>
      </div>
    </div>
  );
}
