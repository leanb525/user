import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import './style.css'
import App from './App.vue'
import router, { warmupCommonRoutes } from './router'
import i18n from './i18n'
import { useTelegramMiniAppStore } from './stores/telegramMiniApp'

const app = createApp(App)
const head = createHead()
const pinia = createPinia()

app.use(pinia)
app.use(head)
app.use(router)
app.use(i18n)

useTelegramMiniAppStore(pinia).init().then(() => {
  app.mount('#app')
})

void router.isReady().then(() => {
    warmupCommonRoutes()
})
