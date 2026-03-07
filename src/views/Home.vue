<template>
  <div class="home-page min-h-screen theme-page">
    <section class="relative z-10 border-b theme-border pt-24 pb-10">
      <div class="container mx-auto px-4">
        <div class="relative overflow-hidden rounded-2xl border theme-panel"
          @touchstart="onBannerTouchStart"
          @touchend="onBannerTouchEnd">
          <!-- Banner image with fade transition -->
          <Transition name="banner-fade" mode="out-in">
            <img v-if="!bannerLoading && heroImage" :src="heroImage" :key="heroImage" class="absolute inset-0 h-full w-full object-cover" />
          </Transition>
          <div class="absolute inset-0 bg-black/50"></div>

            <div v-if="bannerLoading" class="relative flex min-h-[420px] flex-col justify-between p-8 md:p-12">
            <div class="mb-4 flex items-center justify-end">
              <span class="theme-badge theme-badge-inverse text-xs font-medium">
                {{ t('common.loading') }}
              </span>
            </div>

            <div class="space-y-4">
              <div class="h-6 w-28 theme-skeleton rounded-full" style="background: rgba(255,255,255,0.35)"></div>
              <div class="h-10 max-w-4xl theme-skeleton rounded-xl md:h-14" style="background: rgba(255,255,255,0.35)"></div>
              <div class="h-5 max-w-3xl theme-skeleton rounded-lg" style="background: rgba(255,255,255,0.3)"></div>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-6">
              <div class="h-11 w-36 theme-skeleton rounded-lg" style="background: rgba(255,255,255,0.35)"></div>
              <div class="h-11 w-28 theme-skeleton rounded-lg" style="background: rgba(255,255,255,0.25)"></div>
            </div>
          </div>

          <div v-else class="relative flex min-h-[420px] flex-col justify-between p-8 md:p-12">
            <div v-if="bannerCount > 1" class="mb-4 flex items-center justify-end gap-2">
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition hover:bg-black/35"
                @click="handlePrevHeroBanner"
                :aria-label="t('common.previousBanner')"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition hover:bg-black/35"
                @click="handleNextHeroBanner"
                :aria-label="t('common.nextBanner')"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <span class="theme-badge theme-badge-inverse gap-2 text-xs font-semibold uppercase tracking-wider">
                <span class="h-2 w-2 rounded-full bg-emerald-300"></span>
                {{ heroBadge }}
              </span>
              <h1 class="max-w-4xl text-3xl font-semibold tracking-[-0.02em] text-white md:text-[2.85rem]">
                {{ heroTitle }}
              </h1>
              <p class="max-w-3xl text-sm leading-relaxed text-gray-100 md:text-base">
                {{ heroSubtitle }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-6">
              <button
                type="button"
                @click="goToHeroLink"
                class="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:scale-105 min-h-[44px]"
              >
                {{ heroPrimaryButtonText }}
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <router-link
                v-if="!hasHeroLink"
                to="/products"
                class="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white/10 min-h-[44px]"
              >
                {{ t('home.featured.viewAll') }}
              </router-link>
            </div>

            <div v-if="bannerCount > 1" class="mt-5 flex items-center gap-2">
              <button
                v-for="(_, index) in banners"
                :key="`hero-dot-${index}`"
                type="button"
                class="h-2.5 rounded-full transition-all"
                :class="index === currentBannerIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'"
                @click="selectHeroBanner(index)"
                :aria-label="t('common.switchBanner', { n: index + 1 })"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="featured" class="relative z-10 py-14">
      <div class="container mx-auto px-4">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 class="theme-section-heading text-3xl md:text-4xl">{{ t('home.featured.title') }}</h2>
            <p class="mt-2 text-sm theme-text-secondary">{{ t('home.featured.description') }}</p>
          </div>
          <router-link
                v-if="!hasHeroLink"
                to="/products"
            class="text-sm font-semibold theme-link-muted"
          >
            {{ t('home.featured.viewAll') }}
          </router-link>
        </div>

        <div v-if="products.length > 0" class="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          <article
            v-for="(product, idx) in products"
            :key="product.id"
            class="group cursor-pointer overflow-hidden rounded-2xl border theme-panel shadow-sm transition flex h-full flex-col theme-slide-up"
            :style="{ animationDelay: `${idx * 60}ms` }"
            :class="isSoldOut(product)
              ? 'opacity-85 grayscale-[0.25] saturate-50 border-rose-300/60 dark:border-rose-900/40 hover:-translate-y-0 hover:shadow-sm'
              : 'hover:-translate-y-1 hover:shadow-lg'"
            @click="goToProduct(product.slug)"
          >
            <div class="relative h-36 md:h-56 overflow-hidden theme-surface-muted shrink-0">
              <img
                v-if="product.images && getFirstImageUrl(product.images)"
                :src="getFirstImageUrl(product.images)"
                :alt="getLocalizedText(product.title)"
                class="h-full w-full object-cover transition duration-500"
                :class="isSoldOut(product) ? 'grayscale brightness-75' : 'group-hover:scale-105'"
              />
              <div v-else class="flex h-full items-center justify-center text-sm text-gray-400">{{ t('home.featured.empty') }}</div>

              <div v-if="isSoldOut(product)" class="absolute inset-0 z-10 bg-black/45"></div>
              <div
                v-if="isSoldOut(product)"
                class="absolute left-3 top-3 z-20 theme-badge theme-badge-solid-danger text-[11px] font-bold tracking-wider shadow-sm"
              >
                {{ t('products.stockStatus.outOfStock') }}
              </div>

              <div v-if="!isSoldOut(product) && product.tags && product.tags.length > 0" class="absolute right-3 top-3 flex max-w-[70%] flex-wrap justify-end gap-1.5">
                <span
                  v-for="(tag, index) in product.tags.slice(0, 2)"
                  :key="index"
                  class="theme-badge theme-badge-inverse px-2 py-0.5 text-[11px] font-medium"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="space-y-2 p-3 md:p-5">
              <h3 class="line-clamp-1 text-sm md:text-base font-semibold theme-text-primary">{{ getLocalizedText(product.title) }}</h3>

              <!-- Simplified badges for home: only show stock status (non-in-stock) and fulfillment type -->
              <div class="flex flex-wrap items-center gap-1.5">
                <span
                  v-if="product.stock_status && product.stock_status !== 'in_stock'"
                  class="theme-badge theme-badge-xs"
                  :class="getStockBadgeClass(product.stock_status)"
                >
                  {{ getStockStatusLabel(product) }}
                </span>

                <span
                  class="theme-badge theme-badge-xs"
                  :class="product.fulfillment_type === 'auto'
                    ? 'theme-badge-info'
                    : 'theme-badge-neutral'"
                >
                  {{ getFulfillmentTypeLabel(product.fulfillment_type) }}
                </span>
              </div>

              <p class="line-clamp-2 text-xs md:text-sm theme-text-secondary hidden md:block">{{ getLocalizedText(product.description) }}</p>
              <div class="pt-1">
                <div class="flex flex-col">
                  <span v-if="hasPromotionPrice(product)" class="theme-price-sm theme-price-promotion">
                    {{ siteCurrency }} {{ getPromotionPriceAmount(product) }}
                  </span>
                  <span v-else class="theme-price-sm">
                    {{ siteCurrency }} {{ product.price_amount }}
                  </span>
                  <div v-if="hasPromotionPrice(product)" class="mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span class="text-xs theme-price-original">{{ siteCurrency }} {{ product.price_amount }}</span>
                    <span class="theme-badge theme-badge-danger theme-badge-xs">
                      {{ t('products.promotionTag') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="rounded-2xl border border-dashed theme-border py-16 text-center theme-text-muted theme-slide-up">
          <svg class="mx-auto h-16 w-16 mb-4 theme-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          {{ t('home.featured.empty') }}
        </div>
      </div>
    </section>

    <hr class="theme-section-divider mx-4 md:mx-auto md:max-w-6xl" />

    <section class="relative z-10 py-12">
      <div class="container mx-auto px-4">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 class="theme-section-heading text-[1.7rem]">{{ t('home.latest.title') }}</h2>
            <p class="mt-1 text-sm theme-text-secondary">{{ t('home.latest.description') }}</p>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <router-link to="/blog" class="theme-link-muted">{{ t('nav.blog') }}</router-link>
            <router-link to="/notice" class="theme-link-muted">{{ t('nav.notice') }}</router-link>
          </div>
        </div>

        <div v-if="posts.length > 0" class="grid grid-cols-1 gap-5 md:grid-cols-3">
          <article
            v-for="post in posts"
            :key="post.id"
            class="cursor-pointer rounded-xl border theme-panel p-5 transition hover:shadow-md"
            @click="goToPost(post.slug)"
          >
            <div class="mb-2 text-xs theme-text-muted">{{ formatDate(post.created_at) }}</div>
            <h3 class="line-clamp-2 text-base font-semibold">{{ getLocalizedText(post.title) }}</h3>
            <p class="mt-2 line-clamp-2 text-sm theme-text-secondary">{{ getLocalizedText(post.summary) }}</p>
            <div class="mt-4 text-sm font-medium theme-link">{{ t('blog.readMore') }}</div>
          </article>
        </div>
        <div v-else class="rounded-2xl border border-dashed theme-border py-12 text-center theme-text-muted">
          {{ t('blog.empty') }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { bannerAPI, postAPI, productAPI } from '../api'
import { getFirstImageUrl, getImageUrl } from '../utils/image'
import { debounceAsync } from '../utils/debounce'
import { useLocalized, useProductLabels } from '../composables/useProduct'

const router = useRouter()
const { t } = useI18n()
const { getLocalizedText, siteCurrency } = useLocalized()
const { getFulfillmentTypeLabel, getStockBadgeClass, getStockStatusLabel, isSoldOut, hasPromotionPrice, getPromotionPriceAmount } = useProductLabels()

const products = ref<any[]>([])
const posts = ref<any[]>([])
const banners = ref<any[]>([])
const bannerLoading = ref(true)

const currentBannerIndex = ref(0)
let heroAutoPlayTimer: ReturnType<typeof setInterval> | null = null

// Touch swipe for banner
let touchStartX = 0
const onBannerTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0]?.clientX ?? 0
}
const onBannerTouchEnd = (e: TouchEvent) => {
  const diff = touchStartX - (e.changedTouches[0]?.clientX ?? 0)
  if (Math.abs(diff) > 50) {
    if (diff > 0) handleNextHeroBanner()
    else handlePrevHeroBanner()
  }
}

const bannerCount = computed(() => banners.value.length)

const heroBanner = computed(() => {
  if (banners.value.length === 0) return null
  if (currentBannerIndex.value >= banners.value.length) return banners.value[0]
  return banners.value[currentBannerIndex.value]
})

const goToBanner = (index: number) => {
  if (banners.value.length === 0) return
  const total = banners.value.length
  currentBannerIndex.value = ((index % total) + total) % total
}

const nextHeroBanner = () => {
  goToBanner(currentBannerIndex.value + 1)
}

const prevHeroBanner = () => {
  goToBanner(currentBannerIndex.value - 1)
}

const stopHeroAutoPlay = () => {
  if (heroAutoPlayTimer) {
    clearInterval(heroAutoPlayTimer)
    heroAutoPlayTimer = null
  }
}

const startHeroAutoPlay = () => {
  stopHeroAutoPlay()
  if (banners.value.length <= 1) return
  heroAutoPlayTimer = setInterval(() => {
    nextHeroBanner()
  }, 5000)
}

const handleNextHeroBanner = () => {
  nextHeroBanner()
  startHeroAutoPlay()
}

const handlePrevHeroBanner = () => {
  prevHeroBanner()
  startHeroAutoPlay()
}

const selectHeroBanner = (index: number) => {
  goToBanner(index)
  startHeroAutoPlay()
}

const heroImage = computed(() => {
  const banner = heroBanner.value
  if (!banner) return ''
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  if (isMobile && banner.mobile_image) {
    return getImageUrl(banner.mobile_image)
  }
  return getImageUrl(banner.image || banner.mobile_image || '')
})

const heroBadge = computed(() => {
  if (!heroBanner.value) return t('home.hero.badge')
  return getLocalizedText(heroBanner.value.title) || t('home.hero.badge')
})

const heroTitle = computed(() => {
  if (!heroBanner.value) return t('home.hero.title')
  return getLocalizedText(heroBanner.value.title) || t('home.hero.title')
})

const heroSubtitle = computed(() => {
  if (!heroBanner.value) return t('home.hero.subtitle')
  return getLocalizedText(heroBanner.value.subtitle) || t('home.hero.subtitle')
})

const heroLink = computed(() => {
  const banner = heroBanner.value
  if (!banner || banner.link_type === 'none') return ''
  return banner.link_value || ''
})

const hasHeroLink = computed(() => heroLink.value.trim().length > 0)

const heroPrimaryButtonText = computed(() => {
  if (!hasHeroLink.value) return t('home.hero.cta')
  const linkType = String(heroBanner.value?.link_type || '').toLowerCase()
  if (linkType === 'external') {
    return t('common.learnMore')
  }
  return t('common.viewDetails')
})

const heroOpenInNewTab = computed(() => Boolean(heroBanner.value?.open_in_new_tab))

const goToHeroLink = () => {
  if (!heroLink.value) {
    router.push('/products')
    return
  }
  const isExternal = /^https?:\/\//i.test(heroLink.value)
  if (isExternal || heroOpenInNewTab.value) {
    window.open(heroLink.value, heroOpenInNewTab.value ? '_blank' : '_self')
    return
  }
  router.push(heroLink.value)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const goToProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const goToPost = (slug: string) => {
  router.push(`/blog/${slug}`)
}

const loadFeaturedProducts = async () => {
  try {
    const response = await productAPI.list({ page: 1, page_size: 9 })
    products.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const loadLatestPosts = async () => {
  try {
    const response = await postAPI.list({ page: 1, page_size: 3 })
    posts.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
}

const loadHeroBanners = async () => {
  bannerLoading.value = true
  try {
    const response = await bannerAPI.list({ position: 'home_hero', limit: 5 })
    banners.value = response.data.data || []
    currentBannerIndex.value = 0
    startHeroAutoPlay()
  } catch (error) {
    banners.value = []
    currentBannerIndex.value = 0
    stopHeroAutoPlay()
    console.error('Failed to load banners:', error)
  } finally {
    bannerLoading.value = false
  }
}

const debouncedLoadFeaturedProducts = debounceAsync(loadFeaturedProducts, 250)
const debouncedLoadLatestPosts = debounceAsync(loadLatestPosts, 250)
const debouncedLoadHeroBanners = debounceAsync(loadHeroBanners, 250)

onMounted(async () => {
  await Promise.all([debouncedLoadHeroBanners(), debouncedLoadFeaturedProducts(), debouncedLoadLatestPosts()])
})

onUnmounted(() => {
  debouncedLoadFeaturedProducts.cancel()
  debouncedLoadLatestPosts.cancel()
  debouncedLoadHeroBanners.cancel()
  stopHeroAutoPlay()
})
</script>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 300ms ease;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}
</style>
