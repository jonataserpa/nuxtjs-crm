<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="card fade-in">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo ao Sistema CRUD! 👋
            </h2>
            <p class="text-gray-600">
              Gerencie seus customers de forma eficiente e organizada com nossa plataforma moderna.
            </p>
          </div>
          <div class="hidden md:block">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card slide-up" style="animation-delay: 0.1s">
        <div class="card-body">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Total de Customers</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 font-medium">+12%</span>
            <span class="text-gray-500 ml-2">vs mês anterior</span>
          </div>
        </div>
      </div>

      <div class="card slide-up" style="animation-delay: 0.2s">
        <div class="card-body">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Customers Ativos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.ativos }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 font-medium">+8%</span>
            <span class="text-gray-500 ml-2">vs mês anterior</span>
          </div>
        </div>
      </div>

      <div class="card slide-up" style="animation-delay: 0.3s">
        <div class="card-body">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Customers Inativos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.inativos }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-red-600 font-medium">-3%</span>
            <span class="text-gray-500 ml-2">vs mês anterior</span>
          </div>
        </div>
      </div>

      <div class="card slide-up" style="animation-delay: 0.4s">
        <div class="card-body">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Salário Médio</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.salarioMedio) }}</p>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 font-medium">+15%</span>
            <span class="text-gray-500 ml-2">vs mês anterior</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card slide-up" style="animation-delay: 0.5s">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <NuxtLink to="/customers" class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Gerenciar Customers</h4>
                <p class="text-sm text-gray-600">Visualizar, criar, editar e deletar customers</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>

            <button @click="refreshStats" class="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 group w-full">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Atualizar Estatísticas</h4>
                <p class="text-sm text-gray-600">Recarregar dados do dashboard</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 ml-auto group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="card slide-up" style="animation-delay: 0.6s">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Atividade Recente</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Novo customer adicionado</p>
                <p class="text-xs text-gray-500">João Silva Santos - há 2 horas</p>
              </div>
            </div>

            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Customer atualizado</p>
                <p class="text-xs text-gray-500">Maria Oliveira Costa - há 4 horas</p>
              </div>
            </div>

            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Sistema atualizado</p>
                <p class="text-xs text-gray-500">Nova versão disponível - há 1 dia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Meta tags
useHead({
  title: 'Dashboard - Sistema CRUD'
})

// Mock data for statistics
const stats = ref({
  total: 5,
  ativos: 4,
  inativos: 1,
  salarioMedio: 4760.00
})

// Utility function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Global loading
const globalLoading = useGlobalLoading()

// Refresh stats function
const refreshStats = async () => {
  // Show global loading
  globalLoading.show('Atualizando Estatísticas', 'Recarregando dados do dashboard...')
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Simulate loading
  stats.value = { ...stats.value }
  
  // Hide global loading
  globalLoading.hide()
  
  // Show success message (you could add a toast notification here)
  console.log('Estatísticas atualizadas!')
}
</script>