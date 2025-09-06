<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Lista de Customers</h2>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-500">Carregando...</p>
      </div>
      
      <div v-else>
        <p class="text-gray-600 mb-4">
          Total de customers: {{ customers.length }}
        </p>
        
        <div class="space-y-2">
          <div 
            v-for="customer in customers" 
            :key="customer.id"
            class="p-4 border rounded-lg"
          >
            <h3 class="font-medium">{{ customer.nome }}</h3>
            <p class="text-sm text-gray-500">{{ customer.email }}</p>
            <p class="text-sm text-gray-500">{{ customer.cpf }}</p>
          </div>
        </div>
        
        <div v-if="customers.length === 0" class="text-center py-8">
          <p class="text-gray-500">Nenhum customer encontrado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Customers - Sistema CRUD'
})

// Estado reativo
const customers = ref<any[]>([])
const loading = ref(true)

// Simulação de dados
onMounted(async () => {
  loading.value = true
  
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Dados mockados simples
  customers.value = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      cpf: '123.456.789-01'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@email.com',
      cpf: '987.654.321-02'
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro@email.com',
      cpf: '456.789.123-03'
    }
  ]
  
  loading.value = false
})
</script>