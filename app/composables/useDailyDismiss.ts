const PREFIX = 'grimdosi_dismiss_'

function today(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/**
 * Per-popup "오늘 하루동안 보지 않기" 로직.
 * localStorage에 팝업 id별로 마지막 dismiss 날짜(YYYY-MM-DD)를 저장한다.
 */
export function useDailyDismiss() {
  const isDismissedToday = (id: string): boolean => {
    if (import.meta.server) return false
    try {
      return localStorage.getItem(PREFIX + id) === today()
    } catch {
      return false
    }
  }

  const dismissForToday = (id: string): void => {
    if (import.meta.server) return
    try {
      localStorage.setItem(PREFIX + id, today())
    } catch {
      /* localStorage 사용 불가(시크릿 모드 등) 시 무시 */
    }
  }

  return { isDismissedToday, dismissForToday }
}
