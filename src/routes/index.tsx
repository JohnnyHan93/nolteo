import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdSlot } from "@/components/ad-slot";
import { PlayCard } from "@/components/play-card";
import { useYard } from "@/components/yard";
import { categories } from "@/lib/yard/catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { catalog, openItem } = useYard();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const query = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      catalog.filter((item) => {
        const hay = `${item.title} ${item.blurb} ${item.tags.join(" ")} ${item.by}`.toLowerCase();
        const catOk = cat === "all" || item.category === cat;
        return catOk && hay.includes(query);
      }),
    [catalog, cat, query],
  );
  const top = [...catalog].sort((a, b) => b.stats.day - a.stats.day);
  const lead = top[0];
  const browsing = cat === "all" && query.length === 0;
  const popular = top.slice(0, 6);
  const popularIds = new Set(popular.map((item) => item.id));
  const rest = browsing ? filtered.filter((item) => !popularIds.has(item.id)) : filtered;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">SHARED YARD</div>
          <h1>만든 걸<br />여기에 둔다.</h1>
          <p>놀터는 게임을 만들지 않는다. 웹게임, 심리테스트, 낙서, 계산기, 만든 앱 주소를 올리고, 들어간 횟수로 오늘·이번 주·이번 달 순위가 매겨진다.</p>
          <div className="search">
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="게임, 테스트, 올린 사람"
              aria-label="놀이 찾기"
            />
          </div>
          <div className="hero-actions">
            <Link to="/share" className="btn">놀이 올리기</Link>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                const pick = catalog[Math.floor(Math.random() * catalog.length)];
                if (pick) openItem(pick);
              }}
            >
              아무거나
            </button>
          </div>
        </div>
        <aside className="hero-side">
          <img src="/mark.jpg" alt="놀터 마크" width={784} height={1168} />
          <div>
            <b>오늘의 1위</b>
            <div className="lead">{lead?.title ?? "아직 없다"}</div>
            <div>{lead ? `${lead.by} · ${(lead.stats.day).toLocaleString("ko-KR")}회` : "올린 주소가 순위를 만든다"}</div>
          </div>
        </aside>
      </section>
      <AdSlot label="홈 상단 광고 자리" />
      <div className="chips">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={cat === category.id ? "chip on" : "chip"}
            onClick={() => setCat(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      {browsing ? (
        <>
          <h2 className="section-label">오늘 인기</h2>
          <div className="grid">
            {popular.map((item, index) => <PlayCard key={item.id} item={item} rank={index + 1} />)}
          </div>
          <h2 className="section-label">광장</h2>
        </>
      ) : null}
      <div className="grid">
        {rest.map((item) => <PlayCard key={item.id} item={item} />)}
      </div>
      {filtered.length === 0 ? <p className="note">찾는 놀이가 없다. 올리기에서 주소를 넣으면 광장과 랭킹에 붙는다.</p> : null}
    </>
  );
}