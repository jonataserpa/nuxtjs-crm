<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Customers</h1>
        <p class="text-sm text-gray-600 mt-1">Gerencie todos os seus customers cadastrados</p>
      </div>
      
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 sm:flex-none">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Pesquisar customers..."
            class="w-full sm:w-64 px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filter -->
        <select v-model="statusFilter" class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos os status</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>

        <!-- Add Customer Button -->
        <button @click="openCreateModal" class="btn btn-primary w-full sm:w-auto">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">Novo Customer</span>
          <span class="sm:hidden">Novo</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-xl font-bold text-gray-900">{{ customers.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Ativos</p>
              <p class="text-xl font-bold text-gray-900">{{ activeCustomers }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Inativos</p>
              <p class="text-xl font-bold text-gray-900">{{ inactiveCustomers }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="card">
      <div class="card-body p-0">
        <div v-if="customers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum customer encontrado</h3>
          <p class="mt-2 text-gray-500">Comece criando um novo customer.</p>
          <button @click="openCreateModal" class="mt-4 btn btn-primary">
            Criar primeiro customer
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <!-- Desktop Table -->
          <table class="hidden lg:table min-w-full divide-y divide-gray-200">
            <thead class="table-header">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr v-for="customer in customers" :key="customer.id" class="table-row">
                <td class="table-cell">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white font-semibold text-sm">
                        {{ customer.nome.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ customer.nome }}</div>
                      <div class="text-sm text-gray-500">ID: {{ customer.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="table-cell">
                  <div class="text-sm text-gray-900">{{ customer.email }}</div>
                </td>
                <td class="table-cell">
                  <div class="text-sm text-gray-900 font-mono">{{ customer.cpf }}</div>
                </td>
                <td class="table-cell">
                  <span :class="[
                    'badge',
                    customer.ativo ? 'badge-success' : 'badge-danger'
                  ]">
                    {{ customer.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="table-cell">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editCustomer(customer)"
                      class="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      @click="deleteCustomer(customer.id)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile Cards -->
          <div class="lg:hidden space-y-4 p-4">
            <div v-for="customer in customers" :key="customer.id" class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white font-semibold text-lg">
                      {{ customer.nome.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ customer.nome }}</h3>
                    <p class="text-sm text-gray-500">{{ customer.email }}</p>
                  </div>
                </div>
                <span :class="[
                  'badge',
                  customer.ativo ? 'badge-success' : 'badge-danger'
                ]">
                  {{ customer.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </div>
              
              <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">CPF</p>
                  <p class="font-mono">{{ customer.cpf }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Telefone</p>
                  <p>{{ customer.telefone }}</p>
                </div>
              </div>
              
              <div class="mt-4 flex space-x-2">
                <button
                  @click="editCustomer(customer)"
                  class="flex-1 btn btn-secondary text-sm"
                >
                  Editar
                </button>
                <button
                  @click="deleteCustomer(customer.id)"
                  class="flex-1 btn btn-danger text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editing ? 'Editar Customer' : 'Novo Customer' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveCustomer" class="modal-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nome Completo -->
            <div class="form-group">
              <label class="form-label">Nome Completo *</label>
              <input
                v-model="form.nome"
                type="text"
                class="form-input"
                :class="{ error: errors.nome }"
                placeholder="Digite o nome completo"
                required
              >
              <div v-if="errors.nome" class="form-error">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.nome }}
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ error: errors.email }"
                placeholder="Digite o email"
                required
              >
              <div v-if="errors.email" class="form-error">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.email }}
              </div>
            </div>

            <!-- CPF -->
            <div class="form-group">
              <label class="form-label">CPF *</label>
              <input
                v-model="form.cpf"
                type="text"
                class="form-input"
                :class="{ error: errors.cpf }"
                placeholder="000.000.000-00"
                @input="formatCPF"
                required
              >
              <div v-if="errors.cpf" class="form-error">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.cpf }}
              </div>
            </div>

            <!-- Telefone -->
            <div class="form-group">
              <label class="form-label">Telefone *</label>
              <input
                v-model="form.telefone"
                type="text"
                class="form-input"
                :class="{ error: errors.telefone }"
                placeholder="(00) 00000-0000"
                @input="formatPhone"
                required
              >
              <div v-if="errors.telefone" class="form-error">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.telefone }}
              </div>
            </div>

            <!-- Idade -->
            <div class="form-group">
              <label class="form-label">Idade *</label>
              <input
                v-model.number="form.idade"
                type="number"
                class="form-input"
                :class="{ error: errors.idade }"
                placeholder="18"
                min="1"
                max="120"
                required
              >
              <div v-if="errors.idade" class="form-error">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.idade }}
              </div>
            </div>

            <!-- Salário -->
            <div class="form-group">
              <label class="form-label">Salário *</label>
              <input
                v-model.number="form.salario"
                type="number"
                class="form-input"
                :class="{ error: errors.salario }"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              >
              <div v-if="errors.salario" class="form-error">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.salario }}
              </div>
            </div>

            <!-- Data de Nascimento -->
            <div class="form-group">
              <label class="form-label">Data de Nascimento *</label>
              <input
                v-model="form.dataNascimento"
                type="date"
                class="form-input"
                :class="{ error: errors.dataNascimento }"
                required
              >
              <div v-if="errors.dataNascimento" class="form-error">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.dataNascimento }}
              </div>
            </div>

            <!-- Status -->
            <div class="form-group">
              <label class="form-label">Status</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input v-model="form.ativo" type="radio" :value="true" class="mr-2">
                  <span class="text-sm">Ativo</span>
                </label>
                <label class="flex items-center">
                  <input v-model="form.ativo" type="radio" :value="false" class="mr-2">
                  <span class="text-sm">Inativo</span>
                </label>
              </div>
            </div>

            <!-- Observações -->
            <div class="form-group md:col-span-2">
              <label class="form-label">Observações</label>
              <textarea
                v-model="form.observacoes"
                rows="3"
                class="form-input"
                placeholder="Informações adicionais sobre o customer..."
              ></textarea>
            </div>
          </div>
        </form>

        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="button" @click="saveCustomer" class="btn btn-primary" :disabled="isSubmitting">
            <div v-if="isSubmitting" class="loading-spinner w-4 h-4 mr-2"></div>
            {{ editing ? 'Atualizar' : 'Criar' }} Customer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Global loading
const globalLoading = useGlobalLoading()

const customers = ref([
  { 
    id: '1', 
    nome: 'João Silva Santos', 
    email: 'joao.silva@email.com', 
    cpf: '123.456.789-01', 
    telefone: '(11) 99999-9999',
    idade: 28,
    dataNascimento: '1995-03-15',
    salario: 5000.00,
    ativo: true,
    observacoes: 'Customer VIP'
  },
  { 
    id: '2', 
    nome: 'Maria Oliveira Costa', 
    email: 'maria.costa@email.com', 
    cpf: '987.654.321-02', 
    telefone: '(11) 88888-8888',
    idade: 32,
    dataNascimento: '1991-07-22',
    salario: 4500.00,
    ativo: true,
    observacoes: ''
  },
  { 
    id: '3', 
    nome: 'Pedro Henrique Lima', 
    email: 'pedro.lima@email.com', 
    cpf: '456.789.123-03', 
    telefone: '(11) 77777-7777',
    idade: 25,
    dataNascimento: '1998-11-10',
    salario: 3500.00,
    ativo: false,
    observacoes: 'Customer inativo temporariamente'
  }
])

const showModal = ref(false)
const editing = ref(false)
const editingId = ref(null)
const isSubmitting = ref(false)

// Search and filter
const searchQuery = ref('')
const statusFilter = ref('')

// Form data
const form = ref({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  idade: 18,
  dataNascimento: '',
  salario: 0,
  ativo: true,
  observacoes: ''
})

// Form errors
const errors = ref({})

// Computed properties
const activeCustomers = computed(() => 
  customers.value.filter(c => c.ativo).length
)

const inactiveCustomers = computed(() => 
  customers.value.filter(c => !c.ativo).length
)

// Methods
const openCreateModal = () => {
  editing.value = false
  editingId.value = null
  resetForm()
  showModal.value = true
}

const editCustomer = (customer) => {
  editing.value = true
  editingId.value = customer.id
  form.value = { ...customer }
  showModal.value = true
}

const deleteCustomer = async (id) => {
  if (confirm('Tem certeza que deseja excluir este customer?')) {
    // Show global loading
    globalLoading.showDeleting()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    customers.value = customers.value.filter(c => c.id !== id)
    
    // Hide global loading
    globalLoading.hide()
  }
}

const saveCustomer = async () => {
  isSubmitting.value = true
  errors.value = {}

  // Validation
  if (!form.value.nome.trim()) {
    errors.value.nome = 'Nome é obrigatório'
  } else if (form.value.nome.length < 2) {
    errors.value.nome = 'Nome deve ter pelo menos 2 caracteres'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Email é obrigatório'
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Email inválido'
  }

  if (!form.value.cpf.trim()) {
    errors.value.cpf = 'CPF é obrigatório'
  } else if (!isValidCPF(form.value.cpf)) {
    errors.value.cpf = 'CPF inválido'
  }

  if (!form.value.telefone.trim()) {
    errors.value.telefone = 'Telefone é obrigatório'
  }

  if (!form.value.idade || form.value.idade < 1 || form.value.idade > 120) {
    errors.value.idade = 'Idade deve estar entre 1 e 120 anos'
  }

  if (!form.value.salario || form.value.salario < 0) {
    errors.value.salario = 'Salário deve ser maior que zero'
  }

  if (!form.value.dataNascimento) {
    errors.value.dataNascimento = 'Data de nascimento é obrigatória'
  }

  // If there are errors, stop submission
  if (Object.keys(errors.value).length > 0) {
    isSubmitting.value = false
    return
  }

  // Show global loading
  if (editing.value) {
    globalLoading.showUpdating()
  } else {
    globalLoading.showCreating()
  }

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))

  if (editing.value) {
    const index = customers.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      customers.value[index] = { ...form.value, id: editingId.value }
    }
  } else {
    customers.value.push({
      ...form.value,
      id: Date.now().toString()
    })
  }

  // Hide global loading
  globalLoading.hide()
  closeModal()
  isSubmitting.value = false
}

const closeModal = () => {
  showModal.value = false
  editing.value = false
  editingId.value = null
  resetForm()
}

const resetForm = () => {
  form.value = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    idade: 18,
    dataNascimento: '',
    salario: 0,
    ativo: true,
    observacoes: ''
  }
  errors.value = {}
}

// Utility functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidCPF = (cpf) => {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

const formatCPF = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.value.cpf = value
}

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.value.telefone = value
}
</script>