<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-500">Carregando customer...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Customer não encontrado</h3>
      <p class="text-gray-500 mb-4">O customer solicitado não existe ou foi removido.</p>
      <BaseButton @click="$router.push('/customers')">
        Voltar para lista
      </BaseButton>
    </div>

    <!-- Customer Details -->
    <template v-else-if="customer">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center">
            <button
              type="button"
              class="mr-3 p-2 text-gray-400 hover:text-gray-600"
              @click="$router.push('/customers')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ customer.nome }}</h1>
              <div class="mt-1 flex items-center space-x-4">
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
                <span class="text-sm text-gray-500">
                  ID: {{ customer.id }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <BaseButton
            variant="outline"
            @click="editCustomer"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </BaseButton>
          <BaseButton
            variant="danger"
            @click="confirmDelete"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </BaseButton>
        </div>
      </div>

      <!-- Customer Information Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nome completo</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ customer.nome }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">CPF</dt>
                <dd class="mt-1 text-sm text-gray-900 font-mono">{{ customer.cpf }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Idade</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ customer.idade }} anos</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Data de nascimento</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(customer.dataNascimento) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Contact Info -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <a 
                    :href="`mailto:${customer.email}`"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    {{ customer.email }}
                  </a>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Telefone</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <a 
                    :href="`tel:${customer.telefone.replace(/\D/g, '')}`"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    {{ customer.telefone }}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Professional Info -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informações Profissionais</h3>
            <dl class="grid grid-cols-1 gap-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Salário</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900">
                  {{ formatCurrency(customer.salario) }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Observations -->
          <div v-if="customer.observacoes" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Observações</h3>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ customer.observacoes }}</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Status</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Estado atual</span>
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
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Criado</p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(customer.criadoEm) }}
                  </p>
                </div>
              </div>
              
              <div v-if="customer.atualizadoEm !== customer.criadoEm" class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Última atualização</p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(customer.atualizadoEm) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            <div class="space-y-3">
              <button
                type="button"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                @click="editCustomer"
              >
                <svg class="w-4 h-4 inline mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar informações
              </button>
              
              <button
                type="button"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                @click="sendEmail"
              >
                <svg class="w-4 h-4 inline mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar email
              </button>
              
              <button
                type="button"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                @click="makeCall"
              >
                <svg class="w-4 h-4 inline mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Fazer ligação
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Customer Modal -->
    <CustomerModal
      v-model="showEditModal"
      :customer="customer"
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
          Tem certeza que deseja excluir o customer <strong>{{ customer?.nome }}</strong>? 
          Esta ação não pode ser desfeita.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton
            variant="outline"
            @click="showDeleteModal = false"
          >
            Cancelar
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="deleting"
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
import { formatDate, formatCurrency } from '~/utils/formatters'
import type { Customer } from '~/types/customer'

// Route params
const route = useRoute()
const router = useRouter()
const customerId = route.params.id as string

// Store
const customerStore = useCustomerStore()

// Estado reativo
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const deleting = ref(false)

// Buscar customer
const { data: customer, pending, error } = await useAsyncData(
  `customer-${customerId}`,
  () => customerStore.fetchCustomerById(customerId),
  {
    key: `customer-${customerId}`
  }
)

// Meta tags
useHead({
  title: computed(() => customer.value ? `${customer.value.nome} - Sistema CRUD` : 'Customer - Sistema CRUD'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => customer.value ? `Detalhes do customer ${customer.value.nome}` : 'Detalhes do customer')
    }
  ]
})

// Métodos
const editCustomer = () => {
  showEditModal.value = true
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteCustomer = async () => {
  if (!customer.value) return

  deleting.value = true
  
  try {
    await customerStore.deleteCustomer(customer.value.id!)
    router.push('/customers')
  } catch (error) {
    console.error('Erro ao deletar customer:', error)
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

const handleCustomerSaved = async () => {
  showEditModal.value = false
  // Recarregar dados do customer
  await refreshCookie(`customer-${customerId}`)
}

const sendEmail = () => {
  if (customer.value) {
    window.location.href = `mailto:${customer.value.email}`
  }
}

const makeCall = () => {
  if (customer.value) {
    window.location.href = `tel:${customer.value.telefone.replace(/\D/g, '')}`
  }
}

// Verificar se customer existe
if (!pending.value && !customer.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Customer não encontrado'
  })
}
</script>
