<template>
  <div v-if="isVisible" class="global-loading bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center animate-slide-up">
      <!-- Logo do Customer -->
      <div class="mb-6">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        
        <!-- Spinner -->
        <div class="relative">
          <div class="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 rounded-full mx-auto"></div>
          <div class="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>

      <!-- Texto de Loading -->
      <div class="space-y-2">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 animate-pulse">{{ title }}</h3>
        <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">{{ message }}</p>
      </div>

      <!-- Barra de Progresso -->
      <div class="mt-6">
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style="width: 100%"></div>
        </div>
      </div>

      <!-- Pontos de Loading -->
      <div class="mt-4 flex justify-center space-x-1">
        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
interface Props {
  isVisible: boolean
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Processando...',
  message: 'Aguarde enquanto processamos sua solicitação'
})
</script>

<style scoped>
/* Garantir que o conteúdo não saia da tela */
.global-loading > div {
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
}

/* Melhorar legibilidade em telas pequenas */
@media (max-width: 480px) {
  .global-loading > div h3 {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .global-loading > div p {
    font-size: 0.75rem;
    line-height: 1.125rem;
  }
}

/* Garantir que o loading seja sempre visível */
.global-loading {
  pointer-events: auto !important;
}

.global-loading > div {
  pointer-events: auto !important;
}
</style>
