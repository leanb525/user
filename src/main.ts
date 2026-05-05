import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import './style.css'
import App from './App.vue'
import router, { warmupCommonRoutes } from './router'
import i18n from './i18n'
import { useTelegramMiniAppStore } from './stores/telegramMiniApp'
import { isTelegramUrlEnvironment } from './utils/telegramMiniApp'

const app = createApp(App)
const head = createHead()
const pinia = createPinia()

app.use(pinia)
app.use(head)
app.use(router)
app.use(i18n)

const tgStore = useTelegramMiniAppStore(pinia)
if (isTelegramUrlEnvironment()) {
  // Telegram 环境：等 SDK 加载完再挂载，避免首次渲染时 viewport / 主题抖动
  tgStore.init().then(() => {
    app.mount('#app')
  })
} else {
  // 普通浏览器：立即挂载，init 在后台执行（同步路径几乎无副作用）
  void tgStore.init()
  app.mount('#app')
}

void router.isReady().then(() => {
    warmupCommonRoutes()
})
