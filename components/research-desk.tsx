"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  changedItems,
  getIntel,
  getRecentIntel,
  IntelItem,
  PUBLIC_MCP_URL,
  searchIntel,
} from "@/lib/vibeleaderboard";
import { isWebMcpAvailable, safeToolError, toolText } from "@/lib/webmcp";

type Evidence = IntelItem & { note?: string };
type BriefFinding = { claim: string; evidenceIds: string[] };
type Brief = {
  title: string;
  thesis: string;
  findings: BriefFinding[];
  openQuestions: string[];
};

const SAMPLE_QUESTIONS = [
  "What is changing in agent harness design?",
  "How are teams evaluating long-running coding agents?",
  "Which new tools make agent work more observable?",
];

const shortDate = (value?: string | null) => {
  if (!value) return "DATE N/A";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? "DATE N/A"
    : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })
        .format(date)
        .toUpperCase();
};

const getItemUrl = (item: IntelItem) => item.intel_page ?? item.source_url ?? item.url ?? "#";
const getItemKind = (item: IntelItem) => item.medium ?? item.intel_kind ?? item.kind ?? item.category ?? "INTEL";

export function ResearchDesk() {
  const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0]);
  const [results, setResults] = useState<IntelItem[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webMcp, setWebMcp] = useState<"checking" | "ready" | "unavailable">("checking");
  const [activity, setActivity] = useState<string[]>(["Desk opened. Waiting for a research question."]);

  const resultsRef = useRef(results);
  const evidenceRef = useRef(evidence);
  useEffect(() => void (resultsRef.current = results), [results]);
  useEffect(() => void (evidenceRef.current = evidence), [evidence]);

  const log = useCallback((message: string) => {
    setActivity((current) => [message, ...current].slice(0, 7));
  }, []);

  const runSearch = useCallback(async (nextQuestion: string, limit = 8) => {
    const clean = nextQuestion.trim();
    if (!clean) throw new Error("A research question is required.");
    setBusy(true);
    setError(null);
    try {
      const response = await searchIntel(clean, limit);
      setQuestion(clean);
      setResults(response.items);
      log(`Searched public Intel for “${clean}” — ${response.items.length} signals found.`);
      return response;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Search failed.";
      setError(message);
      throw cause;
    } finally {
      setBusy(false);
    }
  }, [log]);

  const pinItem = useCallback(async (id: string, note = "") => {
    let item = [...resultsRef.current, ...evidenceRef.current].find((candidate) => candidate.id === id);
    if (!item) item = await getIntel(id);
    if (!item?.id) throw new Error(`No public Intel item found for ${id}.`);

    const pinned = { ...item, note: note.trim() || undefined };
    setEvidence((current) => {
      const without = current.filter((candidate) => candidate.id !== id);
      return [...without, pinned];
    });
    log(`Pinned “${item.title}” to the evidence ledger.`);
    return pinned;
  }, [log]);

  useEffect(() => {
    if (!isWebMcpAvailable()) {
      setWebMcp("unavailable");
      return;
    }

    const controller = new AbortController();
    const register = async () => {
      const tools: WebMcpTool[] = [
        {
          name: "search_vibe_intel",
          description: "Search VibeLeaderboard's public Intel index for current evidence about AI engineering, coding agents, models, frameworks, and developer tools. Results are summaries and citations, never source transcripts.",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "A plain-English research question" },
              limit: { type: "integer", minimum: 1, maximum: 12, default: 8 },
            },
            required: ["query"],
          },
          execute: async (input) => {
            try {
              const query = String(input.query ?? "");
              const limit = Math.min(12, Math.max(1, Number(input.limit ?? 8)));
              const response = await runSearch(query, limit);
              return toolText({
                query: response.query,
                resultCount: response.items.length,
                items: response.items,
                instruction: "Use pin_vibe_evidence to place relevant items in the visible evidence ledger.",
              });
            } catch (cause) {
              return safeToolError(cause);
            }
          },
        },
        {
          name: "show_recent_vibe_intel",
          description: "Show Intel accepted recently by VibeLeaderboard. Useful for answering what changed while the user was away.",
          inputSchema: {
            type: "object",
            properties: {
              since: { type: "string", description: "Optional ISO 8601 timestamp, at most 30 days ago" },
              limit: { type: "integer", minimum: 1, maximum: 20, default: 12 },
            },
          },
          execute: async (input) => {
            try {
              setBusy(true);
              const response = await getRecentIntel(
                typeof input.since === "string" ? input.since : undefined,
                Math.min(20, Math.max(1, Number(input.limit ?? 12)))
              );
              const items = changedItems(response);
              setResults(items);
              log(`Loaded ${items.length} recent public Intel signals.`);
              return toolText({ items, since: response.since, resultCount: items.length });
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : "Recent Intel failed.");
              return safeToolError(cause);
            } finally {
              setBusy(false);
            }
          },
        },
        {
          name: "pin_vibe_evidence",
          description: "Pin a public Intel result to the user's visible evidence ledger. Only pin items that directly support the research question.",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Intel UUID returned by a search or recent-results tool" },
              note: { type: "string", description: "Optional concise reason this evidence matters" },
            },
            required: ["id"],
          },
          execute: async (input) => {
            try {
              const pinned = await pinItem(String(input.id ?? ""), String(input.note ?? ""));
              return toolText({ pinned, evidenceCount: evidenceRef.current.length + 1 });
            } catch (cause) {
              return safeToolError(cause);
            }
          },
        },
        {
          name: "remove_vibe_evidence",
          description: "Remove an Intel item from the user's evidence ledger.",
          inputSchema: {
            type: "object",
            properties: { id: { type: "string", description: "Pinned Intel UUID" } },
            required: ["id"],
          },
          execute: async (input) => {
            const id = String(input.id ?? "");
            setEvidence((current) => current.filter((item) => item.id !== id));
            log(`Removed one item from the evidence ledger.`);
            return toolText({ removed: id });
          },
        },
        {
          name: "draft_cited_vibe_brief",
          description: "Render a concise research brief in the page using only evidence already pinned by the user or agent. Every finding must cite one or more pinned Intel UUIDs.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              thesis: { type: "string" },
              findings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    claim: { type: "string" },
                    evidenceIds: { type: "array", items: { type: "string" } },
                  },
                  required: ["claim", "evidenceIds"],
                },
              },
              openQuestions: { type: "array", items: { type: "string" } },
            },
            required: ["title", "thesis", "findings"],
          },
          execute: async (input) => {
            try {
              const findings = Array.isArray(input.findings) ? input.findings as BriefFinding[] : [];
              const pinnedIds = new Set(evidenceRef.current.map((item) => item.id));
              const missing = findings.flatMap((finding) => finding.evidenceIds ?? []).filter((id) => !pinnedIds.has(id));
              if (missing.length) throw new Error(`Brief cites unpinned evidence: ${[...new Set(missing)].join(", ")}`);
              const nextBrief: Brief = {
                title: String(input.title ?? "Research brief"),
                thesis: String(input.thesis ?? ""),
                findings,
                openQuestions: Array.isArray(input.openQuestions) ? input.openQuestions.map(String) : [],
              };
              setBrief(nextBrief);
              log(`Drafted “${nextBrief.title}” from ${pinnedIds.size} pinned sources.`);
              return toolText({ rendered: true, findingCount: findings.length, evidenceCount: pinnedIds.size });
            } catch (cause) {
              return safeToolError(cause);
            }
          },
        },
      ];

      try {
        await Promise.all(tools.map((tool) => document.modelContext!.registerTool(tool, { signal: controller.signal })));
        setWebMcp("ready");
        log(`${tools.length} WebMCP tools registered with the browser.`);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setWebMcp("unavailable");
          setError(cause instanceof Error ? cause.message : "WebMCP registration failed.");
        }
      }
    };
    void register();
    return () => controller.abort();
  }, [log, pinItem, runSearch]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await runSearch(question);
    } catch {
      // Error is already visible in the desk.
    }
  };

  const evidenceById = useMemo(() => new Map(evidence.map((item) => [item.id, item])), [evidence]);

  return (
    <main>
      <header className="masthead">
        <a className="wordmark" href="https://www.vibeleaderboard.ai/intel" target="_blank" rel="noreferrer">
          VIBE <i>INTEL</i> DESK
        </a>
        <div className="edition">PUBLIC RESEARCH WORKSPACE / WEBMCP EDITION</div>
        <div className={`status status-${webMcp}`}>
          <span aria-hidden="true" />
          {webMcp === "ready" ? "AGENT CONNECTED" : webMcp === "checking" ? "CHECKING WEBMCP" : "MANUAL MODE"}
        </div>
      </header>

      <section className="intro">
        <div>
          <p className="eyebrow">A SHARED DESK FOR HUMAN + AGENT RESEARCH</p>
          <h1>Turn a noisy ecosystem into cited working intelligence.</h1>
        </div>
        <p className="dek">
          Ask what is changing in agentic engineering. Your browser agent can search VibeLeaderboard’s public Intel,
          place evidence on this page, and draft a brief you can audit source by source.
        </p>
      </section>

      <form className="question-bar" onSubmit={submit}>
        <label htmlFor="research-question">RESEARCH QUESTION</label>
        <div className="question-row">
          <input
            id="research-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="What do you want to understand?"
          />
          <button disabled={busy}>{busy ? "SEARCHING…" : "SEARCH INTEL"}</button>
        </div>
        <div className="suggestions">
          {SAMPLE_QUESTIONS.map((sample) => (
            <button type="button" key={sample} onClick={() => setQuestion(sample)}>{sample}</button>
          ))}
        </div>
      </form>

      {error && <div className="error" role="alert">{error}</div>}

      <div className="desk-grid">
        <section className="signal-column" aria-labelledby="signals-heading">
          <div className="section-head">
            <div>
              <span>01 / DISCOVERY</span>
              <h2 id="signals-heading">Signal stack</h2>
            </div>
            <b>{results.length.toString().padStart(2, "0")} ITEMS</b>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <span>NO SIGNALS ON THE DESK</span>
              <p>Search manually, or ask your browser agent to use <code>search_vibe_intel</code>.</p>
            </div>
          ) : (
            <ol className="signal-list">
              {results.map((item, index) => {
                const pinned = evidence.some((entry) => entry.id === item.id);
                return (
                  <li key={item.id} className="signal-card">
                    <div className="signal-number">{String(index + 1).padStart(2, "0")}</div>
                    <article>
                      <div className="meta">
                        <span>{getItemKind(item)}</span>
                        <span>{shortDate(item.published_at ?? item.created_at)}</span>
                        {item.relevance != null && <span>{Math.round(item.relevance * 100)}% MATCH</span>}
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.summary ?? item.description ?? item.why ?? "Open the cited Intel page for the editorial summary."}</p>
                      <div className="card-actions">
                        <button disabled={pinned} onClick={() => void pinItem(item.id)}>
                          {pinned ? "PINNED ✓" : "+ PIN EVIDENCE"}
                        </button>
                        <a href={getItemUrl(item)} target="_blank" rel="noreferrer">OPEN CITATION ↗</a>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <aside className="ledger" aria-labelledby="ledger-heading">
          <div className="section-head light">
            <div>
              <span>02 / SYNTHESIS</span>
              <h2 id="ledger-heading">Evidence ledger</h2>
            </div>
            <b>{evidence.length.toString().padStart(2, "0")} PINNED</b>
          </div>

          {evidence.length === 0 ? (
            <div className="ledger-empty">Pin the signals that deserve to shape the answer. The agent can do this with you.</div>
          ) : (
            <ul className="evidence-list">
              {evidence.map((item) => (
                <li key={item.id}>
                  <span>{getItemKind(item)} / {item.source_author ?? item.domain ?? "VIBE INTEL"}</span>
                  <a href={getItemUrl(item)} target="_blank" rel="noreferrer">{item.title}</a>
                  {item.note && <p>{item.note}</p>}
                  <button onClick={() => setEvidence((current) => current.filter((entry) => entry.id !== item.id))}>REMOVE</button>
                </li>
              ))}
            </ul>
          )}

          <div className="brief-block">
            <span className="brief-label">03 / AGENT DRAFT — VERIFY BEFORE USE</span>
            {brief ? (
              <article className="brief">
                <h2>{brief.title}</h2>
                <p className="thesis">{brief.thesis}</p>
                <ol>
                  {brief.findings.map((finding, index) => (
                    <li key={`${finding.claim}-${index}`}>
                      <p>{finding.claim}</p>
                      <div className="citations">
                        {finding.evidenceIds.map((id) => {
                          const item = evidenceById.get(id);
                          return item ? <a key={id} href={getItemUrl(item)} target="_blank" rel="noreferrer">[{item.title}]</a> : null;
                        })}
                      </div>
                    </li>
                  ))}
                </ol>
                {brief.openQuestions.length > 0 && (
                  <div className="open-questions">
                    <span>OPEN QUESTIONS</span>
                    {brief.openQuestions.map((item) => <p key={item}>— {item}</p>)}
                  </div>
                )}
              </article>
            ) : (
              <div className="draft-empty">
                <p>Once evidence is pinned, ask your agent to draft a cited brief on the page.</p>
                <code>draft_cited_vibe_brief</code>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="activity-strip">
        <div>
          <span>LIVE DESK LOG</span>
          <p>{activity[0]}</p>
        </div>
        <div className="source-note">
          <span>DATA BOUNDARY</span>
          <p>Public summaries + citations via <a href={PUBLIC_MCP_URL} target="_blank" rel="noreferrer">VibeLeaderboard MCP</a>. No transcripts. No private credentials.</p>
        </div>
      </section>

      <footer>
        <span>VIBE INTEL DESK / OPEN-SOURCE WEBMCP CLIENT</span>
        <a href="https://www.vibeleaderboard.ai" target="_blank" rel="noreferrer">DATA BY VIBELEADERBOARD ↗</a>
      </footer>
    </main>
  );
}
