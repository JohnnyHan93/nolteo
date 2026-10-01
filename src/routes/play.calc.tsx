import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/play/calc")({ component: CalcPlay });

function evaluate(src: string): string {
  const expr = src.replace(/\s/g, "");
  if (!expr || !/^[\d.+\-*/()]+$/.test(expr)) return "오류";
  let i = 0;
  const peek = () => expr[i] ?? "";
  const eat = () => expr[i++] ?? "";

  function parseExpr(): number {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = eat();
      const right = parseTerm();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = eat();
      const right = parseFactor();
      if (op === "/" && right === 0) throw new Error("div");
      value = op === "*" ? value * right : value / right;
    }
    return value;
  }

  function parseFactor(): number {
    if (peek() === "+") { eat(); return parseFactor(); }
    if (peek() === "-") { eat(); return -parseFactor(); }
    if (peek() === "(") {
      eat();
      const value = parseExpr();
      if (eat() !== ")") throw new Error("paren");
      return value;
    }
    const start = i;
    while (/[\d.]/.test(peek())) i += 1;
    if (start === i) throw new Error("num");
    const num = Number(expr.slice(start, i));
    if (!Number.isFinite(num)) throw new Error("num");
    return num;
  }

  try {
    const value = parseExpr();
    if (i !== expr.length || !Number.isFinite(value)) return "오류";
    const rounded = Math.round(value * 1e10) / 1e10;
    return String(rounded);
  } catch {
    return "오류";
  }
}

const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "+", "="];

function CalcPlay() {
  const [expr, setExpr] = useState("0");

  function press(key: string) {
    if (key === "C") {
      setExpr("0");
      return;
    }
    if (key === "=") {
      setExpr(evaluate(expr));
      return;
    }
    setExpr((value) => (value === "0" || value === "오류" ? key : value + key));
  }

  return (
    <section>
      <h1 className="page-title">주머니 계산기</h1>
      <div className="play">
        <div className="calc">
          <div className="calc-screen">{expr}</div>
          {keys.map((key) => (
            <button key={key} type="button" className={key === "=" ? "eq" : undefined} onClick={() => press(key)}>
              {key}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
