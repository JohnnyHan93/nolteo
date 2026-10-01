# 놀터

심심할 때 들어오는 킬링타임 놀이터. 웹게임, 심리테스트, 그리기, 계산기, 만든 앱 링크를 모아 클릭 수로 일간·주간·월간 순위를 매긴다.

## 로컬

```bash
npm install
npm run dev
```

## 광고

1. 개인 도메인을 연결한다.
2. Vercel 환경변수 `VITE_ADSENSE_CLIENT=ca-pub-...` 를 넣는다.
3. `public/ads.txt` 예시 줄을 본인 퍼블리셔 줄로 바꾼다.
4. `/privacy` 에 운영자 연락처를 넣는다.

광고 스크립트는 환경변수가 있을 때만 로드된다.

## 지표

클릭, 글, 리뷰, 직접 올린 링크는 브라우저 localStorage에 저장된다. 이용자마다 같은 랭킹을 보려면 Upstash Redis나 Supabase 카운터를 다음 단계에서 붙인다.
