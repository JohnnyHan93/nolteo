export type Stats = { day: number; week: number; month: number; all: number };

export const ZERO: Stats = { day: 0, week: 0, month: 0, all: 0 };

export type YardCategory =
  | "game"
  | "flash"
  | "psych"
  | "draw"
  | "calc"
  | "tool"
  | "ai"
  | "made";

export type CatalogItem = {
  id: string;
  title: string;
  blurb: string;
  category: YardCategory;
  kind: "내부" | "외부";
  href: string;
  tags: string[];
  by: string;
  github?: string;
};

export type ScoredItem = CatalogItem & { stats: Stats };

export type Comment = {
  id: string;
  nick: string;
  body: string;
  created: string;
};

export type Post = {
  id: string;
  nick: string;
  tag: string;
  title: string;
  body: string;
  created: string;
  comments: Comment[];
};

export type Review = {
  id: string;
  nick: string;
  score: number;
  text: string;
  created: string;
};

export type ExtraItem = {
  id: string;
  title: string;
  href: string;
  blurb: string;
  github: string;
  category: YardCategory;
  nick: string;
  created: string;
};

export type PromptCard = {
  id: string;
  nick: string;
  title: string;
  model: string;
  body: string;
  created: string;
};

export type TipCard = {
  id: string;
  nick: string;
  title: string;
  body: string;
  github: string;
  created: string;
};

export type Snapshot = {
  clicks: Record<string, Stats>;
  posts: Post[];
  buckets: Record<string, Comment[]>;
  reviews: Record<string, Review[]>;
  extras: ExtraItem[];
  prompts: PromptCard[];
  tips: TipCard[];
  degraded: boolean;
};

export type MutationResult =
  | { ok: true; snapshot: Snapshot }
  | { ok: false; message: string; snapshot: Snapshot };

export function emptySnapshot(degraded = false): Snapshot {
  return {
    clicks: {},
    posts: [],
    buckets: {},
    reviews: {},
    extras: [],
    prompts: [],
    tips: [],
    degraded,
  };
}

export function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
