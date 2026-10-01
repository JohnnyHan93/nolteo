import { createFileRoute } from "@tanstack/react-router";
import { OWNER_MAIL } from "@/lib/owner";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <article className="panel stack">
      <h1>개인정보</h1>
      <p>놀터는 회원 가입을 받지 않아요. 별명, 글, 리뷰, 프롬프트, 팁, 직접 올린 링크, 놀이를 연 횟수는 사이트를 돌리기 위해 서버에 저장해요. 이메일이나 실명은 받지 않아요.</p>
      <p>별명을 비우면 ‘익명’으로 남아요. 글에 연락처를 적지 않는 편이 안전해요.</p>
      <p>게임 파일은 받지 않아요. 올린 주소로 이동하면 그 사이트의 규칙이 적용돼요. 지금은 광고를 보여 주지 않아요. 나중에 광고가 붙으면 구글 같은 곳에서 쿠키를 쓸 수 있어요. 광고 맞춤 설정은 구글 광고 설정에서 끌 수 있어요.</p>
      <p>
        궁금한 점이 있으면 <a href={`mailto:${OWNER_MAIL}`}>{OWNER_MAIL}</a> 으로 메일 주세요.
      </p>
    </article>
  );
}
