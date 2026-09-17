"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { useLocalStorageValue } from "../lib/localStorage";

type Assessment = {
  id: string;
  title?: string;
  subject?: string;
  topic?: string;
  questions?: number | string;
  difficulty?: string;
  fileCount?: number | string;
  status?: string;
  quizUrl?: string | null;
  createdAt: number;
};

type Filter = "all" | "completed" | "processing" | "draft";
type Sort = "newest" | "oldest" | "questions";

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
}

function Icon({ children }: { children: React.ReactNode }) {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

export default function HistoryPage() {
  const historyValue = useLocalStorageValue("quizai_history");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const assessments: Assessment[] = useMemo(() => {
    try { return historyValue ? JSON.parse(historyValue) : []; } catch { return []; }
  }, [historyValue]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assessments.filter((assessment) => {
      const matchesFilter = filter === "all" || (assessment.status || "completed") === filter;
      const matchesSearch = !query || [assessment.title, assessment.topic, assessment.subject].some((value) => value?.toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    }).sort((first, second) => sort === "oldest" ? first.createdAt - second.createdAt : sort === "questions" ? Number(second.questions || 0) - Number(first.questions || 0) : second.createdAt - first.createdAt);
  }, [assessments, filter, search, sort]);

  const totalQuestions = assessments.reduce((sum, item) => sum + Number(item.questions || 0), 0);
  const totalDocuments = assessments.reduce((sum, item) => sum + Number(item.fileCount || 1), 0);
  const thisMonth = assessments.filter((item) => { const date = new Date(item.createdAt); const now = new Date(); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }).length;
  const cycleSort = () => setSort(sort === "newest" ? "oldest" : sort === "oldest" ? "questions" : "newest");
  const sortLabel = { newest: "Newest first", oldest: "Oldest first", questions: "Most questions" }[sort];

  return <AppShell active="history"><div className="mx-auto max-w-6xl px-4 sm:px-6">
    <main className="py-10 sm:py-12"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><h1 className="font-sans text-3xl font-semibold tracking-tight">Assessment History</h1><p className="mt-2 text-sm text-ink-soft">View, manage, and review all previously generated quizzes.</p></div><Link href="/workspace" className="inline-flex items-center justify-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs font-semibold text-cream hover:opacity-90"><Icon><path d="M12 5v14M5 12h14" /></Icon> New Assessment</Link></div>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Total Assessments", assessments.length, "All time"], ["Questions Generated", totalQuestions, "Across all quizzes"], ["Documents Processed", totalDocuments, "Analyzed by AI"], ["This Month", thisMonth, "Recent activity"]].map(([label, value, hint]) => <div key={String(label)} className="rounded-lg border border-line bg-cream/70 p-4 transition-colors hover:border-ink/25 sm:p-5"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p><p className="mt-3 font-sans text-2xl font-semibold">{value}</p><p className="mt-1 text-[10px] text-muted">{hint}</p></div>)}</div>
      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-line bg-cream/70 p-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center"><label className="relative min-w-0 flex-1 sm:max-w-xs"><span className="sr-only">Search assessments</span><Icon><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></Icon><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or topic..." className="w-full rounded-md border border-line bg-cream-soft py-2 pl-9 pr-3 text-xs outline-none focus:border-rust" /></label><div className="flex gap-1 overflow-x-auto rounded-md border border-line bg-cream-soft p-1">{(["all", "completed", "processing", "draft"] as Filter[]).map((name) => <button type="button" key={name} onClick={() => setFilter(name)} className={`whitespace-nowrap rounded px-2.5 py-1.5 text-[11px] ${filter === name ? "bg-cream text-ink shadow-sm" : "text-muted hover:text-ink"}`}>{name[0].toUpperCase() + name.slice(1)} <span className="text-[10px] text-muted">{name === "all" ? assessments.length : assessments.filter((item) => (item.status || "completed") === name).length}</span></button>)}</div></div><button type="button" onClick={cycleSort} className="inline-flex items-center gap-2 self-start rounded-md border border-line bg-cream-soft px-3 py-2 text-xs text-muted hover:text-ink sm:self-auto"><Icon><path d="M3 6h18M6 12h12M10 18h4" /></Icon>{sortLabel}</button></div>
      <section className="overflow-hidden rounded-xl border border-line bg-cream/70"><div className="hidden grid-cols-[1fr_100px_100px_90px_110px_40px] gap-4 border-b border-line bg-cream-soft px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-muted md:grid"><span>Assessment</span><span>Questions</span><span>Difficulty</span><span>Status</span><span>Created</span><span /></div>{filtered.length ? filtered.map((assessment) => <div key={assessment.id} onClick={() => assessment.quizUrl && window.open(assessment.quizUrl, "_blank")} className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-4 py-4 last:border-0 hover:bg-cream-soft md:grid-cols-[1fr_100px_100px_90px_110px_40px] md:gap-4 md:px-5"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-cream-soft text-rust"><Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></Icon></span><div className="min-w-0"><p className="truncate text-xs font-semibold sm:text-sm">{assessment.title || "Untitled Assessment"}</p><p className="mt-1 truncate text-[10px] text-muted">{assessment.subject || "General"} · {assessment.topic || "Course Material"} · {assessment.fileCount || 1} files</p></div></div><span className="hidden text-xs text-muted md:block">{assessment.questions || 0} Q</span><span className={`hidden w-fit rounded-full border px-2 py-0.5 text-[10px] md:block ${assessment.difficulty === "easy" ? "border-forest/20 bg-forest/10 text-forest" : assessment.difficulty === "hard" ? "border-rust/25 bg-rust/10 text-rust" : "border-line bg-cream-soft text-muted"}`}>{(assessment.difficulty || "mixed")[0].toUpperCase() + (assessment.difficulty || "mixed").slice(1)}</span><span className={`hidden rounded-full px-2 py-0.5 text-[10px] md:block ${assessment.status === "processing" ? "bg-rust/10 text-rust" : "bg-forest/10 text-forest"}`}>● {assessment.status === "processing" ? "Processing" : assessment.status === "draft" ? "Draft" : "Ready"}</span><span className="hidden text-xs text-muted md:block">{formatDate(assessment.createdAt)}</span><span className="text-muted">↗</span></div>) : <div className="px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-xl border border-line bg-cream-soft text-muted"><Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></Icon></div><h2 className="mt-4 text-sm font-semibold">{search ? "No matching assessments" : filter !== "all" ? `No ${filter} assessments` : "No assessments yet"}</h2><p className="mx-auto mt-2 max-w-sm text-xs text-muted">{search ? `We couldn't find any assessments matching "${search}".` : "Your generated quizzes will appear here. Create your first assessment to get started."}</p><Link href="/workspace" className="mt-5 inline-flex rounded-md bg-forest px-4 py-2.5 text-xs font-semibold text-cream">Create Assessment</Link></div>}</section>
    </main>
  </div></AppShell>;
}
