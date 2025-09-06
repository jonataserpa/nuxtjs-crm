<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="sidebarClasses">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 px-4 bg-gray-900 border-b border-gray-700">
          <h1 class="text-xl font-bold text-white">
            CRUD System
          </h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-2 py-4 space-y-2">
          <NuxtLink
            to="/"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
              $route.path === '/' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            Dashboard
          </NuxtLink>

          <NuxtLink
            to="/customers"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
              $route.path.startsWith('/customers') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Customers
          </NuxtLink>

          <!-- Placeholder para outros módulos -->
          <div class="pt-4 mt-4 border-t border-gray-700">
            <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Relatórios
            </p>
            
            <NuxtLink
              to="/reports"
              :class="[
                'flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-md transition-colors',
                $route.path.startsWith('/reports') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Relatórios
            </NuxtLink>
          </div>
        </nav>

        <!-- User menu -->
        <div class="px-2 py-4 border-t border-gray-700">
          <div class="flex items-center px-4 py-2">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">Usuário Demo</p>
              <p class="text-xs text-gray-400">admin@demo.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="closeMobileSidebar"
    />

    <!-- Main content -->
    <div :class="mainContentClasses">
      <!-- Top bar -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              @click="toggleMobileSidebar"
            >
              <span class="sr-only">Abrir menu lateral</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Page title -->
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                {{ pageTitle }}
              </h1>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button
                type="button"
                class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">Ver notificações</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Controle do sidebar móvel
const isMobileSidebarOpen = ref(false)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

// Classes responsivas
const sidebarClasses = computed(() => [
  'sidebar',
  'transform transition-transform duration-300 ease-in-out lg:translate-x-0',
  isMobileSidebarOpen.value ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
  'lg:static lg:inset-y-0'
])

const mainContentClasses = computed(() => [
  'main-content',
  'flex flex-col'
])

// Título da página baseado na rota
const route = useRoute()
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/customers': 'Customers',
    '/reports': 'Relatórios'
  }
  
  return titles[route.path] || 'Sistema CRUD'
})

// Fechar sidebar móvel quando navegar
watch(() => route.path, () => {
  closeMobileSidebar()
})

// Fechar sidebar móvel no redimensionamento da tela
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      closeMobileSidebar()
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>
