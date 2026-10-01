import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/yard/catalog";
import type { ScoredItem } from "@/lib/yard/types";
import { useYard } from "@/components/yard";

export function PlayCard({ item, rank }: { item: ScoredItem; rank?: number }) {
  const { openItem } = useYard();
  const label = categories.find((category) => category.id === item.category)?.label ?? item.category;
  return (
    <article className="card">
      <div className="meta">
        <span className="soft">{label}</span>
        {rank ? <span className="stamp">{rank}위</span> : <span className="soft">{item.by}</span>}
      </div>
      <h3>
        <Link to="/item/$id" params={{ id: item.id }}>{item.title}</Link>
      </h3>
      <p>{item.blurb}</p>
      <div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="row">
        <span className="soft">오늘 {item.stats.day.toLocaleString("ko-KR")}회</span>
        <button type="button" className="btn" onClick={() => openItem(item)}>들어가기</button>
      </div>
    </article>
  );
}
