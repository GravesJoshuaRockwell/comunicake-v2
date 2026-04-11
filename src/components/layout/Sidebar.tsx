"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, GitBranch, Activity, Settings, Menu, X, UserPlus, Zap, BarChart3, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/recruit", label: "Recruit", icon: UserPlus },
  { href: "/refi-alerts", label: "Refi Alerts", icon: Zap },
  { href: "/refi-ready", label: "Refi Ready", icon: Calculator },
  { href: "/referrals", label: "Referrals", icon: BarChart3 },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover")}>
            <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-text-muted")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
      <span className="text-white font-bold text-sm">C</span>
    </div>
    <div>
      <div className="text-sm font-bold text-text-primary leading-tight">Comunicake</div>
      <div className="text-xs text-text-muted leading-tight">Mortgage CRM v2</div>
    </div>
  </div>
);

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        <Logo />
        <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-border flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-5 border-b border-border"><Logo /></div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <div className="px-5 py-4 border-t border-border">
              <div className="text-xs text-text-muted">Rockwell Mortgage · 2026</div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 bg-white border-r border-border flex-col h-full">
        <div className="px-5 py-5 border-b border-border"><Logo /></div>
        <NavLinks pathname={pathname} />
        <div className="px-5 py-4 border-t border-border">
          <div className="text-xs text-text-muted">Rockwell Mortgage · 2026</div>
        </div>
      </aside>
    </>
  );
}
