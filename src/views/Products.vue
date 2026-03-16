<template>
  <div class="products-page min-h-screen theme-page pt-20 pb-16">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="mb-12 mt-12 text-center">
        <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tight theme-text-primary">{{ t('nav.products') }}</h1>
        <p class="theme-text-secondary max-w-2xl mx-auto text-lg border-b theme-border pb-8">
          {{ t('products.subtitle') }}
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Mobile Filter Button -->
        <button @click="showFilterDrawer = true"
          class="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border theme-btn-secondary text-sm font-medium min-h-[44px]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {{ t('products.filter') }}
          <span v-if="selectedCategory" class="w-2 h-2 rounded-full theme-accent-stick"></span>
        </button>

        <!-- Mobile Filter Drawer Overlay -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <div v-if="showFilterDrawer" class="lg:hidden fixed inset-0 z-40 bg-black/50" @click="showFilterDrawer = false"
            style="overscroll-behavior: none;"></div>
        </Transition>

        <!-- Mobile Filter Drawer -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full">
          <div v-if="showFilterDrawer"
            class="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] theme-panel-strong backdrop-blur-xl border-r theme-border overflow-y-auto"
            style="overscroll-behavior: none;">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <span class="text-sm font-bold theme-text-primary flex items-center gap-2">
                  <span class="w-1 h-5 theme-accent-stick rounded-full"></span>
                  {{ t('products.filter') }}
                </span>
                <button @click="showFilterDrawer = false"
                  class="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg theme-btn-neutral">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Search in drawer -->
              <div class="mb-6">
                <label class="text-xs font-semibold uppercase tracking-wider theme-text-muted">
                  {{ t('products.searchLabel') }}
                </label>
                <div class="mt-3 flex items-center gap-2">
                  <input v-model="searchQuery" type="text"
                    class="min-w-0 flex-1 form-input"
                    :placeholder="t('products.searchPlaceholder')" />
                  <button v-if="searchQuery" type="button" @click="clearSearch"
                    class="shrink-0 whitespace-nowrap px-3 py-2.5 rounded-xl border theme-btn-secondary text-xs">
                    {{ t('common.cancel') }}
                  </button>
                </div>
              </div>

              <!-- Categories in drawer -->
              <h2 class="text-lg font-bold mb-4 theme-text-primary">{{ t('products.categories') }}</h2>
              <ul class="space-y-2">
                <li>
                  <button @click="selectedCategory = null; showFilterDrawer = false"
                    class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border min-h-[44px]"
                    :class="selectedCategory === null
                      ? 'theme-btn-primary border border-transparent'
                      : 'border-transparent theme-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'">
                    {{ t('products.allCategories') }}
                  </button>
                </li>
                <li v-for="category in categories" :key="category.id">
                  <button @click="selectedCategory = category.id; showFilterDrawer = false"
                    class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border flex items-center gap-2 min-h-[44px]"
                    :class="selectedCategory === category.id
                      ? 'theme-btn-primary border border-transparent'
                      : 'border-transparent theme-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'">
                    <img v-if="category.icon" :src="getImageUrl(category.icon)"
                      :alt="getLocalizedText(category.name)"
                      class="h-5 w-5 rounded object-cover" />
                    {{ getLocalizedText(category.name) }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </Transition>

        <!-- Desktop Sidebar - Categories -->
        <aside class="hidden lg:block lg:w-64 flex-shrink-0">
          <div class="theme-panel backdrop-blur-xl border rounded-2xl p-6 sticky top-24">
            <div class="mb-6">
              <label class="text-xs font-semibold uppercase tracking-wider theme-text-muted">
                {{ t('products.searchLabel') }}
              </label>
              <div class="mt-3 flex items-center gap-2">
                <input v-model="searchQuery" type="text"
                  class="min-w-0 flex-1 form-input"
                  :placeholder="t('products.searchPlaceholder')" />
                <button v-if="searchQuery" type="button" @click="clearSearch"
                  class="shrink-0 whitespace-nowrap px-3 py-2.5 rounded-xl border theme-btn-secondary text-xs">
                  {{ t('common.cancel') }}
                </button>
              </div>
            </div>
            <h2 class="text-lg font-bold mb-6 theme-text-primary flex items-center gap-2">
              <span class="w-1 h-5 theme-accent-stick rounded-full"></span>
              {{ t('products.categories') }}
            </h2>
            <ul class="space-y-2">
              <li>
                <button @click="selectedCategory = null"
                  class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border"
                  :class="selectedCategory === null
                    ? 'theme-btn-primary border border-transparent'
                    : 'border-transparent theme-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'">
                  {{ t('products.allCategories') }}
                </button>
              </li>
              <li v-for="category in categories" :key="category.id">
                <button @click="selectedCategory = category.id"
                  class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border flex items-center gap-2"
                  :class="selectedCategory === category.id
                    ? 'theme-btn-primary border border-transparent'
                    : 'border-transparent theme-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'">
                  <img v-if="category.icon" :src="getImageUrl(category.icon)"
                    :alt="getLocalizedText(category.name)"
                    class="h-5 w-5 rounded object-cover" />
                  {{ getLocalizedText(category.name) }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main Content - Products Grid -->
        <main class="flex-1">
          <!-- Loading Skeleton -->
          <div v-if="loading" class="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 xl:grid-cols-4">
            <div v-for="i in 8" :key="i"
              class="theme-panel rounded-2xl border overflow-hidden flex flex-col">
              <div class="h-36 md:h-44 lg:h-40 theme-skeleton"></div>
              <div class="p-3 md:p-4 space-y-3">
                <div class="h-3 w-16 rounded theme-skeleton"></div>
                <div class="h-5 w-3/4 rounded theme-skeleton"></div>
                <div class="flex gap-2">
                  <div class="h-5 w-14 rounded-full theme-skeleton"></div>
                  <div class="h-5 w-14 rounded-full theme-skeleton"></div>
                </div>
                <div class="h-3 w-full rounded theme-skeleton"></div>
                <div class="h-3 w-2/3 rounded theme-skeleton"></div>
                <div class="border-t theme-border pt-3 flex justify-between items-center">
                  <div class="h-6 w-20 rounded theme-skeleton"></div>
                  <div class="h-4 w-16 rounded theme-skeleton"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-else-if="products.length > 0">
            <div class="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 xl:grid-cols-4">
              <ProductCard
                v-for="(product, idx) in products"
                :key="product.id"
                :product="product"
                :index="idx"
                :max-tags="isMobileGrid ? 1 : 2"
                :animation-step="50"
                @click="goToProduct"
              />
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <nav
                class="flex items-center space-x-2 theme-panel-soft backdrop-blur-md p-2 rounded-2xl border">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                  class="w-12 h-12 flex items-center justify-center rounded-xl border theme-btn-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span class="px-4 py-2 font-mono theme-text-muted">
                  <span class="theme-text-primary font-bold">{{ currentPage }}</span>
                  <span class="mx-2 opacity-50">/</span>
                  <span>{{ totalPages }}</span>
                </span>

                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                  class="w-12 h-12 flex items-center justify-center rounded-xl border theme-btn-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else
            class="text-center py-20 border theme-panel-soft rounded-2xl backdrop-blur-sm theme-slide-up">
            <svg class="w-20 h-20 mx-auto theme-text-muted mb-6" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="theme-text-muted text-lg">
              {{ t('products.empty') }}
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { productAPI, categoryAPI } from '../api'
import { getImageUrl } from '../utils/image'
import { debounceAsync } from '../utils/debounce'
import { useLocalized } from '../composables/useProduct'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { getLocalizedText } = useLocalized()

const loading = ref(true)
const products = ref<any[]>([])
const categories = ref<any[]>([])
const selectedCategory = ref<number | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const totalPages = ref(0)
const showFilterDrawer = ref(false)

// Detect mobile 2-col grid (< md breakpoint)
const isMobileGrid = ref(window.innerWidth < 768)
const handleResize = () => {
  isMobileGrid.value = window.innerWidth < 768
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      page_size: pageSize.value,
    }
    if (selectedCategory.value) {
      params.category_id = selectedCategory.value
    }
    const keyword = searchQuery.value.trim()
    if (keyword) {
      params.search = keyword
    }
    const response = await productAPI.list(params)
    products.value = response.data.data || []
    if (response.data.pagination) {
      total.value = response.data.pagination.total || 0
      totalPages.value = response.data.pagination.total_page || 0
    }
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await categoryAPI.list()
    categories.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const debouncedLoadProducts = debounceAsync(loadProducts, 300)
const debouncedLoadCategories = debounceAsync(loadCategories, 250)

const goToProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  debouncedLoadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearSearch = () => {
  if (!searchQuery.value) return
  searchQuery.value = ''
  currentPage.value = 1
  debouncedLoadProducts()
}

watch(selectedCategory, () => {
  currentPage.value = 1
  debouncedLoadProducts()
  // 同步 URL：分类切换时更新地址栏
  if (selectedCategory.value) {
    const matched = categories.value.find((c: any) => c.id === selectedCategory.value)
    if (matched?.slug) {
      router.replace({ name: 'category-products', params: { slug: matched.slug } })
    }
  } else if (route.name === 'category-products') {
    router.replace({ name: 'products' })
  }
})

watch(searchQuery, () => {
  currentPage.value = 1
  debouncedLoadProducts()
})

onMounted(async () => {
  window.addEventListener('resize', handleResize, { passive: true })
  await debouncedLoadCategories()
  // 如果是 /categories/:slug 路由，根据 slug 自动选中分类
  const slugParam = route.params.slug as string | undefined
  if (slugParam && categories.value.length > 0) {
    const matched = categories.value.find((c: any) => c.slug === slugParam)
    if (matched) {
      selectedCategory.value = matched.id
      // watch 会触发 loadProducts，无需手动调用
      return
    }
  }
  await debouncedLoadProducts()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  debouncedLoadProducts.cancel()
  debouncedLoadCategories.cancel()
})
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
