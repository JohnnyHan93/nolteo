import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useYard } from "@/components/yard";

export const Route = createFileRoute("/prompts")({ component: PromptsPage });

function PromptsPage() {
  const { prompts, addPrompt, busy, error } = useYard();
  const [nick, setNick] = useState("");
  const [title, setTitle] = useState("");
  const [model, setModel] = useState("범용");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState("");

  return (
    <div className="split">
      <section>
        <h1 className="page-title">AI 프롬프트</h1>
        <p className="note">써 보고 괜찮았던 문장을 붙여 두세요. 복사는 이 브라우저에서만 돼요.</p>
        {prompts.map((prompt) => (
          <article key={prompt.id} className="post">
            <div className="soft">{prompt.model} · {prompt.nick}</div>
            <h3>{prompt.title}</h3>
            <p className="keep">{prompt.body}</p>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                void navigator.clipboard.writeText(prompt.body).then(() => setCopied(prompt.id)).catch(() => setCopied(""));
              }}
            >
              {copied === prompt.id ? "복사했어요" : "복사"}
            </button>
          </article>
        ))}
      </section>
      <form
        className="panel stack"
        onSubmit={(event) => {
          event.preventDefault();
          void addPrompt({ nick, title, model, body }).then((ok) => {
            if (!ok) return;
            setTitle("");
            setBody("");
          });
        }}
      >
        <h2>프롬프트 나누기</h2>
        <input value={nick} onChange={(event) => setNick(event.target.value)} placeholder="별명" maxLength={24} aria-label="별명" />
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목" maxLength={80} aria-label="제목" required />
        <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="모델" maxLength={40} aria-label="모델" />
        <textarea rows={7} value={body} onChange={(event) => setBody(event.target.value)} placeholder="프롬프트" maxLength={4000} aria-label="프롬프트" required />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit" disabled={busy}>나누기</button>
      </form>
    </div>
  );
}
