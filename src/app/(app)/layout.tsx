import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { DesktopNavRail } from "@/components/navigation/desktop-nav-rail";
import { AuthSync } from "@/components/auth/auth-sync";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AuthSync />
      <DesktopNavRail />
      <main className="md:ml-64 pb-24 md:pb-0">
        <div className="max-w-2xl mx-auto md:max-w-none">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
