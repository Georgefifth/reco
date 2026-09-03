"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Home, ClipboardList, BookHeart, ListChecks, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/checkin", label: "Check-in", icon: ClipboardList },
  { href: "/journal", label: "Journal", icon: BookHeart },
  { href: "/protocol", label: "Protocol", icon: ListChecks },
  { href: "/privacy", label: "Privacy", icon: Shield },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-surface)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center gap-1 px-4 py-3">
        <Link href="/" className="mr-2 flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-brand)] text-white">
            <Brain size={18} />
          </span>
          <span className="hidden sm:inline">ReCo</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-brand-soft)]/60 hover:text-[var(--color-ink)]",
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
