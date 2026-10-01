import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { shareCategories } from "@/lib/yard/catalog";
import type { YardCategory } from "@/lib/yard/types";

export const Route = createFileRoute("/share")({ component: SharePage });

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
      <h1>놀이 올리기</h1>
      <p className="note">주소만 올린다. 파일은 받지 않는다. 웹게임, 심리테스트, 낙서, 계산기, 만든 앱이 광장과 랭킹에 붙고, 리뷰를 받는다.</p>
      <label className="field">
        <span>별명</span>
        <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="비우면 익명" maxLength={24} />
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
        <input value={blurb} onChange={(event) => setBlurb(event.target.value)} maxLength={200} placeholder="무슨 놀이인지" />
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
        <input value={github} onChange={(event) => setGithub(event.target.value)} placeholder="없으면 비워 둠" maxLength={300} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn" type="submit" disabled={busy}>광장에 넣기</button>
      {done ? <p>넣었다. <Link to="/">광장</Link> 맨 앞에서 보인다.</p> : null}
    </form>
  );
}