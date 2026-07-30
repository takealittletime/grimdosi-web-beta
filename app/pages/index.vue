<script setup lang="ts">
import contents from '~/assets/contents.png'
// --- 이전 메인 페이지 에셋 (주석 처리) ---
// import alertIcon from '~/assets/alert_icon.png'
// import bottomLogo from '~/assets/bottom_logo.png'
import popup1 from '~/assets/popup1.png'
import popup2 from '~/assets/popup2.png'

const INSTAGRAM_URL = 'https://www.instagram.com/grimdosi/'

// 뒤(back) → 앞(front) 순서로 1초 간격을 두고 겹쳐서 표시한다.
const POPUPS = [
  { id: 'popup2', image: popup2, alt: '그림도시 공공안부 긴급 알림 포스터 2', slot: 'slot-back' },
  { id: 'popup1', image: popup1, alt: '그림도시 공공안부 긴급 알림 포스터 1', slot: 'slot-front' }
]

const visible = reactive<Record<string, boolean>>({})
const timers: ReturnType<typeof setTimeout>[] = []

// 겹친 팝업의 앞뒤 순서(z-index). 초기: 앞(popup1) 위, 뒤(popup2) 아래.
const zCounter = ref(2)
const zOrder = reactive<Record<string, number>>({ popup2: 1, popup1: 2 })

// 클릭한 팝업을 맨 앞으로 (창 관리자처럼)
function raise(id: string) {
  zOrder[id] = ++zCounter.value
}

const shownPopups = computed(() => POPUPS.filter((p) => visible[p.id]))
const anyVisible = computed(() => shownPopups.value.length > 0)

onMounted(() => {
  // 접속 후 1.5초 대기 → 첫 팝업, 이후 1초 간격으로 겹쳐서 등장
  POPUPS.forEach((p, i) => {
    timers.push(setTimeout(() => (visible[p.id] = true), 1500 + i * 1000))
  })
})

onBeforeUnmount(() => timers.forEach(clearTimeout))

function handleClose(id: string) {
  // '오늘 하루동안 보지 않기'는 실제 동작하지 않음(재접속 시 항상 다시 노출)
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
          :style="{ zIndex: zOrder[p.id] }"
          @pointerdown="raise(p.id)"
        >
          <AlertPopup
            :id="p.id"
            :image="p.image"
            :alt="p.alt"
            @close="() => handleClose(p.id)"
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

/* 모바일: 좌우 여백을 더 주어 이미지를 조금 작게 */
@media (max-width: 640px) {
  .contents-img {
    width: 70vw;
  }
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
  pointer-events: none; /* 배경 클릭은 통과, 팝업만 상호작용 */
}

/* 팝업 높이 ≈ 폭×1.637. 세로가 넘치지 않도록 56vh(=92vh/1.637)로도 폭을 제한 */
.popup-slot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(420px, calc(100vw - 40px), 56vh);
  pointer-events: auto; /* 팝업은 클릭 가능 */
}

.slot-back {
  transform: translate(calc(-50% - 78px), calc(-50% - 72px));
}

.slot-front {
  transform: translate(calc(-50% + 78px), calc(-50% + 72px));
}

/* 좁은 화면/모바일: 팝업은 화면 안에 여백을 두고 축소, 겹침은 유지 */
@media (max-width: 640px) {
  .popup-slot {
    width: min(300px, calc(100vw - 64px), 56vh);
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
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
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
