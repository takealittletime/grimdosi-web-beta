<script setup lang="ts">
import txtAlert from '~/assets/긴급알림.png'
import txtClose from '~/assets/닫기.png'
import txtDontShow from '~/assets/오늘하루동안보지않기.png'
import txtDetail from '~/assets/자세히보기2.png'

const props = defineProps<{
  id: string
  image: string
  alt?: string
}>()

const emit = defineEmits<{
  /** 닫기(X/닫기 버튼). dontShowToday=true면 오늘 하루 dismiss */
  close: [dontShowToday: boolean]
  /** 자세히 보기: 포스터 확대 */
  detail: []
}>()

const dontShow = ref(false)

function onClose() {
  emit('close', dontShow.value)
}

/* ---- 팝업 드래그 이동 ---- */
const dragX = ref(0)
const dragY = ref(0)
const dragging = ref(false)
let originX = 0
let originY = 0

function onPointerDown(e: PointerEvent) {
  // 버튼·체크박스 등 인터랙션 요소에서는 드래그 시작 안 함
  const el = e.target as HTMLElement
  if (el.closest('button, input, label, a')) return
  e.preventDefault()
  dragging.value = true
  originX = e.clientX - dragX.value
  originY = e.clientY - dragY.value
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  dragX.value = e.clientX - originX
  dragY.value = e.clientY - originY
}

function onPointerUp() {
  dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<template>
  <div
    class="popup"
    :class="{ dragging }"
    :style="{ transform: `translate(${dragX}px, ${dragY}px)` }"
    role="dialog"
    aria-modal="true"
    aria-label="긴급 알림"
    @pointerdown="onPointerDown"
  >
    <header class="popup-header">
      <span class="popup-title">
        <svg
          class="bell"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
        <img :src="txtAlert" alt="긴급 알림" class="txt-alert" />
      </span>
      <button class="header-x" aria-label="닫기" @click="onClose">✕</button>
    </header>

    <div class="popup-body">
      <img :src="image" :alt="alt ?? '긴급 알림 포스터'" class="poster" />
    </div>

    <footer class="popup-footer">
      <label class="dont-show">
        <input v-model="dontShow" type="checkbox" />
        <img :src="txtDontShow" alt="오늘 하루동안 보지 않기" class="txt-dontshow" />
      </label>
      <div class="footer-buttons">
        <button class="btn btn-close" @click="onClose">
          <img :src="txtClose" alt="닫기" class="txt-btn" />
        </button>
        <button class="btn btn-detail" @click="emit('detail')">
          <img :src="txtDetail" alt="자세히 보기" class="txt-btn" />
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/*
 * Figma 기준 (node 47-232, 470폭):
 *   - 헤더 38px → 8.09cqw, 푸터 79px → 16.8cqw (폭 기준 고정)
 *   - 본문 포스터는 사방 균일 padding(cqw)으로 배치 → 레터박스 없이 여백 동일
 *   - 팝업 높이는 내용에 따라 결정(≈ 폭 × 1.637)
 */
.popup {
  /* 팝업 전체 폰트: 맑은 고딕 */
  font-family: 'Malgun Gothic', 'malgun gothic', '맑은 고딕', 'Apple SD Gothic Neo',
    sans-serif;
  width: 100%;
  /* 자식 요소가 팝업 폭(cqw) 기준으로 스케일되도록 컨테이너 지정 */
  container-type: inline-size;
  background: #fff;
  /* 팝업 폭에 비례하는 라운드 */
  border-radius: clamp(4px, 1.6cqw, 8px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  cursor: grab;
  touch-action: none;
}

.popup.dragging {
  cursor: grabbing;
  user-select: none;
}

.popup-header {
  /* Figma 헤더 38px @ 470폭 = 8.09cqw */
  flex: 0 0 auto;
  height: 8.09cqw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(8px, 4%, 18px);
  background: var(--grim-blue);
  color: #fff;
}

.popup-title {
  display: inline-flex;
  align-items: center;
  gap: clamp(4px, 1.4cqw, 7px);
}

.bell {
  width: clamp(11px, 3.6cqw, 17px);
  height: clamp(11px, 3.6cqw, 17px);
  flex: 0 0 auto;
}

/* 텍스트 대신 넣는 PNG들: 팝업 폭(cqw) 기준으로 스케일, 원본 크기 이상으로 확대 안 함 */
.txt-alert {
  height: clamp(9px, 3cqw, 13px);
  width: auto;
  display: block;
}

.txt-dontshow {
  height: clamp(7px, 2.2cqw, 10px);
  width: auto;
  display: block;
}

.txt-btn {
  height: clamp(8px, 2.6cqw, 12px);
  width: auto;
  display: block;
}

.header-x {
  border: none;
  background: transparent;
  color: #fff;
  font-size: clamp(10px, 3.8cqw, 18px);
  line-height: 1;
  padding: 4px;
  opacity: 0.95;
}

.header-x:hover {
  opacity: 0.7;
}

.popup-body {
  flex: 0 0 auto;
  overflow: hidden;
  background: #fff;
}

.poster {
  /*
   * 포스터가 자기 높이를 결정 → object-fit 레터박스 없음 → 사방 여백이 padding 값으로 정확히 동일.
   * padding은 팝업 폭 기준(cqw)이라 어떤 크기에서도 상·하·좌·우가 같게 유지된다.
   */
  display: block;
  width: 100%;
  height: auto;
  padding: 3.15cqw;
}

.popup-footer {
  /* Figma 푸터 79px @ 470폭 = 16.8cqw */
  flex: 0 0 auto;
  min-height: 16.8cqw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 clamp(12px, 4%, 16px);
  border-top: 1px solid #D2D0D1;
}

.dont-show {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  font-size: clamp(8px, 2.8cqw, 13px);
  color: #202020;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
}

/* 체크박스: 라운드 사각 아웃라인 (#B5B5B5), 약 18px @ 470폭 */
.dont-show input {
  appearance: none;
  -webkit-appearance: none;
  width: clamp(11px, 3.8cqw, 18px);
  height: clamp(11px, 3.8cqw, 18px);
  flex: 0 0 auto;
  border: 1px solid #b5b5b5;
  border-radius: 4px;
  background: #fff;
  position: relative;
  cursor: pointer;
}

/* 체크됨: 브랜드 블루 채움 + 흰 체크 */
.dont-show input:checked {
  background: var(--grim-blue);
  border-color: var(--grim-blue);
}

.dont-show input:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 46%;
  width: 26%;
  height: 54%;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -55%) rotate(45deg);
}

.footer-buttons {
  display: flex;
  gap: clamp(5px, 1.3cqw, 6px);
}

/* 기본: 흰 배경 + 연한 회색 테두리 (#EEEDEE), hover 시 회색 채움 (#D2D0D1) */
.btn {
  min-width: clamp(58px, 23.4cqw, 110px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #eeedee;
  color: #202020;
  font-size: clamp(9px, 3cqw, 14px);
  font-weight: 700;
  padding: clamp(6px, 2.5cqw, 12px) clamp(10px, 4cqw, 20px);
  border-radius: clamp(3px, 1.1cqw, 5px);
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.btn:hover {
  background: #d2d0d1;
  border-color: #d2d0d1;
}

/*
 * 좁은 팝업(모바일 등): 한 줄에 다 못 들어가 잘리므로 두 줄로 줄바꿈.
 * 체크박스 줄(위) + 버튼 줄(아래, 반반 분할). 왼쪽 정렬 유지, 잘림 방지.
 * 팝업이 컨테이너(container-type: inline-size)라 팝업 폭 기준으로 동작.
 */
@container (max-width: 380px) {
  .popup-footer {
    flex: 0 0 auto; /* 고정 높이 비율 해제 → 내용 높이만큼 */
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: center;
    row-gap: clamp(6px, 2.5cqw, 10px);
    padding-top: clamp(8px, 3cqw, 12px);
    padding-bottom: clamp(8px, 3cqw, 12px);
  }
  .dont-show {
    flex: 1 0 100%; /* 체크박스 줄이 한 줄 전체 차지 → 버튼은 다음 줄로 */
  }
  .footer-buttons {
    width: 100%;
  }
  .btn {
    flex: 1;
    min-width: 0; /* 두 버튼이 줄을 반반 나눠 채움 */
  }
}
</style>
