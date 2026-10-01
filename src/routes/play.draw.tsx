import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/play/draw")({
  head: () => ({
    meta: [
      { title: "낙서 — 놀터" },
      { name: "description", content: "놀터에서 바로 그리는 짧은 낙서예요." },
    ],
  }),
  component: DrawPlay,
});

type Ink = "fg" | "accent" | "go";

function inkColor(name: Ink) {
  const key = name === "fg" ? "--color-ink" : name === "accent" ? "--color-accent" : "--color-go";
  return getComputedStyle(document.documentElement).getPropertyValue(key).trim() || "#16130f";
}

function DrawPlay() {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [ink, setInk] = useState<Ink>("fg");

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = inkColor("fg");
  }, []);

  function applyInk(name: Ink) {
    setInk(name);
    const ctx = ref.current?.getContext("2d");
    if (ctx) ctx.strokeStyle = inkColor(name);
  }

  function pos(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function down(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.setPointerCapture(event.pointerId);
    drawing.current = true;
    const point = pos(event);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }

  function move(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const point = pos(event);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  function clear() {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  return (
    <section>
      <h1 className="page-title">낙서장</h1>
      <div className="ink-row">
        {(["fg", "accent", "go"] as const).map((name) => (
          <button
            key={name}
            type="button"
            className={ink === name ? `swatch ${name} on` : `swatch ${name}`}
            aria-label={name === "fg" ? "먹색" : name === "accent" ? "코랄" : "민트"}
            onClick={() => applyInk(name)}
          />
        ))}
        <button type="button" className="btn" onClick={clear}>지우기</button>
      </div>
      <canvas
        ref={ref}
        className="board"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => { drawing.current = false; }}
        onPointerLeave={() => { drawing.current = false; }}
      />
      <p className="note">이 탭을 떠나면 그림은 사라져요. 따로 저장되지는 않아요.</p>
    </section>
  );
}
