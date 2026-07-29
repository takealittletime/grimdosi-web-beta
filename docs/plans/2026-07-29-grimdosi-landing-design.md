# 그림도시 랜딩 페이지 — 설계 문서

작성일: 2026-07-29

## 목표

"홈페이지 오픈 준비중" 안내 페이지 1개 + 순차적으로 뜨는 긴급 알림 팝업 2개.
Nuxt 4로 만들고 Vercel로 배포한다.

## 스택

- Nuxt 4 (정적 단일 페이지), Vercel 배포
- 백엔드/데이터 페칭 없음
- 팝업 "오늘 하루 안 보기" 상태만 `localStorage`에 저장

## 구조

```
nuxt.config.ts
app/
  app.vue
  pages/index.vue          # 메인 + 팝업 오케스트레이션
  components/
    AlertPopup.vue         # "긴급 알림" 모달 (props: id, image)
    ImageZoom.vue          # 포스터 확대 보기 ("자세히 보기")
  composables/
    useDailyDismiss.ts     # 팝업별 24시간 dismiss localStorage 로직
  assets/
    alert_icon.png, bottom_logo.png, popup1.png, popup2.png
```

## 메인 페이지 (Image #1)

연한 회색 그라데이션 배경, 중앙 세로 정렬:
- 민트 삼각형 경고 아이콘 (`alert_icon.png`)
- 제목: **홈페이지 오픈 준비중**(파랑) + 입니다.(회색)
- 부제: "더 나은 서비스를 제공해 드리기 위해 / 최선을 다하겠습니다."
- 핸들: @grimdosi
- 하단 로고 (`bottom_logo.png`)
- 폰트: Pretendard (라운드 한글 근사치)
- 반응형: 중앙 flex 컬럼 + clamp()

## 팝업 흐름

1. 로드 시 localStorage 확인 → popup1이 오늘 dismiss 안 됐으면 표시
2. popup1 닫히면 → popup2 표시 (오늘 dismiss 안 됐으면)
3. 각 팝업은 자신의 "오늘 하루동안 보지 않기"만 반영 (팝업별 개별 저장)

### AlertPopup (Image #2 / #3)
- 파란 헤더: 🔔 긴급 알림 + X
- 본문: 포스터 이미지
- 푸터: ☐ 오늘 하루동안 보지 않기 · 닫기 · 자세히 보기 >
- 닫기/X: 팝업 닫고 다음 팝업 트리거. 체크 시 `localStorage["grimdosi_dismiss_<id>"] = YYYY-MM-DD`
- 자세히 보기 >: ImageZoom으로 해당 포스터 확대

### ImageZoom
- 전체화면 어두운 오버레이, 포스터 중앙 확대, 클릭/X로 닫으면 팝업 복귀

## 배포

Nuxt가 Vercel 자동 감지. 추가 설정 최소화.
