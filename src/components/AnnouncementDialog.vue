<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible && notice"
        class="fixed inset-0 z-[120] flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="fixed inset-0 bg-black/45 backdrop-blur-sm" aria-hidden="true" />
        <Transition
          enter-active-class="transition duration-250 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="visible && notice"
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            class="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl theme-panel border shadow-2xl overflow-hidden"
          >
            <header class="flex items-start gap-3 px-6 py-5 border-b theme-border">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-xl theme-surface-soft border theme-border flex items-center justify-center text-blue-600 dark:text-blue-400"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {{ t('nav.notice') }}
                </p>
                <h3 class="mt-1 text-lg md:text-xl font-bold theme-text-primary leading-snug truncate">
                  {{ getLocalizedText(notice.title) }}
                </h3>
                <time v-if="notice.published_at" class="mt-1 block text-xs theme-text-muted font-mono">
                  {{ formatDate(notice.published_at) }}
                </time>
              </div>
              <button
                type="button"
                class="flex-shrink-0 rounded-lg p-1 theme-text-muted hover:theme-text-primary transition-colors"
                :aria-label="t('common.close')"
                @click="handleClose"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div class="flex-1 overflow-y-auto px-6 py-5">
              <div
                v-if="localizedContent"
                v-html="localizedContent"
                class="prose prose-sm md:prose-base max-w-none dark:prose-invert theme-prose"
              ></div>
              <p v-else-if="notice.summary" class="theme-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {{ getLocalizedText(notice.summary) }}
              </p>
            </div>

            <footer class="flex items-center justify-between gap-3 px-6 py-4 border-t theme-border">
              <button
                type="button"
                class="text-sm font-medium theme-link-muted"
                @click="handleViewAll"
              >
                {{ t('notice.popupViewMore') }}
              </button>
              <button
                type="button"
                class="rounded-xl theme-btn-primary px-5 py-2 text-sm font-bold transition-colors"
                @click="handleClose"
              >
                {{ t('notice.popupClose') }}
              </button>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import { postAPI } from '../api'
import { useAppStore } from '../stores/app'
import { processHtmlForDisplay } from '../utils/content'

const DISMISS_STORAGE_KEY = 'dujiao_announcement_dismissed_id'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()

const visible = ref(false)
const notice = ref<any>(null)
const dialogRef = ref<HTMLElement | null>(null)

const getLocalizedText = (jsonData: any): string => {
  if (!jsonData) return ''
  const locale = appStore.locale
  return jsonData[locale] || jsonData['zh-CN'] || jsonData['en-US'] || ''
}

const localizedContent = computed(() => {
  const raw = getLocalizedText(notice.value?.content)
  if (!raw) return ''
  const processed = processHtmlForDisplay(raw)
  return DOMPurify.sanitize(processed, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre', 'blockquote',
      'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'span', 'div', 'img', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style'],
  })
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(appStore.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

watch(visible, (isVisible) => {
  if (isVisible) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})

const handleClose = () => {
  visible.value = false
  if (notice.value?.id !== undefined && notice.value?.id !== null) {
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, String(notice.value.id))
    } catch {
      // localStorage 在隐私模式下可能不可用，忽略即可
    }
  }
}

const handleViewAll = () => {
  visible.value = false
  router.push('/notice')
}

const loadLatestNotice = async () => {
  try {
    const listResp = await postAPI.list({
      type: 'notice',
      page: 1,
      page_size: 1,
    })
    const items = listResp.data?.data || []
    const latest = items[0]
    if (!latest) return

    const dismissedId = (() => {
      try {
        return localStorage.getItem(DISMISS_STORAGE_KEY) || ''
      } catch {
        return ''
      }
    })()
    if (dismissedId && String(latest.id) === dismissedId) {
      return
    }

    let full = latest
    if (!full.content && latest.slug) {
      try {
        const detailResp = await postAPI.detail(latest.slug)
        full = detailResp.data?.data || latest
      } catch {
        // 详情拉取失败时退化为列表里的 summary 显示
      }
    }

    notice.value = full
    visible.value = true
  } catch (error) {
    console.error('Failed to load latest announcement:', error)
  }
}

onMounted(() => {
  loadLatestNotice()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>
