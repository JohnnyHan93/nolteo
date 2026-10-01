import { useMemo, useState } from "react";
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
  const comments = useMemo(() => {
    if (!post) return [];
    return [...post.comments].sort(
      (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
    );
  }, [post]);

  if (!post) {
    return (
      <article className="panel">
        <p>이 글을 찾지 못했어요.</p>
        <Link to="/board">목록으로</Link>
      </article>
    );
  }

  return (
    <article className="thread">
      <p className="crumb">
        <Link to="/board">게시판</Link>
        <span aria-hidden="true"> / </span>
        <span>{post.tag}</span>
      </p>
      <header className="thread-head">
        <span className="board-tag">{post.tag}</span>
        <h1>{post.title}</h1>
        <dl>
          <div><dt>글쓴이</dt><dd>{post.nick}</dd></div>
          <div><dt>작성</dt><dd>{formatWhen(post.created)}</dd></div>
          <div><dt>댓글</dt><dd>{comments.length}</dd></div>
        </dl>
      </header>
      <div className="thread-body keep">{post.body.trim() ? post.body : "본문이 비어 있어요."}</div>

      <section className="replies" aria-label="댓글">
        <h2>댓글 {comments.length}</h2>
        {comments.length === 0 ? <p className="note">아직 댓글이 없어요. 첫 댓글을 남겨 보세요.</p> : null}
        <ol>
          {comments.map((comment, index) => (
            <li key={comment.id}>
              <div className="reply-meta">
                <b>{index + 1}</b>
                <strong>{comment.nick}</strong>
                <time dateTime={comment.created}>{formatWhen(comment.created)}</time>
              </div>
              <p className="keep">{comment.body}</p>
            </li>
          ))}
        </ol>
        <form
          className="stack reply-form"
          onSubmit={(event) => {
            event.preventDefault();
            void addComment({ postId: post.id, nick, body }).then((ok) => {
              if (ok) setBody("");
            });
          }}
        >
          <h3>댓글 쓰기</h3>
          <label className="field">
            <span>별명</span>
            <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="비우면 익명" maxLength={24} />
          </label>
          <label className="field">
            <span>내용</span>
            <textarea rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="이 글에 대한 답을 적어 주세요" maxLength={1000} required />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>댓글 등록</button>
        </form>
      </section>
    </article>
  );
}
