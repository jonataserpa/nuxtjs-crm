<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleMobileSidebar"
      class="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50"
    >
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Mobile Overlay -->
    <div
      v-if="mobileSidebarOpen"
      @click="closeMobileSidebar"
      class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
    ></div>

    <!-- Application Container - Full Screen -->
    <div class="app-container flex h-screen w-full">
      <!-- Ultra Modern Sidebar -->
      <aside :class="[
        'sidebar-ultra',
        'lg:translate-x-0 transition-all duration-500 ease-out',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]">
      <!-- Ultra Modern Brand -->
      <div class="sidebar-brand-ultra">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">NuxtCRM</h1>
            <p class="text-xs text-gray-400 font-medium">Sistema Avançado</p>
          </div>
        </div>
      </div>

      <!-- Ultra Modern Navigation -->
      <nav class="sidebar-nav-ultra">
        <div class="space-y-2">
          <NuxtLink
            to="/"
            :class="[
              'nav-item-ultra group',
              $route.path === '/' ? 'nav-item-active' : ''
            ]"
          >
            <div class="nav-icon-container">
              <svg class="nav-icon-ultra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
            </div>
            <span class="nav-text">Dashboard</span>
            <div class="nav-indicator"></div>
          </NuxtLink>

          <NuxtLink
            to="/customers"
            :class="[
              'nav-item-ultra group',
              $route.path.startsWith('/customers') ? 'nav-item-active' : ''
            ]"
          >
            <div class="nav-icon-container">
              <svg class="nav-icon-ultra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <span class="nav-text">Customers</span>
            <div class="nav-indicator"></div>
          </NuxtLink>
        </div>

        <!-- Ultra Modern Tools Section -->
        <div class="mt-8">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">FERRAMENTAS</h3>
          <div class="space-y-2">
            <a href="#" class="nav-item-ultra group opacity-60 cursor-not-allowed">
              <div class="nav-icon-container">
                <svg class="nav-icon-ultra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span class="nav-text">Relatórios</span>
              <div class="nav-indicator"></div>
            </a>
            
            <a href="#" class="nav-item-ultra group opacity-60 cursor-not-allowed">
              <div class="nav-icon-container">
                <svg class="nav-icon-ultra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="nav-text">Configurações</span>
              <div class="nav-indicator"></div>
            </a>
          </div>
        </div>
      </nav>

      <!-- Ultra Modern User Profile -->
      <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700/50">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate">Admin User</p>
            <p class="text-xs text-gray-400 truncate font-medium">admin@demo.com</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Ultra Modern Main Content -->
    <main class="main-content-ultra">
      <!-- Ultra Modern Content Header -->
      <header class="content-header-ultra">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{{ pageTitle }}</h1>
            <p class="text-lg text-gray-600 mt-2 font-medium">{{ pageDescription }}</p>
          </div>
          
          <!-- Ultra Modern Header Actions -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-white/50 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
              </svg>
              <span class="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"></span>
            </button>

            <!-- Ultra Modern Search -->
            <div class="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                class="w-80 px-6 py-4 pl-12 pr-6 text-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-xl transition-all duration-300"
              >
              <svg class="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <!-- Ultra Modern Page Content -->
      <div class="content-body-ultra">
        <slot />
      </div>
    </main>
    </div> <!-- Fim do flex container -->

    <!-- Global Loading -->
    <GlobalLoading 
      :is-visible="globalLoading.isVisible.value"
      :title="globalLoading.title.value"
      :message="globalLoading.message.value"
    />
  </div>
</template>

<script setup>
// Page title and description based on route
const route = useRoute()

// Mobile sidebar state
const mobileSidebarOpen = ref(false)

// Global loading
const globalLoading = useGlobalLoading()

const pageInfo = computed(() => {
  const pages = {
    '/': {
      title: 'Dashboard',
      description: 'Visão geral do sistema e estatísticas'
    },
    '/customers': {
      title: 'Customers',
      description: 'Gerencie todos os customers cadastrados'
    }
  }
  
  return pages[route.path] || {
    title: 'Sistema CRUD',
    description: 'Sistema de gestão de customers'
  }
})

const pageTitle = computed(() => pageInfo.value.title)
const pageDescription = computed(() => pageInfo.value.description)

// Mobile sidebar functions
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false
}

// Close mobile sidebar when route changes
watch(() => route.path, () => {
  closeMobileSidebar()
})
</script>