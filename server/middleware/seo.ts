/**
 * Public crawler files. Served here so the sitemap host matches the request,
 * whether the site is on a custom domain, Vercel, or a grok.me host.
 * Also proves the host to IndexNow (Naver, Bing, and the other members).
 */
import { catalogItems, seedPosts } from "../../src/lib/yard/catalog";

const INDEXNOW_KEY = "acac7f9ab4f186959ff80eadeac13c3d";

const STATIC_PATHS = [
  "/",
  "/share",
  "/rank",
  "/board",
  "/prompts",
  "/tips",
  "/about",
  "/privacy",
  "/play/calc",
  "/play/draw",
  "/play/minute",
  "/play/pick",
  "/play/psych",
  "/play/react",
];

const PATHS = [
  ...STATIC_PATHS,
  ...catalogItems.map((item) => `/item/${item.id}`),
  ...seedPosts.map((post) => `/board/${post.id}`),
];

type SeoEvent = {
  url: URL;
  req: { method?: string; headers: { get(name: string): string | null } };
};

function originOf(event: SeoEvent): string {
  const hostHeader = event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host;
  const raw = hostHeader.split(",")[0]?.trim() || event.url.host;
  const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(raw) ? raw : event.url.host;
  const protoHeader = event.req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "";
  const proto = protoHeader === "http" || protoHeader === "https" ? protoHeader : "https";
  return `${proto}://${host}`;
}

function injectCanonical(html: string, canonical: string): string {
  if (html.includes('rel="canonical"') || !html.includes("</head>")) return html;
  const safe = canonical.replace(/"/g, "");
  const tag = `<link rel="canonical" href="${safe}"/>`;
  return html.replace("</head>", `${tag}</head>`);
}

export default async function seoMiddleware(
  event: SeoEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return next();
  const path = event.url.pathname;

  if (path === "/googleef16ab6d67159605.html") {
    return new Response("google-site-verification: googleef16ab6d67159605.html", {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
    });
  }

  if (path === "/naver1de2ef086604247f55323952c494f677.html") {
    return new Response("naver-site-verification: naver1de2ef086604247f55323952c494f677.html", {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
    });
  }

  if (path === `/${INDEXNOW_KEY}.txt`) {
    return new Response(INDEXNOW_KEY, {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
    });
  }

  if (path === "/robots.txt" || path === "/sitemap.xml") {
    const origin = originOf(event);
    if (path === "/robots.txt") {
      return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    const today = "2026-10-01";
    const urls = PATHS.map(
      (item) => `  <url><loc>${origin}${item}</loc><lastmod>${today}</lastmod></url>`,
    ).join("\n");
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      { headers: { "content-type": "application/xml; charset=utf-8" } },
    );
  }

  const result = await next();
  if (!(result instanceof Response)) return result;
  const type = result.headers.get("content-type") ?? "";
  if (!type.includes("text/html") || !result.body) return result;
  const html = await result.text();
  const canonical = new URL(path || "/", originOf(event)).href;
  const headers = new Headers(result.headers);
  headers.delete("content-length");
  return new Response(injectCanonical(html, canonical), {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}
