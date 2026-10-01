import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { hostOf } from "@/lib/yard/catalog";
import { formatWhen } from "@/lib/yard/types";

export const Route = createFileRoute("/item/$id")({ component: ItemPage });

function ItemPage() {
  const { id } = Route.useParams();
  const { catalog, snapshot, openItem, addReview, busy, error } = useYard();
  const item = catalog.find((entry) => entry.id === id);
  const reviews = snapshot.reviews[id] ?? [];
  const [nick, setNick] = useState("");
  const [text, setText] = useState("");
  const [score, setScore] = useState(5);

  if (!item) {
    return (
      <article className="panel">
        <p>없는 놀이다.</p>
        <Link to="/">놀이로</Link>
      </article>
    );
  }

  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <article className="panel stack">
      <Link to="/">놀이로</Link>
      <div className="soft">{item.by} · 오늘 {item.stats.day.toLocaleString("ko-KR")}회{average ? ` · 리뷰 ${average}` : ""}</div>
      <h1>{item.title}</h1>
      <p>{item.blurb}</p>
      <p className="soft">{hostOf(item.href)}</p>
      <p>
        <button type="button" className="btn" onClick={() => openItem(item)}>들어가기</button>
      </p>
      {item.github ? <p><a href={item.github} target="_blank" rel="noreferrer">깃허브</a></p> : null}
      <h3>리뷰</h3>
      {reviews.length === 0 ? <p className="note">아직 리뷰가 없다.</p> : null}
      {reviews.map((review) => (
        <div key={review.id} className="post">
          <b>{review.nick} · {review.score}점</b>
          <span className="soft"> · {formatWhen(review.created)}</span>
          <p className="keep">{review.text}</p>
        </div>
      ))}
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          void addReview({ itemId: item.id, nick, score, text }).then((ok) => {
            if (ok) setText("");
          });
        }}
      >
        <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="별명" maxLength={24} aria-label="별명" />
        <select value={score} onChange={(event) => setScore(Number(event.target.value))} aria-label="점수">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}점</option>)}
        </select>
        <textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="해본 느낌" maxLength={1000} aria-label="리뷰" />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>리뷰 남기기</button>
      </form>
    </article>
  );
}
