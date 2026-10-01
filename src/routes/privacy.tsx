import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <article className="panel stack">
      <h1>개인정보처리방침</h1>
      <p>놀터는 회원 가입을 받지 않는다. 별명, 글, 리뷰, 프롬프트, 개발 팁, 직접 올린 링크, 놀이 클릭 수는 서비스 운영을 위해 서버에 저장된다. 이메일이나 실명은 받지 않는다.</p>
      <p>별명은 비우면 ‘익명’으로 남는다. 글에 개인 연락처를 적지 않는 편이 안전하다.</p>
      <p>놀터는 게임 파일을 받지 않는다. 올린 주소로 이동하면 그 사이트의 정책이 적용된다. 광고를 켜면 구글 등 광고 사업자가 쿠키와 광고 식별자를 사용할 수 있다. 광고 개인화는 구글 광고 설정에서 끌 수 있다.</p>
      <p>문의가 필요하면 사이트 운영자 연락처를 이 문단에 추가한다.</p>
    </article>
  );
}
