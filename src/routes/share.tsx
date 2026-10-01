import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { shareCategories } from "@/lib/yard/catalog";
import type { YardCategory } from "@/lib/yard/types";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "놀이 올리기 — 놀터" },
      { name: "description", content: "만든 웹게임, 심리테스트, 도구 주소를 놀터 광장에 올려요." },
    ],
  }),
  component: SharePage,
});

function SharePage() {
  const { addExtra, busy, error } = useYard();
  const [nick, setNick] = useState("");
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");
  const [blurb, setBlurb] = useState("");
  const [github, setGithub] = useState("");
  const [category, setCategory] = useState<YardCategory>("game");
  const [done, setDone] = useState(false);

  return (
    <form
      className="panel stack"
      onSubmit={(event) => {
        event.preventDefault();
        void addExtra({ nick, title, href, blurb, github, category }).then((ok) => {
          if (!ok) return;
          setDone(true);
          setTitle("");
          setHref("");
          setBlurb("");
          setGithub("");
        });
      }}
    >
      <h1>내 놀이 올리기</h1>
      <p className="note">파일은 받지 않아요. 주소만 올리면 광장과 순위에 바로 붙고, 다른 사람이 한 줄 리뷰를 남길 수 있어요.</p>
      <label className="field">
        <span>별명</span>
        <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="비워도 돼요. 익명으로 올라가요" maxLength={24} />
      </label>
      <label className="field">
        <span>이름</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} required />
      </label>
      <label className="field">
        <span>주소</span>
        <input value={href} onChange={(event) => setHref(event.target.value)} placeholder="https://" maxLength={300} required />
      </label>
      <label className="field">
        <span>한 줄</span>
        <input value={blurb} onChange={(event) => setBlurb(event.target.value)} maxLength={200} placeholder="어떤 놀이인지 한 줄로" />
      </label>
      <label className="field">
        <span>분류</span>
        <select value={category} onChange={(event) => setCategory(event.target.value as YardCategory)}>
          {shareCategories.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>깃허브</span>
        <input value={github} onChange={(event) => setGithub(event.target.value)} placeholder="없으면 비워 두세요" maxLength={300} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn" type="submit" disabled={busy}>광장에 올리기</button>
      {done ? <p>올렸어요. <Link to="/">광장</Link> 맨 앞에서 바로 보여요.</p> : null}
    </form>
  );
}