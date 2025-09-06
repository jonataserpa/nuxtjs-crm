import { useCustomerStore } from '~/stores/customer'

export default defineNuxtPlugin(async () => {
  // Inicializar stores que precisam de dados iniciais
  const customerStore = useCustomerStore()
  
  // Carregar dados iniciais se necessário
  if (process.client && customerStore.customers.length === 0) {
    try {
      await customerStore.fetchCustomers(1, 10)
    } catch (error) {
      console.warn('Falha ao carregar dados iniciais dos customers:', error)
    }
  }
})
