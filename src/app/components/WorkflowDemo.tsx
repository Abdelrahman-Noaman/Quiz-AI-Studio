"use client";

import { useEffect, useState } from "react";

const steps = [
  { number: "01", label: "Source material", title: "Bring the real material.", detail: "Lecture notes and PDFs are mapped before a question is written.", icon: "↧" },
  { number: "02", label: "AI calibration", title: "Name the thinking.", detail: "Difficulty, question type, and cognitive demand are set up front.", icon: "◎" },
  { number: "03", label: "Question review", title: "Inspect the reasoning.", detail: "Every rationale and distractor stays visible for an educator to refine.", icon: "✓" },
  { number: "04", label: "Assessment ready", title: "Publish with confidence.", detail: "A Google Form, response sheet, and answer key are ready to share.", icon: "↗" },
];

export function WorkflowDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % steps.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  const step = steps[active];
  return <div className="workflow-demo">
    <div className="workflow-demo__top"><span className="workflow-demo__eyebrow">LIVE ASSESSMENT LOOP</span><span className="workflow-demo__status"><i /> {active === 3 ? "Ready to publish" : "Working"}</span></div>
    <div className="workflow-demo__body"><div className="workflow-demo__rail">{steps.map((item, index) => <button key={item.number} type="button" onClick={() => setActive(index)} className={`workflow-demo__step ${active === index ? "is-active" : ""} ${index < active ? "is-complete" : ""}`}><span>{item.number}</span><strong>{item.label}</strong></button>)}</div><div className="workflow-demo__content" key={step.number}><span className="workflow-demo__icon">{step.icon}</span><p className="workflow-demo__label">{step.number} / {step.label}</p><h3>{step.title}</h3><p>{step.detail}</p><div className="workflow-demo__progress"><span style={{ width: `${((active + 1) / steps.length) * 100}%` }} /></div></div></div>
  </div>;
}
