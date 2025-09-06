<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="modalClasses"
            @click.stop
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <slot name="header">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ title }}
                  </h3>
                </slot>
                
                <button
                  v-if="closable"
                  type="button"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                  @click="close"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Body -->
            <div :class="bodyClasses">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  persistent?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  persistent: false
})

const emit = defineEmits<Emits>()

const modalClasses = computed(() => {
  const base = 'modal-content'
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full mx-4'
  }
  
  return [base, sizes[props.size]].join(' ')
})

const bodyClasses = computed(() => {
  return props.title || props.$slots?.header ? 'p-6' : 'p-6'
})

const close = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

// Fechar modal com ESC
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue && props.closable) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Prevenir scroll do body quando modal está aberto
watch(
  () => props.modelValue,
  (isOpen) => {
    if (process.client) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
)

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>
