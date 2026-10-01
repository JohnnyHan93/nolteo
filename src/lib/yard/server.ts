import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CATALOG_IDS, POST_TAGS, SEED_POST_IDS, SEED_PROMPT_IDS, SEED_TIP_IDS } from "@/lib/yard/catalog";
import type { YardCategory } from "@/lib/yard/types";
import {
  emptySnapshot,
  type Comment,
  type ExtraItem,
  type MutationResult,
  type Post,
  type PromptCard,
  type Review,
  type Snapshot,
  type Stats,
  type TipCard,
} from "@/lib/yard/types";

const idSchema = z.string().regex(/^[a-z0-9-]{1,40}$/);

const postSchema = z.object({
  nick: z.string().max(24).optional(),
  tag: z.enum(POST_TAGS),
  title: z.string().max(80),
  body: z.string().max(2000),
});

const commentSchema = z.object({
  postId: idSchema,
  nick: z.string().max(24).optional(),
  body: z.string().max(1000),
});

const reviewSchema = z.object({
  itemId: idSchema,
  nick: z.string().max(24).optional(),
  score: z.number().int().min(1).max(5),
  text: z.string().max(1000),
});

const shareIds = ["game", "flash", "psych", "draw", "calc", "tool", "ai", "made"] as const;

function isCategory(value: string): value is YardCategory {
  return (shareIds as readonly string[]).includes(value);
}

const extraSchema = z.object({
  nick: z.string().max(24).optional(),
  title: z.string().max(80),
  href: z.string().max(300),
  blurb: z.string().max(200).optional(),
  github: z.string().max(300).optional(),
  category: z.enum(shareIds),
});

const promptSchema = z.object({
  nick: z.string().max(24).optional(),
  title: z.string().max(80),
  model: z.string().max(40).optional(),
  body: z.string().max(4000),
});

const tipSchema = z.object({
  nick: z.string().max(24).optional(),
  title: z.string().max(80),
  body: z.string().max(2000),
  github: z.string().max(300).optional(),
});

function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new Error("입력을 확인해 주세요");
  return result.data;
}

function plain(value: string, max: number, multiline = false): string {
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  if (multiline) return cleaned.slice(0, max);
  return cleaned.replace(/[ \t\f\v]+/g, " ").slice(0, max);
}

function nickOf(value: string | undefined): string {
  return plain(value ?? "", 16) || "익명";
}

function httpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString().slice(0, 300);
  } catch {
    return null;
  }
}

type ClickRow = {
  item_id: string;
  day_count: number;
  week_count: number;
  month_count: number;
  all_count: number;
};

async function loadSnapshot(): Promise<Snapshot> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const [clicks, posts, comments, reviews, extras, prompts, tips] = await Promise.all([
    sql<ClickRow>`
      select item_id,
        case when day_stamp = to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM-DD') then day_count else 0 end as day_count,
        case when week_stamp = to_char(now() at time zone 'Asia/Seoul', 'IYYY-IW') then week_count else 0 end as week_count,
        case when month_stamp = to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM') then month_count else 0 end as month_count,
        all_count
      from yard_clicks
    `,
    sql<{ id: string; nick: string; tag: string; title: string; body: string; created_at: string }>`
      select id, nick, tag, title, body,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
      from yard_posts
      order by created_at desc
      limit 100
    `,
    sql<{ id: string; post_id: string; nick: string; body: string; created_at: string }>`
      select id, post_id, nick, body,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
      from yard_comments
      order by created_at asc
      limit 500
    `,
    sql<{ id: string; item_id: string; nick: string; score: number; body: string; created_at: string }>`
      select id, item_id, nick, score, body,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
      from yard_reviews
      order by created_at desc
      limit 400
    `,
    sql<{ id: string; title: string; href: string; blurb: string; github: string; category: string; nick: string; created_at: string }>`
      select id, title, href, blurb, github, category, nick,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
      from yard_extras
      order by created_at desc
      limit 100
    `,
    sql<{ id: string; nick: string; title: string; model: string; body: string; created_at: string }>`
      select id, nick, title, model, body,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
      from yard_prompts
      order by created_at desc
      limit 100
    `,
    sql<{ id: string; nick: string; title: string; body: string; github: string; created_at: string }>`
      select id, nick, title, body, github,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
      from yard_tips
      order by created_at desc
      limit 100
    `,
  ]);

  const byPost = new Map<string, Comment[]>();
  for (const row of comments) {
    const list = byPost.get(row.post_id) ?? [];
    list.push({ id: row.id, nick: row.nick, body: row.body, created: row.created_at });
    byPost.set(row.post_id, list);
  }

  const postList: Post[] = posts.map((row) => ({
    id: row.id,
    nick: row.nick,
    tag: row.tag,
    title: row.title,
    body: row.body,
    created: row.created_at,
    comments: byPost.get(row.id) ?? [],
  }));

  const reviewMap: Record<string, Review[]> = {};
  for (const row of reviews) {
    const list = reviewMap[row.item_id] ?? [];
    list.push({
      id: row.id,
      nick: row.nick,
      score: Number(row.score),
      text: row.body,
      created: row.created_at,
    });
    reviewMap[row.item_id] = list;
  }

  const clickMap: Record<string, Stats> = {};
  for (const row of clicks) {
    clickMap[row.item_id] = {
      day: Number(row.day_count),
      week: Number(row.week_count),
      month: Number(row.month_count),
      all: Number(row.all_count),
    };
  }

  const extraList: ExtraItem[] = extras.map((row) => ({
    id: row.id,
    title: row.title,
    href: row.href,
    blurb: row.blurb,
    github: row.github,
    category: isCategory(row.category) ? row.category : "made",
    nick: row.nick || "익명",
    created: row.created_at,
  }));

  const promptList: PromptCard[] = prompts.map((row) => ({
    id: row.id,
    nick: row.nick,
    title: row.title,
    model: row.model,
    body: row.body,
    created: row.created_at,
  }));

  const tipList: TipCard[] = tips.map((row) => ({
    id: row.id,
    nick: row.nick,
    title: row.title,
    body: row.body,
    github: row.github,
    created: row.created_at,
  }));

  const buckets: Record<string, Comment[]> = {};
  for (const [postId, list] of byPost) buckets[postId] = list;

  return {
    clicks: clickMap,
    posts: postList,
    buckets,
    reviews: reviewMap,
    extras: extraList,
    prompts: promptList,
    tips: tipList,
    degraded: false,
  };
}

async function safeSnapshot(): Promise<Snapshot> {
  try {
    return await loadSnapshot();
  } catch (error) {
    console.error("[nolteo] snapshot failed", error);
    return emptySnapshot(true);
  }
}

async function fail(message: string): Promise<MutationResult> {
  return { ok: false, message, snapshot: await safeSnapshot() };
}

async function countOf(table: "yard_posts" | "yard_comments" | "yard_reviews" | "yard_extras" | "yard_prompts" | "yard_tips"): Promise<number> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows =
    table === "yard_posts"
      ? await sql<{ n: number }>`select count(*)::int as n from yard_posts`
      : table === "yard_comments"
        ? await sql<{ n: number }>`select count(*)::int as n from yard_comments`
        : table === "yard_reviews"
          ? await sql<{ n: number }>`select count(*)::int as n from yard_reviews`
          : table === "yard_extras"
            ? await sql<{ n: number }>`select count(*)::int as n from yard_extras`
            : table === "yard_prompts"
              ? await sql<{ n: number }>`select count(*)::int as n from yard_prompts`
              : await sql<{ n: number }>`select count(*)::int as n from yard_tips`;
  return Number(rows[0]?.n ?? 0);
}

async function knownItem(id: string): Promise<boolean> {
  if (CATALOG_IDS.has(id) || SEED_PROMPT_IDS.has(id) || SEED_TIP_IDS.has(id)) return true;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ id: string }>`
    select id from yard_extras where id = ${id}
    union all
    select id from yard_prompts where id = ${id}
    union all
    select id from yard_tips where id = ${id}
    limit 1
  `;
  return rows.length > 0;
}

export const getSnapshot = createServerFn({ method: "GET" }).handler(async (): Promise<Snapshot> => {
  return safeSnapshot();
});

export const bumpClick = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({ id: idSchema }), input))
  .handler(async ({ data }): Promise<Snapshot> => {
    try {
      if (!(await knownItem(data.id))) return await loadSnapshot();
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      await sql`
        insert into yard_clicks (
          item_id, day_count, week_count, month_count, all_count, day_stamp, week_stamp, month_stamp
        )
        select ${data.id}, 1, 1, 1, 1, s.d, s.w, s.m
        from (
          select
            to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM-DD') as d,
            to_char(now() at time zone 'Asia/Seoul', 'IYYY-IW') as w,
            to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM') as m
        ) s
        on conflict (item_id) do update set
          day_count = case when yard_clicks.day_stamp = excluded.day_stamp then yard_clicks.day_count + 1 else 1 end,
          week_count = case when yard_clicks.week_stamp = excluded.week_stamp then yard_clicks.week_count + 1 else 1 end,
          month_count = case when yard_clicks.month_stamp = excluded.month_stamp then yard_clicks.month_count + 1 else 1 end,
          all_count = yard_clicks.all_count + 1,
          day_stamp = excluded.day_stamp,
          week_stamp = excluded.week_stamp,
          month_stamp = excluded.month_stamp
      `;
      return await loadSnapshot();
    } catch (error) {
      console.error("[nolteo] bump failed", error);
      return emptySnapshot(true);
    }
  });

export const createPost = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(postSchema, input))
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      const title = plain(data.title, 80);
      const body = plain(data.body, 2000, true);
      if (!title || !body) return await fail("제목과 내용을 적어 주세요");
      if ((await countOf("yard_posts")) >= 400) return await fail("글이 가득 찼어요. 잠시 뒤에 다시 올려 주세요.");
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      await sql`
        insert into yard_posts (id, nick, tag, title, body)
        values (${crypto.randomUUID()}, ${nickOf(data.nick)}, ${data.tag}, ${title}, ${body})
      `;
      return { ok: true, snapshot: await loadSnapshot() };
    } catch (error) {
      console.error("[nolteo] post failed", error);
      return fail("글을 올리지 못했어요");
    }
  });

export const createComment = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(commentSchema, input))
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      const body = plain(data.body, 1000, true);
      if (!body) return await fail("의견을 적어 주세요");
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const found = await sql<{ id: string }>`select id from yard_posts where id = ${data.postId}`;
      if (found.length === 0 && !SEED_POST_IDS.has(data.postId)) return await fail("이 글을 찾지 못했어요");
      if ((await countOf("yard_comments")) >= 800) return await fail("의견이 가득 찼어요.");
      await sql`
        insert into yard_comments (id, post_id, nick, body)
        values (${crypto.randomUUID()}, ${data.postId}, ${nickOf(data.nick)}, ${body})
      `;
      return { ok: true, snapshot: await loadSnapshot() };
    } catch (error) {
      console.error("[nolteo] comment failed", error);
      return fail("의견을 남기지 못했어요");
    }
  });

export const createReview = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(reviewSchema, input))
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      const text = plain(data.text, 1000, true);
      if (!text) return await fail("리뷰를 적어 주세요");
      if (!(await knownItem(data.itemId))) return await fail("이 놀이를 찾지 못했어요");
      if ((await countOf("yard_reviews")) >= 800) return await fail("리뷰가 가득 찼어요.");
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      await sql`
        insert into yard_reviews (id, item_id, nick, score, body)
        values (${crypto.randomUUID()}, ${data.itemId}, ${nickOf(data.nick)}, ${data.score}, ${text})
      `;
      return { ok: true, snapshot: await loadSnapshot() };
    } catch (error) {
      console.error("[nolteo] review failed", error);
      return fail("리뷰를 남기지 못했어요");
    }
  });

export const createExtra = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(extraSchema, input))
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      const title = plain(data.title, 80);
      const href = httpUrl(data.href);
      const blurb = plain(data.blurb ?? "", 200) || "직접 올린 놀이";
      const githubRaw = (data.github ?? "").trim();
      const github = githubRaw ? httpUrl(githubRaw) : "";
      const nick = nickOf(data.nick);
      if (!title || !href) return await fail("이름과 http 주소를 적어 주세요");
      if (githubRaw && !github) return await fail("깃허브 주소가 조금 이상해요");
      if ((await countOf("yard_extras")) >= 200) return await fail("올린 링크가 가득 찼어요.");
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const id = crypto.randomUUID();
      await sql`
        insert into yard_extras (id, title, href, blurb, github, category, nick)
        values (${id}, ${title}, ${href}, ${blurb}, ${github ?? ""}, ${data.category}, ${nick})
      `;
      await sql`
        insert into yard_clicks (
          item_id, day_count, week_count, month_count, all_count, day_stamp, week_stamp, month_stamp
        )
        select ${id}, 0, 0, 0, 0, s.d, s.w, s.m
        from (
          select
            to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM-DD') as d,
            to_char(now() at time zone 'Asia/Seoul', 'IYYY-IW') as w,
            to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM') as m
        ) s
        on conflict (item_id) do nothing
      `;
      return { ok: true, snapshot: await loadSnapshot() };
    } catch (error) {
      console.error("[nolteo] extra failed", error);
      return fail("링크를 올리지 못했어요");
    }
  });

export const createPrompt = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(promptSchema, input))
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      const title = plain(data.title, 80);
      const body = plain(data.body, 4000, true);
      const model = plain(data.model ?? "", 40) || "범용";
      if (!title || !body) return await fail("제목과 프롬프트를 적어 주세요");
      if ((await countOf("yard_prompts")) >= 200) return await fail("프롬프트가 가득 찼어요.");
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      await sql`
        insert into yard_prompts (id, nick, title, model, body)
        values (${crypto.randomUUID()}, ${nickOf(data.nick)}, ${title}, ${model}, ${body})
      `;
      return { ok: true, snapshot: await loadSnapshot() };
    } catch (error) {
      console.error("[nolteo] prompt failed", error);
      return fail("프롬프트를 올리지 못했어요");
    }
  });

export const createTip = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(tipSchema, input))
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      const title = plain(data.title, 80);
      const body = plain(data.body, 2000, true);
      const githubRaw = (data.github ?? "").trim();
      const github = githubRaw ? httpUrl(githubRaw) : "";
      if (!title || !body) return await fail("제목과 팁을 적어 주세요");
      if (githubRaw && !github) return await fail("깃허브 주소가 조금 이상해요");
      if ((await countOf("yard_tips")) >= 200) return await fail("팁이 가득 찼어요.");
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      await sql`
        insert into yard_tips (id, nick, title, body, github)
        values (${crypto.randomUUID()}, ${nickOf(data.nick)}, ${title}, ${body}, ${github ?? ""})
      `;
      return { ok: true, snapshot: await loadSnapshot() };
    } catch (error) {
      console.error("[nolteo] tip failed", error);
      return fail("팁을 올리지 못했어요");
    }
  });
