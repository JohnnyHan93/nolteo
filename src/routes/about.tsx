import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "놀터 소개" },
      { name: "description", content: "놀터는 누군가 만든 웹게임과 테스트를 같이 구경하는 공유 놀이터예요." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="panel stack">
      <h1>놀터는요</h1>
      <p>심심할 때 들러서, 누군가 만든 웹게임이나 테스트, 낙서, 계산기를 구경하는 곳이에요.</p>
      <p>회원 가입은 없어요. 주소만 올리면 광장에 붙고, 사람들이 들어간 횟수로 순위가 매겨져요.</p>
      <p>파일은 받지 않아요. 링크를 누르면 그 사이트로 이동해요.</p>
    </article>
  );
}
