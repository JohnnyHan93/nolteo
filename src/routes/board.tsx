import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { POST_TAGS } from "@/lib/yard/catalog";
import { formatWhen } from "@/lib/yard/types";

export const Route = createFileRoute("/board")({ component: BoardPage });

function BoardPage() {
  const { posts, addPost, busy, error } = useYard();
  const [nick, setNick] = useState("");
  const [tag, setTag] = useState<(typeof POST_TAGS)[number]>("잡담");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="split">
      <section>
        <h1 className="page-title">익명 게시판</h1>
        <p className="note">로그인 없다. 별명만 적고, 홍보·리뷰·질문·팁을 남긴다.</p>
        {posts.map((post) => (
          <Link key={post.id} to="/board/$id" params={{ id: post.id }} className="post">
            <div className="soft">{post.tag} · {post.nick} · {formatWhen(post.created)}</div>
            <h3>{post.title}</h3>
            <p>{post.body.slice(0, 90)}</p>
            <div className="soft">의견 {post.comments.length}</div>
          </Link>
        ))}
      </section>
      <form
        className="panel stack"
        onSubmit={(event) => {
          event.preventDefault();
          void addPost({ nick, tag, title, body }).then((ok) => {
            if (!ok) return;
            setTitle("");
            setBody("");
          });
        }}
      >
        <h2>글쓰기</h2>
        <label className="field">
          <span>별명</span>
          <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="비우면 익명" maxLength={24} />
        </label>
        <label className="field">
          <span>분류</span>
          <select value={tag} onChange={(event) => setTag(event.target.value as (typeof POST_TAGS)[number])}>
            {POST_TAGS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>제목</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} required />
        </label>
        <label className="field">
          <span>내용</span>
          <textarea rows={6} value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} required />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>올리기</button>
      </form>
    </div>
  );
}
