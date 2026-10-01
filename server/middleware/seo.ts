/**
 * Public crawler files. Served here so the sitemap host matches the request,
 * whether the site is on a custom domain, Vercel, or a grok.me host.
 */
const PATHS = [
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

type SeoEvent = {
  url: URL;
  req: { method?: string; headers: { get(name: string): string | null } };
};

function originOf(event: SeoEvent): string {
  const hostHeader = event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host;
  const host = hostHeader.split(",")[0]?.trim() || event.url.host;
  const proto =
    event.req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    event.url.protocol.replace(":", "") ||
    "https";
  return `${proto}://${host}`;
}

export default function seoMiddleware(event: SeoEvent, next: () => unknown): unknown {
  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return next();
  const path = event.url.pathname;
  if (path !== "/robots.txt" && path !== "/sitemap.xml") return next();

  const origin = originOf(event);
  if (path === "/robots.txt") {
    return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const urls = PATHS.map((item) => `  <url><loc>${origin}${item}</loc></url>`).join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
}
