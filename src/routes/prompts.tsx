import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { ZERO } from "@/lib/yard/types";

export const Route = createFileRoute("/prompts")({ component: PromptsPage });

const periods = [
  { id: "day", label: "오늘" },
  { id: "week", label: "이번 주" },
  { id: "month", label: "이번 달" },
  { id: "all", label: "전체" },
] as const;

function PromptsPage() {
  const { prompts, snapshot, record, addPrompt, busy, error } = useYard();
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("day");
  const [openId, setOpenId] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [nick, setNick] = useState("");
  const [title, setTitle] = useState("");
  const [model, setModel] = useState("범용");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  const ranked = useMemo(() => {
    return [...prompts].sort((a, b) => {
      const diff = (snapshot.clicks[b.id] ?? ZERO)[period] - (snapshot.clicks[a.id] ?? ZERO)[period];
      if (diff !== 0) return diff;
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
  }, [prompts, snapshot.clicks, period]);
  const open = ranked.find((prompt) => prompt.id === openId) ?? null;

  function show(id: string) {
    setWriting(false);
    setCopied(false);
    setOpenId(id);
    record(id);
  }

  return (
    <section className="board-page">
      <header className="board-head">
        <div>
          <h1 className="page-title">AI 프롬프트</h1>
          <p className="note">열어 본 횟수로 오늘, 이번 주, 이번 달 순위가 매겨져요. 본문은 제목을 눌러 보세요.</p>
        </div>
        {writing || open ? (
          <button type="button" className="btn-ghost" onClick={() => { setWriting(false); setOpenId(null); }}>목록</button>
        ) : (
          <button type="button" className="btn" onClick={() => setWriting(true)}>프롬프트 올리기</button>
        )}
      </header>

      {writing ? (
        <form
          className="panel stack"
          onSubmit={(event) => {
            event.preventDefault();
            void addPrompt({ nick, title, model, body }).then((ok) => {
              if (!ok) return;
              setTitle("");
              setBody("");
              setWriting(false);
            });
          }}
        >
          <h2>새 프롬프트</h2>
          <label className="field">
            <span>별명</span>
            <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="비우면 익명" maxLength={24} />
          </label>
          <label className="field">
            <span>제목</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="무슨 문장인지" maxLength={80} required />
          </label>
          <label className="field">
            <span>모델</span>
            <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="범용" maxLength={40} />
          </label>
          <label className="field">
            <span>본문</span>
            <textarea rows={8} value={body} onChange={(event) => setBody(event.target.value)} placeholder="그대로 붙여 넣을 문장" maxLength={4000} required />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>등록</button>
        </form>
      ) : open ? (
        <article className="thread">
          <header className="thread-head">
            <span className="board-tag">{open.model || "범용"}</span>
            <h1>{open.title}</h1>
            <dl>
              <div><dt>글쓴이</dt><dd>{open.nick}</dd></div>
              <div><dt>오늘</dt><dd>{(snapshot.clicks[open.id] ?? ZERO).day.toLocaleString("ko-KR")}회</dd></div>
              <div><dt>전체</dt><dd>{(snapshot.clicks[open.id] ?? ZERO).all.toLocaleString("ko-KR")}회</dd></div>
            </dl>
          </header>
          <div className="thread-body keep">{open.body || "본문이 비어 있어요."}</div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              void navigator.clipboard.writeText(open.body).then(() => setCopied(true)).catch(() => setCopied(false));
            }}
          >
            {copied ? "복사했어요" : "본문 복사"}
          </button>
        </article>
      ) : (
        <>
          <div className="tabs">
            {periods.map((item) => (
              <button
                key={item.id}
                type="button"
                className={period === item.id ? "chip on" : "chip"}
                onClick={() => setPeriod(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="list">
            {ranked.map((prompt, index) => (
              <article key={prompt.id} className="rank">
                <b className={index === 0 ? "place-1" : undefined}>{index + 1}</b>
                <div>
                  <strong>{prompt.title}</strong>
                  <div className="soft">{prompt.model || "범용"} · {prompt.nick}</div>
                </div>
                <div className="rank-actions">
                  <div>{(snapshot.clicks[prompt.id] ?? ZERO)[period].toLocaleString("ko-KR")}회</div>
                  <button type="button" className="btn" onClick={() => show(prompt.id)}>본문</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
