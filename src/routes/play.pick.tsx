import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/play/pick")({
  head: () => ({
    meta: [
      { title: "아무거나 고르기 — 놀터" },
      { name: "description", content: "줄마다 적어 두면 놀터가 하나를 골라 줘요." },
    ],
  }),
  component: PickPlay,
});

function PickPlay() {
  const [text, setText] = useState("커피\n산책\n낮잠\n아무 링크");
  const [result, setResult] = useState("");
  const [spinning, setSpinning] = useState(false);

  function spin() {
    const options = text.split("\n").map((line) => line.trim()).filter(Boolean);
    if (options.length < 2) {
      setResult("두 줄은 적어 주세요");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = options[Math.floor(Math.random() * options.length)] ?? "";
    if (reduce) {
      setResult(next);
      return;
    }
    setSpinning(true);
    window.setTimeout(() => {
      setResult(next);
      setSpinning(false);
    }, 700);
  }

  return (
    <section>
      <h1 className="page-title">결정 룰렛</h1>
      <p className="note">한 줄에 하나씩 적으면 돼요. 이 목록은 서버로 보내지 않아요.</p>
      <div className="split">
        <label className="field">
          <span>후보</span>
          <textarea rows={8} value={text} onChange={(event) => setText(event.target.value)} />
        </label>
        <div className="play">
          <div>
            <p className={spinning ? "pick-result spin" : "pick-result"}>{result || "아직이에요"}</p>
            <button type="button" className="btn" onClick={spin} disabled={spinning}>돌리기</button>
          </div>
        </div>
      </div>
    </section>
  );
}
