<template>
  <div id="app" class="min-h-screen theme-page flex flex-col">
    <Navbar />
    <main class="flex-1 pb-14 lg:pb-0">
      <ErrorBoundary>
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </ErrorBoundary>
    </main>
    <Footer />
    <Loading :loading="appStore.loading" />
    <Toast />
    <ConfirmDialog />
    <AnnouncementDialog />
    <BackToTop />
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAppStore } from './stores/app'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Loading from './components/Loading.vue'
import Toast from './components/Toast.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'

// 触发后才出现的组件按需加载，避免进入首屏 entry chunk
// AnnouncementDialog 还会顺带把 dompurify 拉进来，async 后只在弹窗触发时才下载
const ConfirmDialog = defineAsyncComponent(() => import('./components/ConfirmDialog.vue'))
const AnnouncementDialog = defineAsyncComponent(() => import('./components/AnnouncementDialog.vue'))
const BackToTop = defineAsyncComponent(() => import('./components/BackToTop.vue'))

// config 由 router.beforeEach 统一加载，无需在此重复调用
const appStore = useAppStore()
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 200ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
