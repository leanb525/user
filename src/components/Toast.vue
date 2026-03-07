<template>
  <Teleport to="body">
    <div class="fixed z-[100] pointer-events-none" :class="positionClass">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
      >
        <div
          v-for="item in toasts"
          :key="item.id"
          class="pointer-events-auto mb-2 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl"
          :class="typeClass(item.type)"
        >
          <svg v-if="item.type === 'success'" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="item.type === 'error'" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ item.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts } = useToast()

const positionClass = 'bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-20 md:right-6 md:left-auto md:translate-x-0 flex flex-col items-center md:items-end'

const typeClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'theme-alert-success'
    case 'error':
      return 'theme-alert-danger'
    default:
      return 'theme-alert-info'
  }
}
</script>
