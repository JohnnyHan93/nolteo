import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/play/minute")({ component: MinutePlay });

function MinutePlay() {
  const [left, setLeft] = useState(60);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on) return undefined;
    const id = window.setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          setOn(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [on]);

  return (
    <section>
      <h1 className="page-title">1분 숨고르기</h1>
      <div className="play">
        <div>
          <div className="timer-num">{left}</div>
          <p>{left === 0 ? "잘 쉬었어요." : "60초만 비워 봐요."}</p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setLeft(60);
              setOn(true);
            }}
          >
            {on && left > 0 ? "다시" : "시작"}
          </button>
        </div>
      </div>
    </section>
  );
}
