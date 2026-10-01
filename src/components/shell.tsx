import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useYard } from "@/components/yard";

const links = [
  { to: "/", label: "광장", exact: true },
  { to: "/share", label: "올리기", exact: false },
  { to: "/rank", label: "랭킹", exact: false },
  { to: "/board", label: "게시판", exact: false },
  { to: "/prompts", label: "프롬프트", exact: false },
  { to: "/tips", label: "팁", exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { snapshot } = useYard();
  return (
    <div className="shell">
      <header className="top">
        <Link to="/" className="brand">
          <img src="/mark.jpg" alt="" width={784} height={1168} />
          <div>
            <strong>놀터</strong>
            <span>올린 놀이의 광장</span>
          </div>
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
          <p className="banner">순위를 지금 불러오지 못했다. 올린 주소는 그대로 열려 있다.</p>
        ) : null}
        {children}
      </main>
      <footer className="site">
        <span>놀터 · 심심할 때 들어오는 링크와 짧은 놀이</span>
        <span>
          <Link to="/privacy">개인정보처리방침</Link>
          {" · "}
          <Link to="/about">광고 안내</Link>
        </span>
      </footer>
    </div>
  );
}
