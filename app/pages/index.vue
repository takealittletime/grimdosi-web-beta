<script setup lang="ts">
import contents from '~/assets/contents.png'
// --- 이전 메인 페이지 에셋 (주석 처리) ---
// import alertIcon from '~/assets/alert_icon.png'
// import bottomLogo from '~/assets/bottom_logo.png'
import popup1 from '~/assets/popup1.png'
import popup2 from '~/assets/popup2.png'

const INSTAGRAM_URL = 'https://www.instagram.com/grimdosi?igsh=a2k1dDRxdDE5YW8x'

const { isDismissedToday, dismissForToday } = useDailyDismiss()

// 뒤(back) → 앞(front) 순서로 1초 간격을 두고 겹쳐서 표시한다.
const POPUPS = [
  { id: 'popup2', image: popup2, alt: '그림도시 공공안부 긴급 알림 포스터 2', slot: 'slot-back' },
  { id: 'popup1', image: popup1, alt: '그림도시 공공안부 긴급 알림 포스터 1', slot: 'slot-front' }
]

const visible = reactive<Record<string, boolean>>({})
const timers: ReturnType<typeof setTimeout>[] = []

const shownPopups = computed(() => POPUPS.filter((p) => visible[p.id]))
const anyVisible = computed(() => shownPopups.value.length > 0)

onMounted(() => {
  // 오늘 dismiss되지 않은 팝업만, 1초 간격으로 순차 등장(겹침)
  POPUPS.filter((p) => !isDismissedToday(p.id)).forEach((p, i) => {
    timers.push(setTimeout(() => (visible[p.id] = true), i * 1000))
  })
})

onBeforeUnmount(() => timers.forEach(clearTimeout))

function handleClose(id: string, dontShowToday: boolean) {
  if (dontShowToday) dismissForToday(id)
  visible[id] = false
}

function openDetail() {
  window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="landing">
    <main class="content">
      <img :src="contents" alt="홈페이지 오픈 준비중입니다. @grimdosi" class="contents-img" />
    </main>

    <!-- ===== 이전 메인 페이지 내용 (주석 처리) =====
    <main class="content">
      <img :src="alertIcon" alt="" class="alert-icon" />

      <h1 class="title">
        <span class="title-strong">홈페이지 오픈 준비중</span><span class="title-tail">입니다.</span>
      </h1>

      <p class="subtitle">
        더 나은 서비스를 제공해 드리기 위해<br />
        최선을 다하겠습니다.
      </p>

      <p class="handle">@grimdosi</p>

      <img :src="bottomLogo" alt="공공안부 · GRIMDOSI PUBLIC HELLO" class="bottom-logo" />
    </main>
    ============================================ -->

    <!-- 겹쳐서 뜨는 긴급 알림 팝업들 -->
    <div v-if="anyVisible" class="popup-layer">
      <TransitionGroup name="pop">
        <div
          v-for="p in shownPopups"
          :key="p.id"
          class="popup-slot"
          :class="p.slot"
        >
          <AlertPopup
            :id="p.id"
            :image="p.image"
            :alt="p.alt"
            @close="(dont: boolean) => handleClose(p.id, dont)"
            @detail="openDetail"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(
    to top,
    #cacaca 0%,
    #d9d9d9 17%,
    #eeeeee 45%,
    #fafafa 73%,
    #ffffff 100%
  );
  /* 메인 페이지 전체 궁서체 */
  font-family: '궁서', GungSeo, Gungseouche, Gungsuh, GungsuhChe, '바탕', Batang, serif;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 640px;
}

.contents-img {
  width: min(100%, 900px);
  height: auto;
}

.alert-icon {
  width: clamp(84px, 12vw, 128px);
  height: auto;
  margin-bottom: clamp(24px, 4vw, 40px);
}

.title {
  font-size: clamp(26px, 5vw, 40px);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: clamp(20px, 3vw, 32px);
}

.title-strong {
  color: var(--grim-blue);
}

.title-tail {
  color: var(--grim-gray);
  font-size: 0.62em;
  font-weight: 600;
}

.subtitle {
  font-size: clamp(15px, 2.2vw, 19px);
  line-height: 1.7;
  color: var(--grim-gray);
  font-weight: 500;
  margin-bottom: clamp(28px, 4vw, 44px);
}

.handle {
  font-size: clamp(15px, 2vw, 18px);
  color: var(--grim-gray-light);
  letter-spacing: 0.02em;
  margin-bottom: clamp(36px, 6vw, 64px);
}

.bottom-logo {
  width: clamp(180px, 26vw, 260px);
  height: auto;
  opacity: 0.85;
}

/* ---- 팝업 레이어(겹침 배치) ---- */
.popup-layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.45);
}

.popup-slot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(420px, calc(100vw - 40px));
}

.slot-back {
  transform: translate(calc(-50% - 78px), calc(-50% - 72px));
  z-index: 100;
}

.slot-front {
  transform: translate(calc(-50% + 78px), calc(-50% + 72px));
  z-index: 101;
}

/* 좁은 화면/모바일: 팝업은 화면 안에 여백을 두고 축소, 겹침은 유지 */
@media (max-width: 640px) {
  .popup-slot {
    width: min(300px, calc(100vw - 64px));
  }
  .slot-back {
    transform: translate(calc(-50% - 14px), calc(-50% - 40px));
  }
  .slot-front {
    transform: translate(calc(-50% + 14px), calc(-50% + 40px));
  }
}

/* 등장 애니메이션 */
.pop-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.pop-enter-from {
  opacity: 0;
}
.slot-back.pop-enter-from {
  transform: translate(calc(-50% - 78px), calc(-50% - 52px)) scale(0.96);
}
.slot-front.pop-enter-from {
  transform: translate(calc(-50% + 78px), calc(-50% + 92px)) scale(0.96);
}
.pop-leave-active {
  transition: opacity 0.2s ease;
}
.pop-leave-to {
  opacity: 0;
}
</style>
