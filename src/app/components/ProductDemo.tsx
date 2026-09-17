"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const stages = [
  { id: "source", label: "Source", kicker: "01 / COURSE MATERIAL" },
  { id: "generate", label: "Generate", kicker: "02 / QUESTION DRAFT" },
  { id: "validate", label: "Validate", kicker: "03 / QUALITY CHECK" },
  { id: "assess", label: "Assess", kicker: "04 / READY TO PUBLISH" },
  { id: "grade", label: "Grade", kicker: "05 / RESPONSE REVIEW" },
  { id: "report", label: "Report", kicker: "06 / INSIGHT" },
] as const;

type StageId = (typeof stages)[number]["id"];

export function ProductDemo() {
  const [active, setActive] = useState<StageId>("source");
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(() => {
      setActive((current) => stages[(stages.findIndex((stage) => stage.id === current) + 1) % stages.length].id);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [autoPlay]);

  const stage = stages.find((item) => item.id === active) ?? stages[0];

  return <div className="product-demo">
    <div className="product-demo__chrome"><div className="product-demo__dots"><i /><i /><i /></div><span>quizai.studio / assessment-workbench</span><button type="button" onClick={() => setAutoPlay(!autoPlay)}>{autoPlay ? "LIVE" : "PAUSED"} <b /></button></div>
    <div className="product-demo__header"><div><span className="product-demo__brand-mark">◈</span><strong>QuizAI Studio</strong></div><span className="product-demo__header-meta">INTRODUCTION TO OPERATING SYSTEMS <em>●</em></span></div>
    <div className="product-demo__controls" role="tablist" aria-label="Assessment workflow stages">{stages.map((item, index) => <button type="button" role="tab" aria-selected={active === item.id} key={item.id} onClick={() => { setActive(item.id); setAutoPlay(false); }} className={active === item.id ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</button>)}</div>
    <div className="product-demo__canvas"><div className="product-demo__canvas-label">{stage.kicker}</div><StageContent stage={active} /></div>
    <div className="product-demo__footer"><span><i /> Source-grounded generation</span><span>87 pages · 12 topics detected</span></div>
  </div>;
}

function StageContent({ stage }: { stage: StageId }) {
  if (stage === "source") return <div className="demo-source"><div className="demo-file"><div className="demo-file__icon">PDF</div><div><strong>Introduction to Operating Systems.pdf</strong><span>87 pages · 2.4 MB · indexed just now</span></div><b>✓</b></div><div className="demo-scan"><div className="demo-scan__page"><span /><span /><span /><span /><span /></div><div className="demo-scan__line" /></div><div className="demo-source__stats"><span><b>12</b> topics detected</span><span><b>94%</b> source coverage</span><span><b>Ready</b> to calibrate</span></div></div>;
  if (stage === "generate") return <div className="demo-question"><div className="demo-question__top"><span>Q01 / MULTIPLE CHOICE</span><b>Generating 25 questions</b></div><h3>Which scheduling approach gives each process a fixed time slice?</h3><div className="demo-options"><span>A <b>First-come, first-served</b></span><span>B <b>Shortest job first</b></span><span className="selected">C <b>Round robin</b><i>✓</i></span><span>D <b>Priority scheduling</b></span></div><div className="demo-question__next">Q02 is taking shape <i /></div></div>;
  if (stage === "validate") return <div className="demo-validate"><div className="demo-validate__summary"><strong>Question set validation</strong><span>25 / 25 checked</span></div><div className="demo-checks"><span><i>✓</i> Answer grounded in source <b>100%</b></span><span><i>✓</i> Difficulty calibrated <b>Balanced</b></span><span><i>✓</i> Distractors reviewed <b>4 / 4</b></span><span><i>✓</i> Duplicate scan complete <b>Clear</b></span></div><div className="demo-validation-bar"><span /></div></div>;
  if (stage === "assess") return <div className="demo-assess"><div className="demo-assess__title"><span className="demo-form-icon">✓</span><div><strong>Operating Systems · Midterm</strong><span>Google Form · ready to share</span></div><b>READY</b></div><div className="demo-metrics"><span><b>25</b> questions</span><span><b>87%</b> coverage</span><span><b>Balanced</b> difficulty</span></div><button type="button">Publish assessment <span>→</span></button></div>;
  if (stage === "grade") return <div className="demo-grade"><div className="demo-grade__heading"><strong>Student responses</strong><span>126 submissions · evaluating</span></div><div className="demo-bars"><span style={{ height: "58%" }} /><span style={{ height: "76%" }} /><span style={{ height: "64%" }} /><span style={{ height: "88%" }} /><span style={{ height: "71%" }} /><span style={{ height: "92%" }} /><span style={{ height: "83%" }} /></div><div className="demo-grade__result"><b>87%</b><span>average score</span><i>+4.2% from last assessment</i></div></div>;
  return <div className="demo-report"><div className="demo-report__top"><div><span>ASSESSMENT REPORT</span><strong>Operating Systems · Midterm</strong></div><span className="demo-report__avatar"><Image src="/profile-photo.jpg" alt="" width={38} height={38} /></span></div><div className="demo-report__grid"><div><b>87%</b><span>Average score</span></div><div><b>94%</b><span>Completion</span></div><div><b>126</b><span>Students</span></div></div><div className="demo-report__line"><span style={{ width: "87%" }} /></div><p>Report generated from validated responses and source outcomes.</p></div>;
}
