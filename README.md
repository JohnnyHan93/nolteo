# 놀터

심심할 때 들어오는 링크 광장. 웹게임, 심리테스트, 낙서, 계산기, 만든 앱 주소를 올리고 들어간 횟수로 오늘·이번 주·이번 달 순위를 매긴다.

## 배포

Vercel에서 `main`을 배포한다. 빌드는 `npm run build`.

- `VITE_AUTH_ENABLED=false` (가입 없음)
- 순위를 사람마다 같이 보려면 `DATABASE_URL`에 Postgres(Neon) 주소를 넣는다. 없으면 서버 메모리에만 남아서 인스턴스가 바뀌면 초기화된다.
- 광고는 `VITE_ADSENSE_CLIENT=ca-pub-...` 를 넣기 전에는 안 보인다.
