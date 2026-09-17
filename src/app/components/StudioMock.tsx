export function StudioMock() {
  return (
    <div className="relative w-full">
      {/* soft shadow platform */}
      <div className="absolute -inset-3 -z-10 rounded-xl bg-[rgba(20,67,42,0.06)] blur-xl" />
      <div className="overflow-hidden rounded-lg border border-[rgba(20,67,42,0.35)] bg-forest text-[9px] leading-tight text-sage shadow-[0_30px_70px_-30px_rgba(20,67,42,0.55)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-forest-deep px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="mx-auto font-mono text-[8px] tracking-wide text-white/40">
            quizai:// assessment-studio
          </span>
          <span className="text-white/30">↗</span>
        </div>

        {/* app bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-2 font-semibold text-white/90">
            <span className="text-rust-soft">◈</span> QuizAI Studio
          </div>
          <div className="flex items-center gap-4 text-[8px] tracking-widest text-white/50">
            <span>ASSESSMENTS</span>
            <span>LIBRARY</span>
            <span>RUBRICS</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rust text-white">
              M
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[95px_1fr]">
          {/* sidebar */}
          <div className="border-r border-white/10 p-3">
            <p className="text-[7px] tracking-widest text-white/35">CURRENT PROJECT</p>
            <div className="mt-1.5 flex items-center justify-between rounded border border-white/10 bg-white/5 px-2 py-1.5 text-white/80">
              <span>▤ Biology · 204</span>
              <span>⌄</span>
            </div>
            <p className="mt-4 text-[7px] tracking-widest text-white/35">WORKSPACE</p>
            <ul className="mt-1.5 space-y-1.5 text-white/60">
              <li className="rounded bg-rust/20 px-2 py-1 text-rust-soft">✦ Generate</li>
              <li className="px-2 py-1">▣ Question bank · 42</li>
              <li className="px-2 py-1">◫ Outcomes map</li>
            </ul>
            <p className="mt-4 text-[7px] tracking-widest text-white/35">RECENT</p>
            <ul className="mt-1.5 space-y-1.5 text-white/55">
              <li className="px-2">● Midterm · draft</li>
              <li className="px-2">● Quiz 03 · live</li>
            </ul>
          </div>

          {/* main */}
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[8px] tracking-widest text-rust-soft">
                / GENERATE / NEW ASSESSMENT
              </p>
              <span className="text-[7px] text-white/40">● autosaved</span>
            </div>
            <h4 className="mb-3 font-sans text-[13px] font-medium text-white">
              Build from your materials.
            </h4>

            <div className="grid grid-cols-[1fr_130px] gap-3">
              {/* source materials */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[7px] tracking-widest text-white/45">
                  <span>01 / SOURCE MATERIALS</span>
                  <span className="rounded border border-white/15 px-1.5 py-0.5">+ Add</span>
                </div>
                <div className="mb-2 rounded border border-dashed border-white/20 bg-white/[0.03] py-4 text-center text-white/50">
                  <div className="text-sm">⤓</div>
                  <div className="mt-1 text-white/70">Drop files here</div>
                  <div className="text-[7px] text-white/35">or browse your library</div>
                </div>
                {[
                  ["BIO_204 · Cell signaling.pdf", "PDF · 2.4 MB"],
                  ["Week 07 lecture notes", "DOCX · 480 KB"],
                  ["Learning outcomes · Spring", "PASTE · 91 KB"],
                ].map(([name, meta]) => (
                  <div
                    key={name}
                    className="mb-1.5 flex items-center gap-2 rounded border border-white/10 bg-white/[0.03] px-2 py-1.5"
                  >
                    <span className="text-rust-soft">▤</span>
                    <div className="flex-1">
                      <div className="text-white/80">{name}</div>
                      <div className="text-[7px] text-white/35">{meta}</div>
                    </div>
                    <span className="text-white/40">✓</span>
                  </div>
                ))}
                <p className="mt-1 text-[7px] text-white/35">
                  3 files &nbsp; · &nbsp; 14,200 words indexed
                </p>
              </div>

              {/* calibration */}
              <div>
                <p className="mb-1.5 text-[7px] tracking-widest text-white/45">
                  02 / CALIBRATION
                </p>
                <div className="mb-2 flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-2 py-1.5">
                  <span className="text-white/60">Question count</span>
                  <span className="text-white/90">12</span>
                </div>
                <p className="mb-1 text-[7px] text-white/45">Target difficulty</p>
                <div className="mb-2 flex overflow-hidden rounded border border-white/10 text-[7px]">
                  <span className="flex-1 py-1 text-center text-white/50">Gentle</span>
                  <span className="flex-1 bg-rust py-1 text-center text-white">Balanced</span>
                  <span className="flex-1 py-1 text-center text-white/50">Stretch</span>
                </div>
                <div className="mb-1 flex items-center justify-between text-[7px]">
                  <span className="text-white/45">Cognitive mix</span>
                  <span className="text-white/60">Bloom&apos;s</span>
                </div>
                {[
                  ["Recall", "35%", "35%"],
                  ["Apply", "40%", "40%"],
                  ["Analyze", "25%", "25%"],
                ].map(([label, w]) => (
                  <div key={label} className="mb-1 flex items-center gap-1.5">
                    <span className="w-10 text-[7px] text-white/55">{label}</span>
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-rust-soft"
                        style={{ width: w }}
                      />
                    </span>
                    <span className="text-[7px] text-white/45">{w}</span>
                  </div>
                ))}
                <button className="mt-3 flex w-full items-center justify-center gap-1 rounded bg-sage px-2 py-1.5 text-[8px] font-semibold text-forest">
                  ✦ Generate assessment →
                </button>
              </div>
            </div>

            {/* preview */}
            <div className="mt-3 rounded border border-white/10 bg-white/[0.03] p-2.5">
              <div className="mb-1.5 flex items-center justify-between text-[7px] tracking-widest text-white/40">
                <span>03 / QUESTION PREVIEW</span>
                <span className="text-rust-soft">LIVE PREVIEW</span>
              </div>
              <p className="text-white/85">
                Q1. Which observation best supports the claim that receptor tyrosine
                kinases amplify an extracellular signal?
              </p>
              <div className="mt-1.5 space-y-1 text-white/60">
                <p>A) A phosphorylation cascade increases the number of activated proteins.</p>
                <p>B) A ligand crosses the cell membrane unaided.</p>
              </div>
              <button className="mt-2 rounded border border-white/15 px-2 py-1 text-[7px] text-white/70">
                Run sample generation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
