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
  { title: "창가형", body: "한참 앉아 보는 스타일이에요. 소리보다 창밖이 더 잘 맞아요.", id: "window" },
  { title: "한 판형", body: "시작과 끝이 있는 놀이가 잘 맞아요. 길어지면 그냥 닫아도 돼요.", id: "2048" },
  { title: "일단클릭형", body: "설명보다 먼저 열어 보는 쪽이에요. 이상한 사이트가 더 재미있을 거예요.", id: "useless" },
  { title: "수집형", body: "하나 끝나면 옆 칸이 궁금한 쪽이에요. 조합이 길어도 남아요.", id: "little" },
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
      <p className="note">병원 검사가 아니에요. 다음에 뭘 열지 고르는 짧은 질문 여섯 개예요.</p>
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
