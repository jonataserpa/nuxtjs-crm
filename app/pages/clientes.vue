<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">Lista de Customers</h2>
        <button @click="showModal = true" class="btn btn-primary">
          Novo Customer
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ customer.nome }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ customer.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ customer.cpf }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  customer.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ customer.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editCustomer(customer)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                  Editar
                </button>
                <button @click="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-900">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content max-w-lg" @click.stop>
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-medium">{{ editing ? 'Editar Customer' : 'Novo Customer' }}</h3>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="form-label">Nome</label>
            <input v-model="form.nome" type="text" class="form-input" required>
          </div>
          <div>
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" required>
          </div>
          <div>
            <label class="form-label">CPF</label>
            <input v-model="form.cpf" type="text" class="form-input" required>
          </div>
          <div class="flex items-center">
            <input v-model="form.ativo" type="checkbox" class="mr-2">
            <label class="text-sm">Customer ativo</label>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button @click="saveCustomer" class="btn btn-primary">
            {{ editing ? 'Atualizar' : 'Criar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const customers = ref([
  { id: '1', nome: 'João Silva Santos', email: 'joao.silva@email.com', cpf: '123.456.789-01', ativo: true },
  { id: '2', nome: 'Maria Oliveira Costa', email: 'maria.costa@email.com', cpf: '987.654.321-02', ativo: true },
  { id: '3', nome: 'Ana Carolina Ferreira', email: 'ana.ferreira@email.com', cpf: '789.123.456-04', ativo: true },
  { id: '4', nome: 'Carlos Eduardo Souza', email: 'carlos.souza@email.com', cpf: '321.654.987-05', ativo: true },
  { id: '5', nome: 'Pedro Henrique Lima', email: 'pedro.lima@email.com', cpf: '456.789.123-03', ativo: false }
])

const showModal = ref(false)
const editing = ref(false)
const editingId = ref(null)
const form = ref({ nome: '', email: '', cpf: '', ativo: true })

const editCustomer = (customer) => {
  editing.value = true
  editingId.value = customer.id
  form.value = { ...customer }
  showModal.value = true
}

const deleteCustomer = (id) => {
  if (confirm('Tem certeza que deseja excluir este customer?')) {
    customers.value = customers.value.filter(c => c.id !== id)
  }
}

const saveCustomer = () => {
  if (editing.value) {
    const index = customers.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      customers.value[index] = { ...form.value, id: editingId.value }
    }
  } else {
    customers.value.push({ ...form.value, id: Date.now().toString() })
  }
  closeModal()
}

const closeModal = () => {
  showModal.value = false
  editing.value = false
  editingId.value = null
  form.value = { nome: '', email: '', cpf: '', ativo: true }
}
</script>
