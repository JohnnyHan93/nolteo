import { useEffect } from "react";

const client = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim() ?? "";
const enabled = client.startsWith("ca-pub-");

export function AdSlot({ label = "광고 자리" }: { label?: string }) {
  useEffect(() => {
    if (!enabled) return;
    const exist = document.querySelector("script[data-adsense]");
    if (!exist) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.adsense = "1";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
    try {
      const ads = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle ?? [];
      (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = ads;
      ads.push({});
    } catch {
      /* slot not ready */
    }
  }, []);

  if (!enabled) return null;

  return (
    <aside className="ad-slot" aria-label={label}>
      <ins
        className="adsbygoogle"
        data-ad-client={client}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
