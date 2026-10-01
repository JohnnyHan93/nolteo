import type { CatalogItem, Comment, Post, PromptCard, TipCard } from "@/lib/yard/types";

export const categories = [
  { id: "all", label: "전체" },
  { id: "game", label: "웹게임" },
  { id: "flash", label: "짧은 게임" },
  { id: "psych", label: "심리" },
  { id: "draw", label: "그리기" },
  { id: "calc", label: "계산" },
  { id: "tool", label: "도구" },
  { id: "ai", label: "AI" },
  { id: "made", label: "내가 만든 것" },
] as const;

const shelf: Array<Omit<CatalogItem, "by">> = [
  {
    id: "neal",
    title: "Neal.fun",
    blurb: "인터넷의 쓸모없는 실험 모음. 하나 열면 옆 칸이 보인다.",
    category: "game",
    kind: "외부",
    href: "https://neal.fun",
    tags: ["실험", "영어"],
  },
  {
    id: "craft",
    title: "Infinite Craft",
    blurb: "단어를 붙여 새 단어를 만든다. 수집이 길다.",
    category: "game",
    kind: "외부",
    href: "https://neal.fun/infinite-craft",
    tags: ["조합"],
  },
  {
    id: "quickdraw",
    title: "Quick, Draw!",
    blurb: "20초 안에 그리면 구글이 맞힌다.",
    category: "draw",
    kind: "외부",
    href: "https://quickdraw.withgoogle.com",
    tags: ["그림", "AI"],
  },
  {
    id: "2048",
    title: "2048",
    blurb: "숫자 타일을 밀어 2048을 만든다. 한 판이 길다.",
    category: "flash",
    kind: "외부",
    href: "https://play2048.co",
    tags: ["퍼즐"],
  },
  {
    id: "little",
    title: "Little Alchemy 2",
    blurb: "원소를 붙여 새 물건을 만든다.",
    category: "game",
    kind: "외부",
    href: "https://littlealchemy2.com",
    tags: ["조합"],
  },
  {
    id: "radio",
    title: "Radio Garden",
    blurb: "지구본을 돌려 그 도시 라디오를 튼다.",
    category: "tool",
    kind: "외부",
    href: "https://radio.garden",
    tags: ["소리", "지도"],
  },
  {
    id: "monkey",
    title: "Monkeytype",
    blurb: "타자 속도. 1분만 해도 숫자가 나온다.",
    category: "tool",
    kind: "외부",
    href: "https://monkeytype.com",
    tags: ["타자"],
  },
  {
    id: "excal",
    title: "Excalidraw",
    blurb: "손그림 느낌의 화이트보드.",
    category: "draw",
    kind: "외부",
    href: "https://excalidraw.com",
    tags: ["그림"],
  },
  {
    id: "photopea",
    title: "Photopea",
    blurb: "브라우저 포토샵. 설치 없이 PSD를 연다.",
    category: "tool",
    kind: "외부",
    href: "https://www.photopea.com",
    tags: ["편집"],
  },
  {
    id: "openpsych",
    title: "OpenPsychometrics",
    blurb: "빅파이브와 고전 성격 검사를 길게 본다.",
    category: "psych",
    kind: "외부",
    href: "https://openpsychometrics.org",
    tags: ["심리", "영어"],
  },
  {
    id: "human",
    title: "Human Benchmark",
    blurb: "반응, 기억, 청력. 점수로 남는 미니 실험.",
    category: "psych",
    kind: "외부",
    href: "https://humanbenchmark.com",
    tags: ["테스트"],
  },
  {
    id: "patatap",
    title: "Patatap",
    blurb: "키보드를 누르면 소리와 도형이 같이 나온다.",
    category: "game",
    kind: "외부",
    href: "https://patatap.com",
    tags: ["소리"],
  },
  {
    id: "useless",
    title: "The Useless Web",
    blurb: "버튼을 누르면 쓸모없는 사이트로 던진다.",
    category: "game",
    kind: "외부",
    href: "https://theuselessweb.com",
    tags: ["랜덤"],
  },
  {
    id: "window",
    title: "Window Swap",
    blurb: "다른 사람 창밖을 10초만 본다.",
    category: "tool",
    kind: "외부",
    href: "https://www.window-swap.com",
    tags: ["풍경"],
  },
  {
    id: "coolors",
    title: "Coolors",
    blurb: "스페이스바로 색 조합을 돌린다.",
    category: "tool",
    kind: "외부",
    href: "https://coolors.co",
    tags: ["색"],
  },
  {
    id: "desmos",
    title: "Desmos",
    blurb: "그래프 계산기. 식을 치면 선이 움직인다.",
    category: "calc",
    kind: "외부",
    href: "https://www.desmos.com/calculator",
    tags: ["계산", "그래프"],
  },
  {
    id: "agar",
    title: "agar.io",
    blurb: "동그라미를 키우는 짧은 판.",
    category: "flash",
    kind: "외부",
    href: "https://agar.io",
    tags: ["멀티"],
  },
  {
    id: "skribbl",
    title: "skribbl.io",
    blurb: "그림 맞히기. 방 코드만 있으면 된다.",
    category: "draw",
    kind: "외부",
    href: "https://skribbl.io",
    tags: ["멀티", "그림"],
  },
  {
    id: "cookie",
    title: "Cookie Clicker",
    blurb: "쿠키를 누르는 게임. 켜 두고 잊기 좋다.",
    category: "game",
    kind: "외부",
    href: "https://orteil.dashnet.org/cookieclicker/",
    tags: ["클리커"],
  },
  {
    id: "slow",
    title: "Slow Roads",
    blurb: "끝없는 길을 운전한다. 목적은 없다.",
    category: "game",
    kind: "외부",
    href: "https://slowroads.io",
    tags: ["드라이브"],
  },
  {
    id: "wordle",
    title: "Wordle",
    blurb: "다섯 글자. 하루에 한 판이 정석이지만 연습도 있다.",
    category: "flash",
    kind: "외부",
    href: "https://www.nytimes.com/games/wordle",
    tags: ["단어"],
  },
  {
    id: "regex",
    title: "Regex101",
    blurb: "정규식을 바로 시험한다.",
    category: "tool",
    kind: "외부",
    href: "https://regex101.com",
    tags: ["개발"],
  },
];

export const catalogItems: CatalogItem[] = shelf.map((item, index) => ({
  ...item,
  by: ["익명의 비둘기", "익명의 너구리", "익명의 문어", "익명의 여우", "익명의 고양이"][index % 5] ?? "익명",
}));

export const CATALOG_IDS = new Set(catalogItems.map((item) => item.id));

export const shareCategories = categories.filter((category) => category.id !== "all");

export const seedPosts: Post[] = [
  {
    id: "p1",
    nick: "익명의 비둘기",
    tag: "홍보",
    title: "점심시간에 돌아가는 타자 놀이 올려 둠",
    body: "회사 와이파이에서도 열린다. 점수 저장은 없고, 한 판 30초다. 이상한 점 있으면 여기 달아 주세요.",
    created: "2026-09-28T03:12:00.000Z",
    comments: [
      {
        id: "c1",
        nick: "익명의 고양이",
        body: "모바일에서 키 간격이 좁다.",
        created: "2026-09-28T05:01:00.000Z",
      },
    ],
  },
  {
    id: "p2",
    nick: "익명의 너구리",
    tag: "리뷰",
    title: "Radio Garden은 밤 이동 중에 잘 맞음",
    body: "도시 이름 모르고 찍는 재미가 있다. 광고는 거의 없고 로딩만 가끔 길다.",
    created: "2026-09-29T11:40:00.000Z",
    comments: [],
  },
  {
    id: "p3",
    nick: "익명의 문어",
    tag: "질문",
    title: "심리테스트 직접 만든 사람 있음?",
    body: "결과 4개 정도로 짧게 만드는 구조가 궁금하다. 질문 수랑 분기만 공유해 주면 된다.",
    created: "2026-09-30T08:20:00.000Z",
    comments: [
      {
        id: "c2",
        nick: "익명의 여우",
        body: "질문 6개, 한쪽으로 몰리면 결과 4개로 끝난다. 놀터의 ‘지금 심심 유형’이 그 꼴이다.",
        created: "2026-09-30T09:02:00.000Z",
      },
    ],
  },
];

export const SEED_POST_IDS = new Set(seedPosts.map((post) => post.id));

export const seedPrompts: PromptCard[] = [
  {
    id: "pr1",
    title: "한 장짜리 심리테스트 결과 문장",
    model: "범용",
    body: "너는 심리테스트 작가다. 사용자 성향 키워드 3개를 받아, 판단하지 않는 말투로 결과 제목 1개와 본문 80자를 써라. 의학 진단처럼 쓰지 말 것.",
    nick: "익명의 여우",
    created: "2026-09-27T02:00:00.000Z",
  },
  {
    id: "pr2",
    title: "웹게임 규칙 한 줄 다듬기",
    model: "범용",
    body: "아래 게임 규칙을 중학생도 읽는 한국어 한 줄로 줄여라. 조작, 목표, 끝나는 조건만 남겨라.",
    nick: "익명의 비둘기",
    created: "2026-09-27T04:00:00.000Z",
  },
  {
    id: "pr3",
    title: "깃허브 README 첫 단락",
    model: "범용",
    body: "저장소 이름과 한 줄 설명을 받아 README 첫 단락을 써라. 기능 나열 대신 누가 언제 쓰는지부터 말하라. 과장 형용사 금지.",
    nick: "익명의 문어",
    created: "2026-09-27T06:00:00.000Z",
  },
];

export const seedTips: TipCard[] = [
  {
    id: "t1",
    title: "바이브 코딩은 화면부터 고정한다",
    body: "기능 목록보다 첫 화면의 빈 상태를 먼저 그린다. 빈 상태가 있으면 데이터 없어도 배포할 수 있다.",
    github: "https://github.com",
    nick: "익명의 너구리",
    created: "2026-09-26T01:00:00.000Z",
  },
  {
    id: "t2",
    title: "광고 자리는 높이부터 잡아 둔다",
    body: "애드센스 승인 전에 슬롯 높이를 비워 두면 나중에 레이아웃이 밀리지 않는다. ads.txt와 개인정보처리방침은 심사 전에 공개한다.",
    github: "",
    nick: "익명의 여우",
    created: "2026-09-26T03:00:00.000Z",
  },
  {
    id: "t3",
    title: "클릭은 떠나기 전에 센다",
    body: "새 탭을 열기 전에 카운트를 올리면 이탈해도 지표가 남는다. 일간 숫자는 서울 날짜가 바뀌면 다시 0부터 쌓인다.",
    github: "https://github.com",
    nick: "익명의 문어",
    created: "2026-09-26T05:00:00.000Z",
  },
];

export const POST_TAGS = ["잡담", "홍보", "리뷰", "질문", "팁"] as const;

export function hostOf(href: string): string {
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function mergeComments(base: Comment[], extra: Comment[]): Comment[] {
  const seen = new Set(base.map((comment) => comment.id));
  return [...base, ...extra.filter((comment) => !seen.has(comment.id))];
}
