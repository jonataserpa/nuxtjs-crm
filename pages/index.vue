<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Bem-vindo ao Sistema CRUD</h1>
          <p class="mt-2 text-sm text-gray-600">
            Gerencie seus customers de forma eficiente e organizada.
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <NuxtLink
            to="/customers"
            class="btn btn-primary"
          >
            Ver Customers
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Customers -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">Total de Customers</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ stats?.total || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Active Customers -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">Customers Ativos</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ stats?.ativos || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Inactive Customers -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">Customers Inativos</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ stats?.inativos || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Average Salary -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">Salário Médio</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(stats?.salarioMedio || 0) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Ações Rápidas</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink
            to="/customers"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">Gerenciar Customers</div>
              <div class="text-sm text-gray-500">Visualizar, criar, editar e deletar customers</div>
            </div>
          </NuxtLink>

          <button
            type="button"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            @click="refreshStats"
            :disabled="loading"
          >
            <div class="flex-shrink-0">
              <svg 
                :class="[
                  'w-8 h-8 text-green-500',
                  { 'animate-spin': loading }
                ]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">Atualizar Estatísticas</div>
              <div class="text-sm text-gray-500">Recarregar dados do dashboard</div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Atividade Recente</h3>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Carregando...</p>
        </div>
        
        <div v-else-if="recentCustomers.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum customer encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Comece criando um novo customer.</p>
          <div class="mt-6">
            <NuxtLink to="/customers" class="btn btn-primary">
              Adicionar Customer
            </NuxtLink>
          </div>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="customer in recentCustomers"
            :key="customer.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600">
                    {{ customer.nome.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">{{ customer.nome }}</div>
                <div class="text-sm text-gray-500">{{ customer.email }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  customer.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ customer.ativo ? 'Ativo' : 'Inativo' }}
              </span>
              <NuxtLink 
                :to="`/customers/${customer.id}`"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver detalhes
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { customerService } from '~/services/customerService'
import { formatCurrency } from '~/utils/formatters'

// Meta tags
useHead({
  title: 'Dashboard - Sistema CRUD',
  meta: [
    { name: 'description', content: 'Dashboard do sistema CRUD para gerenciamento de customers' }
  ]
})

// Estado reativo
const stats = ref<{
  total: number
  ativos: number
  inativos: number
  idadeMedia: number
  salarioMedio: number
} | null>(null)

const recentCustomers = ref<any[]>([])
const loading = ref(true)

// Carregar estatísticas
const loadStats = async () => {
  try {
    const response = await customerService.getStats()
    stats.value = response.data
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

// Carregar customers recentes
const loadRecentCustomers = async () => {
  try {
    const response = await customerService.getAll({ page: 1, pageSize: 5 })
    recentCustomers.value = response.data
  } catch (error) {
    console.error('Erro ao carregar customers recentes:', error)
  }
}

// Atualizar dados
const refreshStats = async () => {
  loading.value = true
  await Promise.all([
    loadStats(),
    loadRecentCustomers()
  ])
  loading.value = false
}

// Carregar dados iniciais
onMounted(async () => {
  await refreshStats()
})
</script>
