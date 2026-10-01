import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { formatWhen } from "@/lib/yard/types";

export const Route = createFileRoute("/board/$id")({ component: PostPage });

function PostPage() {
  const { id } = Route.useParams();
  const { posts, addComment, busy, error } = useYard();
  const post = posts.find((item) => item.id === id);
  const [nick, setNick] = useState("");
  const [body, setBody] = useState("");

  if (!post) {
    return (
      <article className="panel">
        <p>글이 없다.</p>
        <Link to="/board">게시판으로</Link>
      </article>
    );
  }

  return (
    <article className="panel stack">
      <Link to="/board">게시판으로</Link>
      <div className="soft">{post.tag} · {post.nick} · {formatWhen(post.created)}</div>
      <h1>{post.title}</h1>
      <p className="keep">{post.body}</p>
      <h3>의견 {post.comments.length}</h3>
      {post.comments.map((comment) => (
        <div key={comment.id} className="post">
          <b>{comment.nick}</b>
          <span className="soft"> · {formatWhen(comment.created)}</span>
          <p className="keep">{comment.body}</p>
        </div>
      ))}
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          void addComment({ postId: post.id, nick, body }).then((ok) => {
            if (ok) setBody("");
          });
        }}
      >
        <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="별명" maxLength={24} aria-label="별명" />
        <textarea rows={3} value={body} onChange={(event) => setBody(event.target.value)} placeholder="한 줄 의견" maxLength={1000} aria-label="의견" />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>달기</button>
      </form>
    </article>
  );
}
