import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/shell";
import { YardProvider } from "@/components/yard";
import { getSnapshot } from "@/lib/yard/server";
import { emptySnapshot } from "@/lib/yard/types";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  loader: async () => {
    try {
      return await getSnapshot();
    } catch {
      return emptySnapshot(true);
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "놀터 — 심심할 때 들르는 웹게임·심리테스트 모음" },
      {
        name: "description",
        content:
          "놀터는 심심할 때 들르는 공유 놀이터예요. 웹게임, 심리테스트, 낙서, 계산기, 직접 만든 앱 링크를 올리고 오늘·이번 주·이번 달 순위를 봐요.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "googlebot", content: "index, follow" },
      { name: "keywords", content: "놀터, 웹게임, 심리테스트, 킬링타임, 무료 게임, 놀이터" },
      { property: "og:site_name", content: "놀터" },
      { property: "og:locale", content: "ko_KR" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "놀터 — 심심할 때 들르는 곳" },
      {
        property: "og:description",
        content: "웹게임, 심리테스트, 낙서, 계산기, 만든 앱 링크를 올리고 같이 순위를 매기는 놀이터예요.",
      },
      { name: "theme-color", content: "#16130f" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  const initial = Route.useLoaderData();
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <YardProvider initial={initial}>
            <Shell>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "놀터",
                    alternateName: ["놀터 놀이터", "킬링타임 놀터"],
                    inLanguage: "ko-KR",
                    description:
                      "웹게임, 심리테스트, 낙서, 계산기, 직접 만든 앱 링크를 올리고 순위를 매기는 공유 놀이터.",
                  }),
                }}
              />
              <Outlet />
            </Shell>
          </YardProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
