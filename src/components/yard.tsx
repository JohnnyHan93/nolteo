import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { catalogItems, mergeComments, seedPosts, seedPrompts, seedTips } from "@/lib/yard/catalog";
import {
  bumpClick,
  createComment,
  createExtra,
  createPost,
  createPrompt,
  createReview,
  createTip,
} from "@/lib/yard/server";
import { ZERO, type CatalogItem, type Post, type ScoredItem, type Snapshot } from "@/lib/yard/types";

type YardApi = {
  snapshot: Snapshot;
  catalog: ScoredItem[];
  posts: Post[];
  prompts: Snapshot["prompts"];
  tips: Snapshot["tips"];
  busy: boolean;
  error: string | null;
  record: (id: string) => void;
  openItem: (item: Pick<CatalogItem, "id" | "href">) => void;
  addPost: (input: { nick: string; tag: "잡담" | "홍보" | "리뷰" | "질문" | "팁"; title: string; body: string }) => Promise<boolean>;
  addComment: (input: { postId: string; nick: string; body: string }) => Promise<boolean>;
  addReview: (input: { itemId: string; nick: string; score: number; text: string }) => Promise<boolean>;
  addExtra: (input: { nick: string; title: string; href: string; blurb: string; github: string; category: "game" | "flash" | "psych" | "draw" | "calc" | "tool" | "ai" | "made" }) => Promise<boolean>;
  addPrompt: (input: { nick: string; title: string; model: string; body: string }) => Promise<boolean>;
  addTip: (input: { nick: string; title: string; body: string; github: string }) => Promise<boolean>;
};

const YardContext = createContext<YardApi | null>(null);

export function YardProvider({ initial, children }: { initial: Snapshot; children: ReactNode }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const path = useRouterState({ select: (state) => state.location.pathname });
  const router = useRouter();

  useEffect(() => {
    setSnapshot(initial);
  }, [initial]);

  useEffect(() => {
    setError(null);
  }, [path]);

  const catalog = useMemo<ScoredItem[]>(() => {
    const extras: CatalogItem[] = snapshot.extras.map((item) => ({
      id: item.id,
      title: item.title,
      blurb: item.blurb,
      category: item.category,
      kind: "외부",
      href: item.href,
      tags: item.github ? ["올린 링크", "깃허브"] : ["올린 링크"],
      by: item.nick,
      github: item.github || undefined,
    }));
    return [...extras, ...catalogItems].map((item) => ({
      ...item,
      stats: snapshot.clicks[item.id] ?? ZERO,
    }));
  }, [snapshot]);

  const posts = useMemo(() => {
    const fresh = [...seedPosts, ...snapshot.posts].map((post) => ({
      ...post,
      comments: mergeComments(post.comments, snapshot.buckets[post.id] ?? []),
    }));
    fresh.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    return fresh;
  }, [snapshot]);

  const prompts = useMemo(
    () => [...snapshot.prompts, ...seedPrompts],
    [snapshot.prompts],
  );
  const tips = useMemo(() => [...snapshot.tips, ...seedTips], [snapshot.tips]);

  async function commit(work: () => Promise<{ ok: boolean; message?: string; snapshot: Snapshot }>) {
    setBusy(true);
    setError(null);
    try {
      const result = await work();
      if (!result.snapshot.degraded) setSnapshot(result.snapshot);
      if (!result.ok) setError(result.message ?? "저장하지 못했어요");
      return result.ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장하지 못했어요");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function record(id: string) {
    setSnapshot((current) => {
      const prev = current.clicks[id] ?? ZERO;
      return {
        ...current,
        clicks: {
          ...current.clicks,
          [id]: {
            day: prev.day + 1,
            week: prev.week + 1,
            month: prev.month + 1,
            all: prev.all + 1,
          },
        },
      };
    });
    void bumpClick({ data: { id } }).then((next) => {
      if (!next.degraded) setSnapshot(next);
    });
  }

  function openItem(item: Pick<CatalogItem, "id" | "href">) {
    if (item.href.startsWith("/")) router.history.push(item.href);
    else window.open(item.href, "_blank", "noopener,noreferrer");
    record(item.id);
  }

  const api: YardApi = {
    snapshot,
    catalog,
    posts,
    prompts,
    tips,
    busy,
    error,
    record,
    openItem,
    addPost: (input) => commit(() => createPost({ data: input })),
    addComment: (input) => commit(() => createComment({ data: input })),
    addReview: (input) => commit(() => createReview({ data: input })),
    addExtra: (input) => commit(() => createExtra({ data: input })),
    addPrompt: (input) => commit(() => createPrompt({ data: input })),
    addTip: (input) => commit(() => createTip({ data: input })),
  };

  return <YardContext.Provider value={api}>{children}</YardContext.Provider>;
}

export function useYard() {
  const ctx = useContext(YardContext);
  if (!ctx) throw new Error("Yard missing");
  return ctx;
}
