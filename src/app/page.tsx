import Link from "next/link";
import Image from "next/image";
import { Faq } from "./components/Faq";
import { ProductDemo } from "./components/ProductDemo";
import { Reveal } from "./components/Reveal";
import { WorkflowDemo } from "./components/WorkflowDemo";

export const dynamic = "force-dynamic";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 font-mono text-[11px] tracking-[0.2em] text-rust">
      [ {children} ]
    </p>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream font-mono text-ink">
      {/* top strip */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[10px] tracking-[0.18em] text-muted">
          <span>QUIZAI STUDIO / ASSESSMENT WORKBENCH 01.04</span>
          <Link href="/workspace" className="text-rust hover:opacity-70">
            BUILD BETTER QUESTIONS →
          </Link>
        </div>
      </div>

      {/* header */}
      <header className="sticky top-0 z-50 border-b border-line bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold">
            <Image src="/logo.png" alt="Logo" width={20} height={20} />
            QuizAI <span className="text-rust">Studio</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[11px] tracking-widest text-ink-soft md:flex">
            <a href="#workbench" className="hover:text-rust">
              Workbench
            </a>
            <a href="#method" className="hover:text-rust">
              Method
            </a>
            <a href="#educators" className="hover:text-rust">
              Educators
            </a>
            <a href="#faq" className="hover:text-rust">
              FAQ
            </a>
          </nav>
          <Link
            href="/workspace"
            className="rounded border border-ink/25 px-4 py-2 text-[11px] tracking-wide transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            Open the studio ↗
          </Link>
          <Link
            href="/login"
            className="ml-3 rounded border border-ink/25 px-4 py-2 text-[11px] tracking-wide transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="grid items-start gap-10 lg:grid-cols-[0.88fr_1.2fr] lg:gap-12">
          <Reveal>
            <h1 className="font-sans text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[1.04] tracking-tight text-ink">
              Make every question earn its{" "}
              <span className="text-rust">place.</span>
            </h1>
            <p className="mt-7 max-w-md text-[13px] leading-relaxed text-ink-soft">
              QuizAI Studio turns the materials you already teach with into
              calibrated assessments your students can actually learn from. Set
              the intent. Inspect the reasoning. Publish with confidence.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/workspace"
                className="rounded bg-forest px-5 py-3 text-[12px] font-semibold text-cream transition-opacity hover:opacity-90"
              >
                Start building →
              </Link>
              <a
                href="#workbench"
                className="rounded border border-ink/25 px-5 py-3 text-[12px] transition-colors hover:border-ink"
              >
                ▷ See the workbench
              </a>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[10px] tracking-widest text-muted">
              <span className="h-px w-6 bg-rust" />
              For educators &amp; curriculum teams
              <span className="ml-1 rounded border border-line px-1.5 py-0.5">⌘</span>
              <span className="rounded border border-line px-1.5 py-0.5">K</span>
            </div>
          </Reveal>

          <Reveal className="relative pt-4 sm:pt-8" delay={140}>
            <div className="absolute -right-2 top-0 z-10 hidden items-center gap-2 text-[10px] tracking-[0.16em] text-muted sm:flex">
              <span className="h-px w-8 bg-rust" />
              BUILT WITH CARE
            </div>
            <ProductDemo />
          </Reveal>
        </div>
      </section>

      {/* THE WORKBENCH — a sharper loop */}
      <section id="workbench" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <Label>THE WORKBENCH</Label>
            <h2 className="font-sans text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-tight">
              A sharper loop from <span className="text-rust">source</span> to
              score.
            </h2>
          </Reveal>
          <Reveal className="max-w-md self-end text-[12px] leading-relaxed text-ink-soft" delay={120}>
            Good assessment design is a series of small, consequential decisions.
            QuizAI keeps those decisions visible — and gives your team a faster
            way to make them.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px border-t border-line md:grid-cols-3">
          {[
            {
              n: "01",
              tag: "INGEST",
              icon: "⤓",
              title: "Bring the real material.",
              body: "Upload lecture notes, a syllabus, PDFs, or your slide deck. QuizAI maps the content before it writes a word.",
            },
            {
              n: "02",
              tag: "CALIBRATE",
              icon: "◎",
              title: "Name the thinking.",
              body: "Choose outcomes, difficulty, question formats, and a Bloom's mix that mirrors the way you want students to think.",
            },
            {
              n: "03",
              tag: "REFINE",
              icon: "⛨",
              title: "Keep your standards.",
              body: "Review every rationale, tune the distractors, and publish only what earns a place in your course.",
            },
          ].map((c) => (
            <Reveal
              key={c.n}
              className="border-line px-6 py-8 md:border-r last:md:border-r-0"
              delay={Number(c.n) * 80}
            >
              <div className="mb-8 flex items-center justify-between text-muted">
                <span className="text-[10px] tracking-widest text-rust">
                  {c.n} / {c.tag}
                </span>
                <span className="text-base">{c.icon}</span>
              </div>
              <h3 className="mb-4 text-[13px] font-semibold text-ink">
                {c.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-ink-soft">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GREEN SECTION — thinking partner */}
      <section id="method" className="bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mb-6 font-mono text-[11px] tracking-[0.2em] text-rust-soft">
            [ A DIFFERENT KIND OF FAST ]
          </p>
          <h2 className="font-sans text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-cream">
            Not a question spinner.
            <br />A thinking partner.
          </h2>

          <Reveal className="mt-16">
            <WorkflowDemo />
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded border border-white/10 bg-white/2 p-7">
              <div className="mb-6 flex items-center justify-between text-[10px] tracking-widest text-sage/70">
                <span>THE OLD LOOP</span>
                <span>◷</span>
              </div>
              <ul className="space-y-4 text-[12px] text-sage/85">
                {[
                  "Start with a blank document and a deadline.",
                  "Write questions from memory, then second-guess the mix.",
                  "Copy, paste, and format for the LMS by hand.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-rust-soft">✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded border border-sage/40 bg-cream p-7 text-ink">
              <div className="mb-6 flex items-center justify-between text-[10px] tracking-widest text-muted">
                <span>THE QUIZAI LOOP</span>
                <span className="text-forest">◉</span>
              </div>
              <ul className="space-y-4 text-[12px] text-ink-soft">
                {[
                  "Start with your course — its language, outcomes, and nuance.",
                  "Calibrate the cognitive load before generation begins.",
                  "Review a clean set, then send it where students are.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-forest">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FIELD NOTES — testimonials */}
      <section id="educators" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <Label>FIELD NOTES</Label>
            <h2 className="font-sans text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-tight">
              Built for the people who notice when a question is{" "}
              <span className="text-rust">off.</span>
            </h2>
          </div>
          <p className="max-w-sm self-start pt-2 text-[12px] leading-relaxed text-ink-soft lg:pt-10">
            From a 12-person seminar to a 400-seat intro course, the standard
            stays human.
          </p>
        </div>

        <div className="mt-14 grid gap-px border border-line md:grid-cols-2">
          <div className="bg-cream-card/60 p-8">
            <p className="mb-8 text-[10px] tracking-widest text-rust">
              / DR. MAYA SINGH · BIOLOGY
            </p>
            <p className="text-[13px] leading-relaxed text-ink">
              &ldquo;I can see the shape of an assessment before I commit to it.
              That changes the quality of the conversation with my team.&rdquo;
            </p>
            <div className="mt-10 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-rust/20 text-[10px] text-rust">
                MS
              </span>
              <div className="text-[11px]">
                <div className="text-ink">Dr. Maya Singh</div>
                <div className="text-muted">Northwestern Faculty</div>
              </div>
            </div>
          </div>

          <div className="border-t border-line p-8 md:border-t-0 md:border-l">
            <p className="mb-8 text-[10px] tracking-widest text-rust">
              / ELI TURNER · CURRICULUM
            </p>
            <p className="text-[13px] leading-relaxed text-ink">
              &ldquo;The useful part isn&apos;t speed. It&apos;s having a
              thoughtful first draft to push against.&rdquo;
            </p>
            <div className="mt-10 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-forest/15 text-[10px] text-forest">
                ET
              </span>
              <div className="text-[11px]">
                <div className="text-ink">Eli Turner</div>
                <div className="text-muted">Monument School</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <Label>QUESTIONS, ANSWERED</Label>
            <h2 className="font-sans text-[clamp(2rem,4.5vw,3rem)] font-semibold tracking-tight">
              Make the <span className="text-rust">call.</span>
            </h2>
          </div>
          <p className="max-w-sm self-end text-[12px] leading-relaxed text-ink-soft">
            A few practical notes before you bring your first course into the
            workbench.
          </p>
        </div>
        <Faq />
      </section>

      {/* CTA */}
      <section id="cta" className="bg-cream-soft">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="mb-8 text-[10px] tracking-[0.2em] text-rust">
            [ YOUR NEXT ASSESSMENT ]
          </p>
          <h2 className="mx-auto max-w-2xl font-sans text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight">
            Give your best questions a better{" "}
            <span className="text-rust">workbench.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[12px] text-ink-soft">
            Bring one set of materials. Leave with a clearer way to assess.
          </p>
          <Link
            href="/workspace"
            className="mt-10 inline-block rounded bg-forest px-7 py-3.5 text-[12px] font-semibold text-cream transition-opacity hover:opacity-90"
          >
            Open QuizAI Studio ↗
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-[10px] tracking-widest text-muted">
          <span>© 2025 QuizAI Studio / made for careful teachers.</span>
          <div className="flex items-center gap-6">
            <a href="#method" className="hover:text-rust">
              Method
            </a>
            <a href="#educators" className="hover:text-rust">
              Educators
            </a>
            <a href="#faq" className="hover:text-rust">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-rust">
              Back to top ↑
            </a>
            <span>Assessment workbench 01.04</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
