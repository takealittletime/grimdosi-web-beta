// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '그림도시 GRIMDOSI — 홈페이지 오픈 준비중',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '그림도시 공공안부 — 홈페이지 오픈 준비중입니다.' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css'
        }
      ]
    }
  },
  css: ['~/assets/main.css']
})
