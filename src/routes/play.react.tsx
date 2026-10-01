import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/play/react")({
  head: () => ({
    meta: [
      { title: "반응 속도 — 놀터" },
      { name: "description", content: "화면이 바뀌면 눌러 보는 놀터의 짧은 반응 놀이예요." },
    ],
  }),
  component: ReactPlay,
});

type Phase = "idle" | "wait" | "go" | "early" | "done";

function ReactPlay() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState<number | null>(null);
  const start = useRef(0);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function begin() {
    window.clearTimeout(timer.current);
    setPhase("wait");
    setMs(null);
    const delay = 800 + Math.random() * 2200;
    timer.current = window.setTimeout(() => {
      start.current = performance.now();
      setPhase("go");
    }, delay);
  }

  function hit() {
    if (phase === "wait") {
      window.clearTimeout(timer.current);
      setPhase("early");
      return;
    }
    if (phase === "go") {
      setMs(Math.round(performance.now() - start.current));
      setPhase("done");
    }
  }

  return (
    <section>
      <h1 className="page-title">반응속도</h1>
      <p className="note">색이 바뀌기 전에 누르면 반칙이에요. 초록으로 바뀌면 눌러 주세요.</p>
      <div className="play">
        {phase === "idle" ? <button type="button" className="hit wait" onClick={begin}>시작</button> : null}
        {phase === "wait" ? <button type="button" className="hit wait" onClick={hit}>기다리기</button> : null}
        {phase === "go" ? <button type="button" className="hit go" onClick={hit}>지금</button> : null}
        {phase === "early" ? (
          <div>
            <p className="mega">너무 빨랐어요</p>
            <button type="button" className="btn" onClick={begin}>다시</button>
          </div>
        ) : null}
        {phase === "done" ? (
          <div>
            <p className="mega">{ms}ms</p>
            <button type="button" className="btn" onClick={begin}>한 판 더</button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
