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
      { title: "놀터 — 킬링타임 놀이터" },
      {
        name: "description",
        content: "웹게임, 심리테스트, 낙서, 계산기, 만든 앱 주소를 올리고 들어간 횟수로 순위를 매기는 공유 놀이터.",
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
              <Outlet />
            </Shell>
          </YardProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
