"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";

const links = [
  ["workspace", "/workspace", "Workspace"],
  ["history", "/history", "Assessments"],
  ["settings", "/settings", "Settings"],
] as const;

export function AppShell({ active, children }: { active: (typeof links)[number][0]; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="min-h-screen bg-cream font-mono text-ink">
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-[15px] font-semibold"><Image src="/logo.png" alt="QuizAI Studio logo" width={36} height={36} className="rounded-lg object-cover" /><span>QuizAI <span className="text-rust">Studio</span></span></Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Application navigation">{links.map(([id, href, label]) => <Link key={id} href={href} className={`rounded-md px-3 py-2 text-xs transition-colors ${active === id ? "bg-cream-soft font-semibold text-ink" : "text-muted hover:bg-cream-soft hover:text-ink"}`}>{label}</Link>)}</nav>
        <div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs text-muted sm:flex"><i className="h-1.5 w-1.5 rounded-full bg-forest" /> AI Engine Ready</span><button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="grid h-9 w-9 place-items-center rounded-md border border-line text-muted md:hidden"><span className="text-lg">{menuOpen ? "×" : "☰"}</span></button></div>
      </div>
      {menuOpen && <nav className="border-t border-line px-4 py-2 md:hidden" aria-label="Mobile application navigation">{links.map(([id, href, label]) => <Link key={id} href={href} onClick={() => setMenuOpen(false)} className={`block rounded-md px-3 py-3 text-xs ${active === id ? "bg-cream-soft font-semibold" : "text-muted"}`}>{label}</Link>)}</nav>}
    </header>
    <div className="app-shell__content">{children}</div>
  </div>;
}
