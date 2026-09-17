"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";

function Icon({ children }: { children: React.ReactNode }) {
  return <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your work email and password to continue.");
      return;
    }
    localStorage.setItem("quizai_session", JSON.stringify({ email: email.trim(), remember, signedInAt: Date.now() }));
    window.location.assign("/workspace");
  }

  return <main className="app-page-enter grid min-h-screen bg-cream font-mono text-ink lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-forest p-10 text-cream lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full border border-rust-soft/30"><div className="absolute inset-10 rounded-full border border-rust-soft/30" /></div>
      <div className="relative z-10 flex items-start justify-between"><Link href="/" className="flex items-center gap-2 text-sm font-semibold"><Image src="/logo.png" alt="QuizAI Studio logo" width={32} height={32} className="rounded-md" />QuizAI <span className="text-rust-soft">Studio</span></Link><span className="text-[10px] tracking-[0.18em] text-cream/60">STUDIO / 01.04</span></div>
      <div className="relative z-10 max-w-lg"><p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-rust-soft">Assessment Workbench</p><h1 className="font-sans text-5xl font-semibold leading-[1.04] tracking-tight xl:text-7xl">Back to the<br />work that<br /><span className="text-rust-soft">matters.</span></h1><p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70">The place where teaching materials become better questions. Take your time. The good ones are worth it.</p></div>
      <div className="relative z-10 flex items-end justify-between text-[10px] uppercase tracking-[0.16em] text-cream/50"><span>Quietly precise / deeply human</span><span className="font-sans text-2xl italic text-rust-soft">q.</span></div>
    </section>
    <section className="relative flex min-h-screen flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24"><div className="absolute right-10 top-10 h-24 w-24 border-r border-t border-rust/30" /><div className="mx-auto w-full max-w-md"><div className="mb-10"><p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-rust">Welcome back</p><h2 className="font-sans text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-6xl">Good to have<br /><span className="italic">you back.</span></h2><p className="mt-4 text-sm leading-relaxed text-forest/60">Sign in to keep shaping the questions your students deserve.</p></div>
      <form onSubmit={handleSubmit} className="space-y-5"><label className="block"><span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-forest/60">Work email</span><span className="relative block"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40"><Icon><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></Icon></span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@school.org" className="w-full border border-forest/20 bg-white px-12 py-3.5 text-sm text-forest outline-none placeholder:text-forest/35 focus:border-forest/50" /></span></label><label className="block"><span className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-forest/60"><span>Password</span><button type="button" onClick={() => setError("Password recovery is not configured yet.")} className="normal-case tracking-normal text-forest/60 underline decoration-rust underline-offset-4 hover:text-rust">Forgot password?</button></span><span className="relative block"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40"><Icon><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon></span><input required minLength={4} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="w-full border border-forest/20 bg-white px-12 py-3.5 pr-12 text-sm text-forest outline-none placeholder:text-forest/35 focus:border-forest/50" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest"><Icon><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></Icon></button></span></label><label className="flex cursor-pointer items-center gap-3 text-sm text-forest/60"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-forest" />Remember this device</label>{error && <p role="alert" className="border-l border-rust bg-rust/10 px-3 py-2 text-xs text-rust">{error}</p>}<button type="submit" className="group flex w-full items-center justify-center gap-2 bg-forest px-4 py-4 text-sm font-semibold tracking-wide text-cream transition-opacity hover:opacity-90">Enter the studio <span className="transition-transform group-hover:translate-x-1">-&gt;</span></button></form>
      <div className="my-8 border-t border-forest/10" /><div className="mb-6 border-l border-rust/40 bg-cream-soft p-4 text-sm leading-relaxed text-forest"><strong>New to QuizAI?</strong> Ask your curriculum lead for an invitation to the studio.</div><Link href="/" className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest">Explore the studio first <span>-&gt;</span></Link></div></section>
  </main>;
}
