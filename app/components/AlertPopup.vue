<script setup lang="ts">
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
</script>

<template>
  <div class="popup" role="dialog" aria-modal="true" aria-label="긴급 알림">
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
        긴급 알림
      </span>
      <button class="header-x" aria-label="닫기" @click="onClose">✕</button>
    </header>

    <div class="popup-body">
      <img :src="image" :alt="alt ?? '긴급 알림 포스터'" class="poster" />
    </div>

    <footer class="popup-footer">
      <label class="dont-show">
        <input v-model="dontShow" type="checkbox" />
        <span>오늘 하루동안 보지 않기</span>
      </label>
      <div class="footer-buttons">
        <button class="btn btn-close" @click="onClose">닫기</button>
        <button class="btn btn-detail" @click="emit('detail')">
          자세히 보기 <span aria-hidden="true">›</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.popup {
  /* 팝업 전체 폰트: 맑은 고딕 */
  font-family: 'Malgun Gothic', 'malgun gothic', '맑은 고딕', 'Apple SD Gothic Neo',
    sans-serif;
  width: 100%;
  max-width: 420px;
  max-height: 92vh;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
}

.popup-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: var(--grim-blue);
  color: #fff;
}

.popup-title {
  font-size: 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.header-x {
  border: none;
  background: transparent;
  color: #fff;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
  opacity: 0.95;
}

.header-x:hover {
  opacity: 0.7;
}

.popup-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 14px;
  background: #fff;
}

.poster {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.popup-footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid #eef0f2;
  flex-wrap: wrap;
}

.dont-show {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #666;
  user-select: none;
  cursor: pointer;
}

.dont-show input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.footer-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  border: 1px solid #d6d9dd;
  background: #fff;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: 8px;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.btn:hover {
  background: #d3d3d3;
  border-color: #c4c4c4;
}

.btn-detail {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 480px) {
  /* 좁은 화면: 세로로 쌓되 왼쪽 정렬 유지(가운데 정렬 방지) */
  .popup-footer {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
    padding: 12px 14px;
  }
  .footer-buttons {
    width: 100%;
  }
  .btn {
    flex: 1;
    padding: 9px 10px;
    font-size: 13px;
  }
  .popup-header {
    padding: 12px 14px;
  }
  .popup-title {
    font-size: 15px;
  }
}
</style>
