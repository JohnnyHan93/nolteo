import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <article className="panel stack">
      <h1>광고</h1>
      <p>지금은 광고를 보여 주지 않는다. 배포 환경변수 VITE_ADSENSE_CLIENT에 퍼블리셔 ID(ca-pub-…)를 넣고 다시 배포하면 홈과 랭킹에 애드센스 칸이 붙는다. 값이 없으면 칸도, 광고 스크립트도 없다.</p>
      <p>켤 때는 public/ads.txt의 예시 줄을 본인 퍼블리셔 줄로 바꾸고, 개인정보처리방침의 운영자 연락처를 채운 뒤 심사에 넣는다.</p>
    </article>
  );
}