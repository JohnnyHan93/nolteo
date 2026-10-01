import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useYard } from "@/components/yard";

export const Route = createFileRoute("/play/psych")({ component: PsychPlay });

const questions = [
  { q: "쉬는 10분, 뭐부터?", a: "창밖", b: "피드" },
  { q: "심심할 때 손은?", a: "낙서", b: "숫자" },
  { q: "사람 많은 곳이면?", a: "구석", b: "한가운데" },
  { q: "게임은?", a: "혼자 끝까지", b: "한 판만" },
  { q: "새로운 사이트는?", a: "설명부터", b: "일단 클릭" },
  { q: "결과가 좋으려면?", a: "딱 떨어지는 유형", b: "애매한 문장" },
];

const results = [
  { title: "창가형", body: "오래 앉아 보는 쪽이다. 소리보다 바깥이 맞다.", id: "window" },
  { title: "한 판형", body: "시작과 끝이 있는 놀이가 맞다. 길어지면 닫는다.", id: "2048" },
  { title: "일단클릭형", body: "설명을 읽기 전에 연다. 이상한 사이트가 맞다.", id: "useless" },
  { title: "수집형", body: "하나 끝나면 옆 칸이 궁금하다. 조합이 길어도 남는다.", id: "little" },
];

function PsychPlay() {
  const { catalog, openItem } = useYard();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const done = step >= questions.length;
  const result = done
    ? results[score <= 1 ? 0 : score <= 3 ? 1 : score <= 5 ? 2 : 3]
    : null;
  const next = result ? catalog.find((item) => item.id === result.id) : undefined;
  const current = questions[step];

  return (
    <section>
      <h1 className="page-title">지금 심심 유형</h1>
      <p className="note">의학이 아니다. 다음에 뭘 열지 고르는 여섯 질문.</p>
      <div className="play">
        {!done && current ? (
          <div className="choices">
            <p className="mega">{current.q}</p>
            <button type="button" className="choice" onClick={() => setStep((value) => value + 1)}>{current.a}</button>
            <button
              type="button"
              className="choice"
              onClick={() => {
                setScore((value) => value + 1);
                setStep((value) => value + 1);
              }}
            >
              {current.b}
            </button>
          </div>
        ) : null}
        {done && result ? (
          <div>
            <p className="pick-result">{result.title}</p>
            <p>{result.body}</p>
            <div className="hero-actions">
              {next ? (
                <button type="button" className="btn" onClick={() => openItem(next)}>{next.title} 열기</button>
              ) : null}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setStep(0);
                  setScore(0);
                }}
              >
                다시
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
