import { useEffect, useState } from "react";

const KEY = "nolteo-owner";

/** 이 브라우저에서만 켜지는 운영자 표시. `?ops=1` 로 켜고 `?ops=0` 으로 끈다. */
export function useOwner(): boolean {
  const [owner, setOwner] = useState(false);
  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("ops");
    if (flag === "1") localStorage.setItem(KEY, "1");
    if (flag === "0") localStorage.removeItem(KEY);
    setOwner(localStorage.getItem(KEY) === "1");
  }, []);
  return owner;
}

export const OWNER_MAIL = "junhi602@gmail.com";

/** 홈 메인 아래. 방문자에게는 렌더하지 않는다. */
export function OwnerAdNote() {
  const owner = useOwner();
  if (!owner) return null;
  return (
    <aside className="panel stack" aria-label="광고 안내">
      <h2>광고 안내</h2>
      <p>
        광고를 넣고 싶은 분이 있으면, 개인 메일로 연락해 달라고 안내하면 돼요.
      </p>
      <p>
        <a href={`mailto:${OWNER_MAIL}`}>{OWNER_MAIL}</a>
      </p>
      <p className="note">이 상자는 이 브라우저에만 보여요. 다른 사람은 못 봐요. 끄려면 주소 끝에 ?ops=0 을 붙여 새로고침하세요.</p>
    </aside>
  );
}
