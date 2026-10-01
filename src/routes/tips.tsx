import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { useOwner } from "@/lib/owner";
import { ZERO } from "@/lib/yard/types";

export const Route = createFileRoute("/tips")({ component: TipsPage });

const periods = [
  { id: "day", label: "오늘" },
  { id: "week", label: "이번 주" },
  { id: "month", label: "이번 달" },
  { id: "all", label: "전체" },
] as const;

function TipsPage() {
  const { tips, snapshot, record, addTip, busy, error } = useYard();
  const owner = useOwner();
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("day");
  const [openId, setOpenId] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [nick, setNick] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [github, setGithub] = useState("");

  const visible = useMemo(() => {
    return tips.filter((tip) => owner || !/애드센스|ads\.txt|VITE_ADSENSE|광고 자리/i.test(`${tip.title} ${tip.body}`));
  }, [tips, owner]);
  const ranked = useMemo(() => {
    return [...visible].sort((a, b) => {
      const diff = (snapshot.clicks[b.id] ?? ZERO)[period] - (snapshot.clicks[a.id] ?? ZERO)[period];
      if (diff !== 0) return diff;
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
  }, [visible, snapshot.clicks, period]);
  const open = ranked.find((tip) => tip.id === openId) ?? null;

  function show(id: string) {
    setWriting(false);
    setOpenId(id);
    record(id);
  }

  return (
    <section className="board-page">
      <header className="board-head">
        <div>
          <h1 className="page-title">만드는 팁</h1>
          <p className="note">열어 본 횟수로 오늘, 이번 주, 이번 달 순위가 매겨져요. 본문은 제목 옆 버튼으로 열어요.</p>
        </div>
        {writing || open ? (
          <button type="button" className="btn-ghost" onClick={() => { setWriting(false); setOpenId(null); }}>목록</button>
        ) : (
          <button type="button" className="btn" onClick={() => setWriting(true)}>팁 올리기</button>
        )}
      </header>

      {writing ? (
        <form
          className="panel stack"
          onSubmit={(event) => {
            event.preventDefault();
            void addTip({ nick, title, body, github }).then((ok) => {
              if (!ok) return;
              setTitle("");
              setBody("");
              setGithub("");
              setWriting(false);
            });
          }}
        >
          <h2>새 팁</h2>
          <label className="field">
            <span>별명</span>
            <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="비우면 익명" maxLength={24} />
          </label>
          <label className="field">
            <span>제목</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} required />
          </label>
          <label className="field">
            <span>본문</span>
            <textarea rows={7} value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} required />
          </label>
          <label className="field">
            <span>깃허브</span>
            <input value={github} onChange={(event) => setGithub(event.target.value)} placeholder="없으면 비워 두세요" maxLength={300} />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>등록</button>
        </form>
      ) : open ? (
        <article className="thread">
          <header className="thread-head">
            <h1>{open.title}</h1>
            <dl>
              <div><dt>글쓴이</dt><dd>{open.nick}</dd></div>
              <div><dt>오늘</dt><dd>{(snapshot.clicks[open.id] ?? ZERO).day.toLocaleString("ko-KR")}회</dd></div>
              <div><dt>전체</dt><dd>{(snapshot.clicks[open.id] ?? ZERO).all.toLocaleString("ko-KR")}회</dd></div>
            </dl>
          </header>
          <div className="thread-body keep">{open.body || "본문이 비어 있어요."}</div>
          {open.github ? <p><a href={open.github} target="_blank" rel="noreferrer">저장소 보러 가기</a></p> : null}
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
            {ranked.map((tip, index) => (
              <article key={tip.id} className="rank">
                <b className={index === 0 ? "place-1" : undefined}>{index + 1}</b>
                <div>
                  <strong>{tip.title}</strong>
                  <div className="soft">{tip.nick}</div>
                </div>
                <div className="rank-actions">
                  <div>{(snapshot.clicks[tip.id] ?? ZERO)[period].toLocaleString("ko-KR")}회</div>
                  <button type="button" className="btn" onClick={() => show(tip.id)}>본문</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
