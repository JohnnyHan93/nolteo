import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdSlot } from "@/components/ad-slot";
import { useYard } from "@/components/yard";

export const Route = createFileRoute("/rank")({
  head: () => ({
    meta: [
      { title: "인기 놀이 순위 — 놀터" },
      { name: "description", content: "놀터 인기 놀이. 오늘, 이번 주, 이번 달, 전체 순위를 봐요." },
    ],
  }),
  component: RankPage,
});

const periods = [
  { id: "day", label: "오늘" },
  { id: "week", label: "이번 주" },
  { id: "month", label: "이번 달" },
  { id: "all", label: "전체" },
] as const;

function RankPage() {
  const { catalog, openItem } = useYard();
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("day");
  const rows = [...catalog].sort((a, b) => b.stats[period] - a.stats[period]);

  return (
    <>
      <h1 className="page-title">인기 놀이</h1>
      <p className="note">사람들이 올린 주소예요. 서울 시간으로 오늘, 이번 주, 이번 달이 나뉘고, 들어갈 때마다 횟수가 쌓여요.</p>
      <div className="tabs">
        {periods.map((item) => (
          <button
            key={item.id}
            type="button"
            className={period === item.id ? "chip on" : "chip"}
            onClick={() => setPeriod(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="list">
        {rows.map((item, index) => (
          <article key={item.id} className="rank">
            <b className={index === 0 ? "place-1" : undefined}>{index + 1}</b>
            <div>
              <strong><Link to="/item/$id" params={{ id: item.id }}>{item.title}</Link></strong>
              <div className="soft">{item.blurb}</div>
            </div>
            <div className="rank-actions">
              <div>{item.stats[period].toLocaleString("ko-KR")}회</div>
              <button type="button" className="btn" onClick={() => openItem(item)}>들어가기</button>
            </div>
          </article>
        ))}
      </div>
      <AdSlot label="랭킹 하단 광고 자리" />
    </>
  );
}
