import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { useOwner } from "@/lib/owner";

export const Route = createFileRoute("/tips")({ component: TipsPage });

function TipsPage() {
  const { tips, addTip, busy, error } = useYard();
  const owner = useOwner();
  const visible = tips.filter((tip) => {
    if (owner) return true;
    return !/애드센스|ads\.txt|VITE_ADSENSE|광고 자리/i.test(`${tip.title} ${tip.body}`);
  });
  const [nick, setNick] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [github, setGithub] = useState("");

  return (
    <div className="split">
      <section>
        <h1 className="page-title">만드는 팁</h1>
        <p className="note">화면을 어떻게 잡았는지, 저장소는 어디인지 짧게 남겨 보세요.</p>
        {visible.map((tip) => (
          <article key={tip.id} className="post">
            <div className="soft">{tip.nick}</div>
            <h3>{tip.title}</h3>
            <p className="keep">{tip.body}</p>
            {tip.github ? <a href={tip.github} target="_blank" rel="noreferrer">저장소 보러 가기</a> : null}
          </article>
        ))}
      </section>
      <form
        className="panel stack"
        onSubmit={(event) => {
          event.preventDefault();
          void addTip({ nick, title, body, github }).then((ok) => {
            if (!ok) return;
            setTitle("");
            setBody("");
            setGithub("");
          });
        }}
      >
        <h2>팁 남기기</h2>
        <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="별명" maxLength={24} aria-label="별명" />
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목" maxLength={80} aria-label="제목" required />
        <textarea rows={5} value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} aria-label="팁" required />
        <input value={github} onChange={(event) => setGithub(event.target.value)} placeholder="깃허브 주소" maxLength={300} aria-label="깃허브" />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>팁 남기기</button>
      </form>
    </div>
  );
}
