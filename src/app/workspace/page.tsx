"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AppShell } from "../components/AppShell";
import { serverSnapshot, useLocalStorageValue } from "../lib/localStorage";

type Difficulty = "easy" | "medium" | "hard" | "mixed";
type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "mixed";

type QuizHistoryItem = {
	id: string;
	title: string;
	questions: number;
	subject?: string;
	topic?: string;
	fileCount?: number;
	fileNames?: string[];
	difficulty?: Difficulty;
	questionType?: QuestionType;
	deadline?: string | null;
	status?: "processing" | "completed" | "draft";
	quizUrl?: string | null;
	responseSheetUrl?: string | null;
	answerKeyUrl?: string | null;
	createdAt: number;
};

const acceptedExtensions = /\.(pdf|doc|docx|ppt|pptx|txt)$/i;
const maxFileSize = 25 * 1024 * 1024;
const maxTotalSize = 100 * 1024 * 1024;
const maxFiles = 10;

const icons = {
	upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />,
	settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.18.6.73 1 1.51 1H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15Z" /></>,
	eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></>,
	chart: <><path d="M18 20V10M12 20V4M6 20v-6" /></>,
	clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
	file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></>,
	arrow: <><path d="M5 12h14M12 5l7 7-7 7" /></>,
};

function Icon({ name, className = "h-4 w-4" }: { name: keyof typeof icons; className?: string }) {
	return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileId(file: File) {
	return `${file.name}__${file.size}__${file.lastModified}`;
}

function relativeTime(timestamp: number) {
	const minutes = Math.floor((Date.now() - timestamp) / 60000);
	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return <section className={`overflow-hidden rounded-xl border border-line bg-cream/70 transition-colors hover:border-ink/25 ${className}`}>{children}</section>;
}

function CardHeader({ icon, title, meta }: { icon: keyof typeof icons; title: string; meta?: string }) {
	return <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
		<div className="flex items-center gap-2 text-sm font-semibold"><span className="grid h-6 w-6 place-items-center rounded-md bg-rust/10 text-rust"><Icon name={icon} className="h-3.5 w-3.5" /></span>{title}</div>
		{meta && <span className="text-xs text-muted">{meta}</span>}
	</div>;
}

export default function WorkspacePage() {
	const settingsValue = useLocalStorageValue("quizai_settings");

	if (settingsValue === serverSnapshot) return null;

	let settings: Record<string, unknown> = {};
	try { settings = JSON.parse(settingsValue || "{}"); } catch { /* Use defaults when storage is invalid. */ }
	return <WorkspaceEditor settings={settings} />;
}

function WorkspaceEditor({ settings }: { settings: Record<string, unknown> }) {
	const settingsQuestions = Number(settings.defaultQuestions);
	const settingsDifficulty = settings.defaultDifficulty;
	const settingsFormat = settings.defaultFormat;
	const settingsSubject = typeof settings.defaultSubject === "string" ? settings.defaultSubject : "";
	const settingsInstructions = typeof settings.defaultInstructions === "string" ? settings.defaultInstructions : "";
	const storedHistory = useMemo(() => {
		try { return JSON.parse(localStorage.getItem("quizai_history") || "[]") as QuizHistoryItem[]; } catch { return []; }
	}, []);
	const initialQuestions = [10, 20, 30, 40].includes(settingsQuestions) ? settingsQuestions : 20;
	const initialDifficulty: Difficulty = ["easy", "medium", "hard", "mixed"].includes(String(settingsDifficulty)) ? settingsDifficulty as Difficulty : "medium";
	const initialQuestionType: QuestionType = ["multiple_choice", "true_false", "short_answer", "mixed"].includes(String(settingsFormat)) ? settingsFormat as QuestionType : "multiple_choice";
	const fileInput = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [dragging, setDragging] = useState(false);
	const [questions, setQuestions] = useState(initialQuestions);
	const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
	const [questionType, setQuestionType] = useState<QuestionType>(initialQuestionType);
	const [deadlineEnabled, setDeadlineEnabled] = useState(true);
	const [deadlineHours, setDeadlineHours] = useState(72);
	const [deadlineInput, setDeadlineInput] = useState("");
	const [advanced, setAdvanced] = useState(false);
	const [subject, setSubject] = useState(settingsSubject);
	const [topic, setTopic] = useState("");
	const [instructions, setInstructions] = useState(settingsInstructions);
	const [webhookUrl, setWebhookUrl] = useState(() => typeof settings.webhookUrl === "string" ? settings.webhookUrl : "");
	const [processing, setProcessing] = useState(false);
	const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
	const [success, setSuccess] = useState<{ title: string; url?: string | null; responseSheetUrl?: string | null; answerKeyUrl?: string | null; deadline?: string | null; count: number } | null>(null);
	const [history, setHistory] = useState<QuizHistoryItem[]>(storedHistory);
	const [analysisStep, setAnalysisStep] = useState(0);

	useEffect(() => {
		if (!files.length) return;
		const reset = window.setTimeout(() => setAnalysisStep(1), 0);
		const timer = window.setTimeout(() => setAnalysisStep(2), 650);
		const ready = window.setTimeout(() => setAnalysisStep(3), 1450);
		return () => {
			window.clearTimeout(reset);
			window.clearTimeout(timer);
			window.clearTimeout(ready);
		};
	}, [files.length]);

	const totalSize = files.reduce((total, file) => total + file.size, 0);
	const distribution = difficulty === "easy" ? [70, 25, 5] : difficulty === "hard" ? [10, 40, 50] : difficulty === "mixed" ? [33, 34, 33] : [30, 50, 20];
	const typeLabel = { multiple_choice: "Multiple Choice", true_false: "True / False", short_answer: "Short Answer", mixed: "Mixed" }[questionType];
	const [currentTime] = useState(() => Date.now());
	const deadline = useMemo(() => deadlineInput ? new Date(deadlineInput) : new Date(currentTime + deadlineHours * 3600000), [currentTime, deadlineInput, deadlineHours]);
	const deadlineText = deadlineEnabled ? `Closes ${deadlineInput ? deadline.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : `in ${deadlineHours === 24 ? "1 day" : deadlineHours === 72 ? "3 days" : deadlineHours === 168 ? "1 week" : "1 month"}`}` : "No deadline set";

	function addFiles(incoming: FileList | File[]) {
		const next = [...files];
		const errors: string[] = [];
		Array.from(incoming).forEach((file) => {
			if (!acceptedExtensions.test(file.name)) errors.push(`${file.name}: unsupported format`);
			else if (file.size > maxFileSize) errors.push(`${file.name}: exceeds 25 MB`);
			else if (next.some((existing) => fileId(existing) === fileId(file))) errors.push(`${file.name}: already added`);
			else if (next.length >= maxFiles) errors.push(`Maximum ${maxFiles} files allowed`);
			else if (next.reduce((sum, item) => sum + item.size, 0) + file.size > maxTotalSize) errors.push("Total size cannot exceed 100 MB");
			else next.push(file);
		});
		setFiles(next);
		setAlert(errors.length ? { type: "error", message: errors.slice(0, 3).join(" • ") } : null);
		if (fileInput.current) fileInput.current.value = "";
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setDragging(false);
		if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!files.length) return setAlert({ type: "error", message: "Upload at least one course document to continue." });
		if (!webhookUrl || webhookUrl.includes("YOUR-N8N-DOMAIN")) return setAlert({ type: "error", message: "Set your n8n webhook URL in Settings before generating a quiz." });
		setProcessing(true); setAlert(null); setSuccess(null);
		const payload = new FormData();
		files.forEach((file, index) => { payload.append("files", file, file.name); payload.append(`file_${index}`, file, file.name); });
		payload.append("file", files[0], files[0].name);
		payload.append("fileCount", String(files.length)); payload.append("fileNames", JSON.stringify(files.map((file) => file.name)));
		payload.append("subject", subject.trim() || "General"); payload.append("topic", topic.trim() || "Course Material");
		payload.append("numberOfQuestions", String(questions)); payload.append("difficulty", difficulty); payload.append("instructions", instructions);
		payload.append("deadlineEnabled", String(deadlineEnabled)); if (deadlineEnabled) payload.append("deadline", deadline.toISOString());
		payload.append("questionTypes", JSON.stringify(questionType === "mixed" ? ["multiple_choice", "true_false", "short_answer"] : [questionType]));
		try {
			const response = await fetch(webhookUrl, { method: "POST", body: payload, signal: AbortSignal.timeout(300000) });
			const raw = await response.text();
			let result: any = {}; try { result = raw ? JSON.parse(raw) : {}; } catch { result = { message: raw }; }
			if (Array.isArray(result)) result = result[0] || {};
			if (!response.ok) throw new Error(result.message || "The workflow returned an error.");
			const url = result.quizUrl || result.formUrl || result.url || result.body?.quizUrl || result.data?.quizUrl || null;
			const responseSheetUrl = result.responseSheetUrl || result.body?.responseSheetUrl || result.data?.responseSheetUrl || null;
			const answerKeyUrl = result.answerKeyUrl || result.answerKeySheetUrl || result.body?.answerKeyUrl || result.data?.answerKeyUrl || null;
			const resultDeadline = result.deadline || result.body?.deadline || result.data?.deadline || null;
			const jobId = result.jobId || result.body?.jobId || result.data?.jobId || null;
			const processingStatus = result.status === "processing" || result.body?.status === "processing" || result.data?.status === "processing" || response.status === 202;
			const title = result.title || `${subject.trim() || "General"} — ${topic.trim() || "Course Material"}`;
			const item: QuizHistoryItem = {
				id: jobId || result.formId || `quiz_${Date.now()}`,
				title,
				subject: subject.trim() || "General",
				topic: topic.trim() || "Course Material",
				questions,
				difficulty,
				questionType,
				fileCount: files.length,
				fileNames: files.map((file) => file.name),
				deadline: deadlineEnabled ? deadline.toISOString() : null,
				status: processingStatus && !url ? "processing" : url ? "completed" : "draft",
				quizUrl: url,
				responseSheetUrl,
				answerKeyUrl,
				createdAt: Date.now(),
			};
			const nextHistory = [item, ...history].slice(0, 100);
			setHistory(nextHistory); localStorage.setItem("quizai_history", JSON.stringify(nextHistory));
			if (processingStatus && !url) {
				setAlert({ type: "success", message: "⚡ Documents received! AI is generating your assessment in the background." });
				setSuccess(null);
			} else {
				setSuccess({ title, url, responseSheetUrl, answerKeyUrl, deadline: resultDeadline || (deadlineEnabled ? deadline.toISOString() : null), count: questions });
			}
		} catch (error) {
			setAlert({ type: "error", message: error instanceof Error && error.name === "TimeoutError" ? "Generation is taking longer than expected. Check n8n Executions." : error instanceof Error ? error.message : "Unable to reach the AI workflow." });
		} finally { setProcessing(false); }
	}

	return <AppShell active="workspace">
		<div className="mx-auto max-w-6xl px-4 sm:px-6">

			<section className="mx-auto max-w-2xl py-12 text-center sm:py-16"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-cream-soft px-3 py-1 text-xs text-muted"><span className="h-1.5 w-1.5 rounded-full bg-rust" /> Intelligent Assessment Platform</div><h1 className="font-sans text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Turn your course material into a smarter assessment.</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">Upload one or more documents and let AI analyze topics, generate questions, and build a balanced quiz in seconds.</p></section>

			<main className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_340px]">
				<form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-6">
					<Card className="bg-linear-to-b from-cream-soft to-cream"><CardHeader icon="upload" title="Upload course material" meta={files.length ? `${files.length} file${files.length === 1 ? "" : "s"} uploaded` : "Required"} /><div className="p-5 sm:p-6">
						{files.length > 0 && <div className="mb-4 space-y-2"><div className="flex items-center justify-between rounded-lg border border-line bg-cream/70 px-3 py-2 text-xs"><span className="font-semibold text-forest">{files.length} {files.length === 1 ? "file" : "files"} · {formatBytes(totalSize)} total</span><button type="button" onClick={() => setFiles([])} className="text-muted hover:text-rust">Clear all</button></div>{files.map((file) => <div key={fileId(file)} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-cream/50 px-3 py-2.5"><div className="flex min-w-0 items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-rust text-[9px] font-bold text-cream">{file.name.split(".").pop()?.slice(0, 4).toUpperCase()}</span><span className="truncate text-xs font-medium">{file.name}<small className="mt-0.5 block text-[10px] text-muted">{formatBytes(file.size)}</small></span></div><button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles(files.filter((item) => fileId(item) !== fileId(file)))} className="text-lg text-muted hover:text-rust">×</button></div>)}</div>}
						<div role="button" tabIndex={0} onClick={() => fileInput.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInput.current?.click(); }} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} className={`cursor-pointer rounded-lg border-[1.5px] border-dashed p-8 text-center transition-colors sm:p-10 ${dragging ? "border-rust bg-rust/10" : "border-ink/20 hover:border-rust hover:bg-rust/5"}`}><input ref={fileInput} type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" className="hidden" onChange={(event: ChangeEvent<HTMLInputElement>) => event.target.files && addFiles(event.target.files)} /><span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-lg border border-line bg-cream-soft text-muted"><Icon name="file" /></span><p className="text-sm font-semibold">{files.length ? "Add more documents" : "Drop your documents here"}</p><p className="mt-1 text-xs text-muted">{files.length ? "Click to browse or drag additional files here" : "Add one or multiple files — click to browse or drag to upload"}</p><span className="mt-5 inline-flex items-center gap-2 rounded-md border border-line bg-cream-soft px-4 py-2 text-xs font-medium"><Icon name="upload" className="h-3 w-3" /> Browse files</span><div className="mt-5 flex justify-center gap-3 text-[10px] font-semibold tracking-wider text-muted"><span>PDF</span><span>DOCX</span><span>PPTX</span><span>TXT</span></div></div>
					</div></Card>

					<Card><CardHeader icon="settings" title="Quiz Configuration" /><div className="space-y-6 p-5 sm:p-6">{([["Questions", questions, setQuestions, [10, 20, 30, 40]], ["Difficulty", difficulty, setDifficulty, ["easy", "medium", "hard", "mixed"]], ["Question Type", questionType, setQuestionType, ["multiple_choice", "true_false", "short_answer", "mixed"]]] as const).map(([label, value, setter, options]) => <div key={label}><div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-soft"><span>{label}</span><span className="text-[10px] font-medium normal-case tracking-normal text-muted">{label === "Questions" ? "Total number of questions" : label === "Difficulty" ? "Cognitive complexity" : "Question format"}</span></div><div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-cream-soft p-1 sm:grid-cols-4">{options.map((option) => <button type="button" key={String(option)} onClick={() => setter(option as never)} className={`rounded-md px-2 py-2 text-xs font-medium transition-colors ${value === option ? "bg-cream text-ink shadow-sm" : "text-muted hover:text-ink"}`}>{label === "Question Type" ? { multiple_choice: "Multiple Choice", true_false: "True / False", short_answer: "Short Answer", mixed: "Mixed" }[option as QuestionType] : typeof option === "string" ? option.charAt(0).toUpperCase() + option.slice(1) : option}</button>)}</div></div>)}
						<div><div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-soft"><span>Deadline</span><span className="text-[10px] font-medium normal-case tracking-normal text-muted">When students can submit until</span></div><div className="rounded-lg border border-line bg-cream-soft p-4"><label className="flex cursor-pointer items-center justify-between gap-3"><span><strong className="block text-xs">Set a submission deadline</strong><span className="mt-1 block text-[11px] text-muted">Students can only submit before this time</span></span><input type="checkbox" checked={deadlineEnabled} onChange={(event) => setDeadlineEnabled(event.target.checked)} className="h-4 w-4 accent-rust" /></label>{deadlineEnabled && <div className="mt-4 border-t border-line pt-4"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[[24, "1 day"], [72, "3 days"], [168, "1 week"], [720, "1 month"]].map(([hours, label]) => <button type="button" key={hours} onClick={() => { setDeadlineHours(Number(hours)); setDeadlineInput(""); }} className={`rounded border px-2 py-2 text-xs ${!deadlineInput && deadlineHours === hours ? "border-rust bg-rust/10 text-rust" : "border-line text-muted hover:border-ink/25"}`}>{label}</button>)}</div><div className="mt-3 flex items-center gap-2 text-xs text-muted"><label htmlFor="deadline">Custom:</label><input id="deadline" type="datetime-local" value={deadlineInput} min={new Date().toISOString().slice(0, 16)} onChange={(event) => setDeadlineInput(event.target.value)} className="min-w-0 flex-1 rounded border border-line bg-cream px-2 py-1.5 text-xs text-ink outline-none focus:border-rust" /></div><p className="mt-3 rounded border border-rust/20 bg-rust/10 px-3 py-2 text-xs text-rust">{deadlineText}</p></div>}</div></div>
						<button type="button" onClick={() => setAdvanced(!advanced)} aria-expanded={advanced} className="flex w-full items-center gap-2 border-b border-line pb-3 text-left text-xs font-medium text-muted hover:text-ink"><span className={`transition-transform ${advanced ? "rotate-90" : ""}`}>›</span> Advanced settings</button>{advanced && <div className="grid gap-4 pt-1 sm:grid-cols-2"><label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. Computer Science" className="mt-2 w-full rounded border border-line bg-cream-soft px-3 py-2 text-xs font-normal normal-case tracking-normal outline-none focus:border-rust" /></label><label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Topic / Chapter<input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. Networking" className="mt-2 w-full rounded border border-line bg-cream-soft px-3 py-2 text-xs font-normal normal-case tracking-normal outline-none focus:border-rust" /></label><label className="text-xs font-semibold uppercase tracking-wide text-ink-soft sm:col-span-2">Custom Instructions<textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Optional guidance for the AI" className="mt-2 min-h-20 w-full resize-y rounded border border-line bg-cream-soft px-3 py-2 text-xs font-normal normal-case tracking-normal outline-none focus:border-rust" /></label></div>}
					</div></Card>

						<Card className="bg-linear-to-b from-cream-soft to-cream"><CardHeader icon="eye" title="Assessment Preview" /><div className="p-5 sm:p-6"><div className="grid grid-cols-3 gap-2 sm:gap-3"><div className="rounded-lg border border-line bg-cream-soft p-3"><p className="text-[10px] uppercase text-muted">Questions</p><p className="mt-1 text-sm font-semibold">{questions}</p></div><div className="rounded-lg border border-line bg-cream-soft p-3"><p className="text-[10px] uppercase text-muted">Difficulty</p><p className="mt-1 truncate text-sm font-semibold">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p></div><div className="rounded-lg border border-line bg-cream-soft p-3"><p className="text-[10px] uppercase text-muted">Format</p><p className="mt-1 truncate text-sm font-semibold">{typeLabel}</p></div></div><button type="submit" disabled={!files.length || processing} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-muted">{processing ? "Generating..." : "Generate Quiz"}<Icon name="arrow" className="h-4 w-4" /></button><p className="mt-3 text-center text-xs text-muted">{files.length ? `${files.length} document${files.length === 1 ? "" : "s"} · ${questions} questions · ${difficulty} · ${typeLabel}` : "Upload at least one document to continue"}</p>{alert && <div className={`mt-4 rounded-md border px-4 py-3 text-xs ${alert.type === "error" ? "border-rust/25 bg-rust/10 text-rust" : "border-forest/25 bg-forest/10 text-forest"}`}>{alert.message}</div>}{processing && <div className="mt-4 rounded-lg border border-line bg-cream-soft p-5"><p className="flex items-center gap-2 text-sm font-semibold"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/15 border-t-rust" /> Generating your assessment</p><div className="mt-4 space-y-3 text-xs text-muted">{["Reading documents", "Identifying topics", "Designing questions", "Validating answers"].map((step, index) => <p key={step} className={index === 0 ? "text-ink" : ""}><span className={`mr-2 inline-block h-3.5 w-3.5 rounded-full border ${index === 0 ? "border-rust bg-rust/10" : "border-line"}`} />{step}</p>)}</div></div>}{success && <div className="mt-4 rounded-lg border border-forest/25 bg-forest/10 p-5"><p className="text-sm font-semibold text-forest">{success.title}</p><p className="mt-1 text-xs text-ink-soft">{success.count} questions generated successfully.</p><div className="mt-4 grid gap-2">{[[success.url, "Open Assessment"], [success.responseSheetUrl, "View Response Sheet"], [success.answerKeyUrl, "View Answer Key"]].filter(([url]) => url).map(([url, label]) => <a key={label} href={url || undefined} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between rounded border border-forest/20 bg-cream px-3 py-2 text-xs font-semibold text-forest hover:bg-cream-soft"><span>{label}</span><Icon name="arrow" className="h-3 w-3" /></a>)}</div>{success.deadline && <p className="mt-3 text-xs text-muted">Deadline: {new Date(success.deadline).toLocaleString()}</p>}</div>}</div></Card>
				</form>

				<aside className="flex min-w-0 flex-col gap-6 lg:order-0"><Card><CardHeader icon="file" title="AI Analysis" /><div className="p-6">{files.length ? <div className="space-y-4 text-xs">{[`${files.length} document${files.length === 1 ? "" : "s"} received`, "Reading course material", "Mapping topics and objectives", "Ready to generate"].map((step, index) => <p key={step} className={analysisStep >= index ? "text-forest" : "text-muted"}><span className={`mr-2 inline-grid h-4 w-4 place-items-center rounded-full border text-[10px] ${analysisStep >= index ? "border-forest bg-forest/10" : "border-line"}`}>{analysisStep > index ? "✓" : analysisStep === index ? "·" : ""}</span>{step}</p>)}</div> : <div className="py-4 text-center text-xs text-muted"><Icon name="file" className="mx-auto mb-3 h-8 w-8 text-muted/50" />Upload documents<br />to begin analysis</div>}</div></Card><Card><CardHeader icon="chart" title="Distribution" /><div className="space-y-4 p-6">{["Easy", "Medium", "Hard"].map((label, index) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="text-muted">{label}</span><strong>{distribution[index]}%</strong></div><div className="h-1 overflow-hidden rounded bg-ink/10"><div className="h-full rounded bg-rust transition-all" style={{ width: `${distribution[index]}%` }} /></div></div>)}<div className="grid grid-cols-3 gap-2 border-t border-line pt-5 text-center"><div><strong className="block text-lg">{questions}</strong><span className="text-[10px] uppercase text-muted">Questions</span></div><div><strong className="block text-lg">~{Math.ceil(questions * 0.75)}</strong><span className="text-[10px] uppercase text-muted">Minutes</span></div><div><strong className="block text-lg">{questions * 5}</strong><span className="text-[10px] uppercase text-muted">Points</span></div></div></div></Card><Card><CardHeader icon="clock" title="Recent" /> <div className="p-5">{history.length ? <div className="space-y-2">{history.slice(0, 3).map((item) => <a key={item.id} href={item.quizUrl || "#"} target={item.quizUrl ? "_blank" : undefined} rel="noopener noreferrer" className="block rounded-lg border border-line bg-cream-soft p-3 hover:border-rust"><strong className="block truncate text-xs">{item.title}</strong><span className="mt-1 block text-[10px] text-muted">{item.status === "processing" ? "Processing · " : ""}{item.questions} questions · {relativeTime(item.createdAt)}</span></a>)}<Link href="/history" className="block pt-2 text-center text-xs text-rust">View all →</Link></div> : <p className="py-3 text-center text-xs text-muted">No assessments yet.<br /><span className="text-[10px]">Your generated quizzes will appear here.</span></p>}</div></Card></aside>
			</main>
		</div>
	</AppShell>;
}
