import { useMemo, useState } from "react";
import { Outlet, createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useYard } from "@/components/yard";
import { POST_TAGS } from "@/lib/yard/catalog";
import { formatWhen } from "@/lib/yard/types";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "게시판 — 놀터" },
      { name: "description", content: "놀터 게시판. 잡담, 홍보, 리뷰, 질문, 팁을 올리고 댓글을 남겨요." },
    ],
  }),
  component: BoardPage,
});

const boards = [
  { id: "all", label: "전체", blurb: "올라온 글을 한곳에서 봐요." },
  { id: "잡담", label: "잡담", blurb: "심심할 때 아무 말이나 남겨요." },
  { id: "홍보", label: "홍보", blurb: "만든 놀이나 사이트를 알려요." },
  { id: "리뷰", label: "리뷰", blurb: "직접 해 본 감상을 적어요." },
  { id: "질문", label: "질문", blurb: "막힌 것을 물어봐요. 댓글로 답이 달려요." },
  { id: "팁", label: "팁", blurb: "짧게 도움이 되는 방법을 나눠요." },
] as const;

function BoardPage() {
  const { posts, addPost, busy, error } = useYard();
  const [nick, setNick] = useState("");
  const [tag, setTag] = useState<(typeof POST_TAGS)[number]>("잡담");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [board, setBoard] = useState<(typeof boards)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const [writing, setWriting] = useState(false);

  const current = boards.find((item) => item.id === board) ?? boards[0];
  const query = q.trim().toLowerCase();
  const rows = useMemo(() => {
    const filtered = posts.filter((post) => {
      const boardOk = board === "all" || post.tag === board;
      const hay = `${post.title} ${post.body} ${post.nick}`.toLowerCase();
      return boardOk && hay.includes(query);
    });
    return filtered.map((post, index) => ({ post, no: filtered.length - index }));
  }, [posts, board, query]);

  const onPost = useRouterState({
    select: (state) => /^\/board\/[^/]+/.test(state.location.pathname),
  });
  if (onPost) return <Outlet />;

  return (
    <section className="board-page">
      <header className="board-head">
        <div>
          <h1 className="page-title">게시판</h1>
          <p className="note">{current.blurb} 로그인 없이 별명만 적으면 돼요.</p>
        </div>
        {writing ? (
          <button type="button" className="btn-ghost" onClick={() => setWriting(false)}>목록</button>
        ) : (
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (board !== "all") setTag(board);
              setWriting(true);
            }}
          >
            글쓰기
          </button>
        )}
      </header>

      <div className="tabs" role="tablist" aria-label="게시판 종류">
        {boards.map((item) => (
          <button
            key={item.id}
            type="button"
            className={board === item.id ? "chip on" : "chip"}
            onClick={() => setBoard(item.id)}
          >
            {item.label}
            <span className="count">
              {item.id === "all" ? posts.length : posts.filter((post) => post.tag === item.id).length}
            </span>
          </button>
        ))}
      </div>

      {writing ? (
        <form
          className="panel stack"
          onSubmit={(event) => {
            event.preventDefault();
            void addPost({ nick, tag, title, body }).then((ok) => {
              if (!ok) return;
              setTitle("");
              setBody("");
              setBoard(tag);
              setWriting(false);
            });
          }}
        >
          <h2>새 글</h2>
          <p className="note">제목과 본문을 나누어 적어요. 올린 뒤에는 댓글을 받을 수 있어요.</p>
          <label className="field">
            <span>게시판</span>
            <select value={tag} onChange={(event) => setTag(event.target.value as (typeof POST_TAGS)[number])}>
              {POST_TAGS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">
            <span>별명</span>
            <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="비우면 익명" maxLength={24} />
          </label>
          <label className="field">
            <span>제목</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} required placeholder="한 줄로 무슨 글인지" />
          </label>
          <label className="field">
            <span>본문</span>
            <textarea rows={8} value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} required placeholder="하고 싶은 말을 적어 주세요" />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <div className="hero-actions">
            <button className="btn" type="submit" disabled={busy}>등록</button>
            <button className="btn-ghost" type="button" onClick={() => setWriting(false)}>취소</button>
          </div>
        </form>
      ) : (
        <>
          <div className="board-tools">
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="제목, 본문, 별명"
              aria-label="글 찾기"
            />
            <span className="note">{rows.length}개</span>
          </div>
          <div className="board-sheet">
            <table className="board-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>게시판</th>
                  <th>제목</th>
                  <th>글쓴이</th>
                  <th>작성</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ post, no }) => (
                  <tr key={post.id}>
                    <td className="num">{no}</td>
                    <td><span className="board-tag">{post.tag}</span></td>
                    <td className="subject">
                      <Link to="/board/$id" params={{ id: post.id }}>
                        {post.title}
                        {post.comments.length > 0 ? <em>[{post.comments.length}]</em> : null}
                      </Link>
                    </td>
                    <td>{post.nick}</td>
                    <td className="when">{formatWhen(post.created)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 ? <p className="note board-empty">아직 글이 없어요. 첫 글을 남겨 보세요.</p> : null}
          </div>
        </>
      )}
    </section>
  );
}
