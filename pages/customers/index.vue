<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
        <p class="mt-2 text-sm text-gray-600">
          Gerencie todos os seus customers cadastrados no sistema.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton
          variant="primary"
          @click="openCreateModal"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Customer
        </BaseButton>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome, email, CPF ou telefone..."
            @input="debouncedSearch"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <select
            v-model="statusFilter"
            class="form-input"
            @change="applyFilters"
          >
            <option value="">Todos os status</option>
            <option value="true">Apenas ativos</option>
            <option value="false">Apenas inativos</option>
          </select>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
        <span class="text-sm text-gray-500">Filtros ativos:</span>
        
        <span
          v-if="searchQuery"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          Busca: "{{ searchQuery }}"
          <button
            type="button"
            class="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
            @click="clearSearch"
          >
            <span class="sr-only">Remover filtro de busca</span>
            <svg class="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
              <path d="M3.97 4L1.47 1.5a.75.75 0 011.06-1.06L4 2.94l1.47-1.47a.75.75 0 111.06 1.06L4.03 4l2.5 2.5a.75.75 0 11-1.06 1.06L4 5.06l-1.47 1.47a.75.75 0 01-1.06-1.06L3.97 4z" />
            </svg>
          </button>
        </span>

        <span
          v-if="statusFilter"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          Status: {{ statusFilter === 'true' ? 'Ativo' : 'Inativo' }}
          <button
            type="button"
            class="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500"
            @click="clearStatusFilter"
          >
            <span class="sr-only">Remover filtro de status</span>
            <svg class="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
              <path d="M3.97 4L1.47 1.5a.75.75 0 011.06-1.06L4 2.94l1.47-1.47a.75.75 0 111.06 1.06L4.03 4l2.5 2.5a.75.75 0 11-1.06 1.06L4 5.06l-1.47 1.47a.75.75 0 01-1.06-1.06L3.97 4z" />
            </svg>
          </button>
        </span>

        <button
          type="button"
          class="text-sm text-gray-500 hover:text-gray-700"
          @click="clearAllFilters"
        >
          Limpar todos
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">
          <span v-if="customerStore.loading">Carregando...</span>
          <span v-else>
            Mostrando {{ displayedCustomers.length }} de {{ customerStore.pagination.total }} customers
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          <label for="pageSize" class="text-sm text-gray-500">Itens por página:</label>
          <select
            id="pageSize"
            v-model="pageSize"
            class="text-sm border-gray-300 rounded-md"
            @change="changePageSize"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="customerStore.loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-500">Carregando customers...</p>
      </div>

      <div v-else-if="customerStore.error" class="p-8 text-center">
        <div class="text-red-500 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Erro ao carregar customers</h3>
        <p class="text-gray-500 mb-4">{{ customerStore.error }}</p>
        <BaseButton @click="loadCustomers">
          Tentar novamente
        </BaseButton>
      </div>

      <div v-else-if="displayedCustomers.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum customer encontrado</h3>
        <p class="mt-2 text-gray-500">
          {{ hasActiveFilters ? 'Tente ajustar os filtros.' : 'Comece criando um novo customer.' }}
        </p>
        <div class="mt-6">
          <BaseButton
            v-if="!hasActiveFilters"
            variant="primary"
            @click="openCreateModal"
          >
            Criar primeiro customer
          </BaseButton>
          <BaseButton
            v-else
            variant="outline"
            @click="clearAllFilters"
          >
            Limpar filtros
          </BaseButton>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Informações
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="customer in displayedCustomers"
              :key="customer.id"
              class="hover:bg-gray-50"
            >
              <!-- Customer Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-blue-600">
                        {{ customer.nome.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ customer.nome }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ customer.cpf }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Contact Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ customer.email }}</div>
                <div class="text-sm text-gray-500">{{ customer.telefone }}</div>
              </td>

              <!-- Additional Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ customer.idade }} anos
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatCurrency(customer.salario) }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
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
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    class="text-blue-600 hover:text-blue-900"
                    @click="editCustomer(customer)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-900"
                    @click="confirmDelete(customer)"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="customerStore.pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <BaseButton
              variant="outline"
              :disabled="customerStore.pagination.page <= 1"
              @click="previousPage"
            >
              Anterior
            </BaseButton>
            <BaseButton
              variant="outline"
              :disabled="customerStore.pagination.page >= customerStore.pagination.totalPages"
              @click="nextPage"
            >
              Próximo
            </BaseButton>
          </div>
          
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando página
                <span class="font-medium">{{ customerStore.pagination.page }}</span>
                de
                <span class="font-medium">{{ customerStore.pagination.totalPages }}</span>
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <!-- Previous -->
                <button
                  type="button"
                  :disabled="customerStore.pagination.page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="previousPage"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>

                <!-- Page numbers -->
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page === '...'"
                    type="button"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    disabled
                  >
                    ...
                  </button>
                  <button
                    v-else
                    type="button"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === customerStore.pagination.page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                </template>

                <!-- Next -->
                <button
                  type="button"
                  :disabled="customerStore.pagination.page >= customerStore.pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="nextPage"
                >
                  <span class="sr-only">Próximo</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Modal -->
    <CustomerModal
      v-model="showModal"
      :customer="selectedCustomer"
      @saved="handleCustomerSaved"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Confirmar exclusão"
      size="sm"
    >
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Excluir customer
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          Tem certeza que deseja excluir o customer <strong>{{ customerToDelete?.nome }}</strong>? 
          Esta ação não pode ser desfeita.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton
            variant="outline"
            @click="cancelDelete"
          >
            Cancelar
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="deletingCustomer"
            @click="deleteCustomer"
          >
            Excluir
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer'
import { formatCurrency, debounce } from '~/utils/formatters'
import type { Customer } from '~/types/customer'

// Meta tags
useHead({
  title: 'Customers - Sistema CRUD',
  meta: [
    { name: 'description', content: 'Lista de customers cadastrados no sistema' }
  ]
})

// Store
const customerStore = useCustomerStore()

// Estado reativo
const searchQuery = ref('')
const statusFilter = ref('')
const pageSize = ref(10)
const showModal = ref(false)
const selectedCustomer = ref<Customer | null>(null)
const showDeleteModal = ref(false)
const customerToDelete = ref<Customer | null>(null)
const deletingCustomer = ref(false)

// Computed
const displayedCustomers = computed(() => customerStore.paginatedCustomers)

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || statusFilter.value)
})

const visiblePages = computed(() => {
  const current = customerStore.pagination.page
  const total = customerStore.pagination.totalPages
  const delta = 2

  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }

  return rangeWithDots
})

// Methods
const loadCustomers = async () => {
  await customerStore.fetchCustomers(customerStore.pagination.page, pageSize.value)
}

const debouncedSearch = debounce(applyFilters, 300)

const applyFilters = () => {
  const filters: any = {}
  
  if (searchQuery.value) {
    filters.search = searchQuery.value
  }
  
  if (statusFilter.value) {
    filters.ativo = statusFilter.value === 'true'
  }
  
  customerStore.setFilters(filters)
  customerStore.setPage(1)
  loadCustomers()
}

const clearSearch = () => {
  searchQuery.value = ''
  applyFilters()
}

const clearStatusFilter = () => {
  statusFilter.value = ''
  applyFilters()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  customerStore.clearFilters()
  customerStore.setPage(1)
  loadCustomers()
}

const changePageSize = () => {
  customerStore.setPageSize(pageSize.value)
  loadCustomers()
}

const previousPage = () => {
  if (customerStore.pagination.page > 1) {
    customerStore.setPage(customerStore.pagination.page - 1)
    loadCustomers()
  }
}

const nextPage = () => {
  if (customerStore.pagination.page < customerStore.pagination.totalPages) {
    customerStore.setPage(customerStore.pagination.page + 1)
    loadCustomers()
  }
}

const goToPage = (page: number) => {
  customerStore.setPage(page)
  loadCustomers()
}

const openCreateModal = () => {
  selectedCustomer.value = null
  showModal.value = true
}

const editCustomer = (customer: Customer) => {
  selectedCustomer.value = customer
  showModal.value = true
}

const confirmDelete = (customer: Customer) => {
  customerToDelete.value = customer
  showDeleteModal.value = true
}

const cancelDelete = () => {
  customerToDelete.value = null
  showDeleteModal.value = false
}

const deleteCustomer = async () => {
  if (!customerToDelete.value) return

  deletingCustomer.value = true
  
  try {
    await customerStore.deleteCustomer(customerToDelete.value.id!)
    showDeleteModal.value = false
    customerToDelete.value = null
  } catch (error) {
    console.error('Erro ao deletar customer:', error)
  } finally {
    deletingCustomer.value = false
  }
}

const handleCustomerSaved = () => {
  showModal.value = false
  selectedCustomer.value = null
  loadCustomers()
}

// Lifecycle
onMounted(() => {
  loadCustomers()
})
</script>
