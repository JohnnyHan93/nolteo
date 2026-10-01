import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useYard } from "@/components/yard";

const links = [
  { to: "/", label: "광장", exact: true },
  { to: "/share", label: "올리기", exact: false },
  { to: "/rank", label: "랭킹", exact: false },
  { to: "/board", label: "이야기", exact: false },
  { to: "/prompts", label: "프롬프트", exact: false },
  { to: "/tips", label: "팁", exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { snapshot } = useYard();
  return (
    <div className="shell">
      <header className="top">
        <Link to="/" className="brand">
          <span className="logo">놀터</span>
          <span className="logo-sub">심심할 때 들르는 곳</span>
        </Link>
        <nav className="nav" aria-label="주요">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.exact }}
              activeProps={{ className: "active" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="wrap">
        {snapshot.degraded ? (
          <p className="banner">순위를 잠깐 못 불러왔어요. 올린 주소는 그대로 열 수 있어요.</p>
        ) : null}
        {children}
      </main>
      <footer className="site">
        <span>놀터 · 심심할 때, 짧게 놀다 가세요</span>
        <span>
          <Link to="/privacy">개인정보</Link>
          {" · "}
          <Link to="/about">놀터 소개</Link>
        </span>
      </footer>
    </div>
  );
}
