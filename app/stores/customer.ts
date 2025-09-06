import { defineStore } from 'pinia'
import type { Customer, CreateCustomer, UpdateCustomer, PaginatedResponse } from '~/types/customer'
import { customerService } from '~/services/customerService'

interface CustomerState {
  customers: Customer[]
  currentCustomer: Customer | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  filters: {
    search: string
    ativo: boolean | null
  }
}

export const useCustomerStore = defineStore('customer', {
  state: (): CustomerState => ({
    customers: [],
    currentCustomer: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      ativo: null
    }
  }),

  getters: {
    // Lista filtrada de customers
    filteredCustomers: (state) => {
      let filtered = state.customers

      // Filtro por texto de busca
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(customer =>
          customer.nome.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search) ||
          customer.cpf.includes(search) ||
          customer.telefone.includes(search)
        )
      }

      // Filtro por status ativo
      if (state.filters.ativo !== null) {
        filtered = filtered.filter(customer => customer.ativo === state.filters.ativo)
      }

      return filtered
    },

    // Customers paginados
    paginatedCustomers: (state) => {
      const start = (state.pagination.page - 1) * state.pagination.pageSize
      const end = start + state.pagination.pageSize
      return state.customers.slice(start, end)
    },

    // Total de customers ativos
    totalActiveCustomers: (state) => {
      return state.customers.filter(customer => customer.ativo).length
    },

    // Total de customers inativos
    totalInactiveCustomers: (state) => {
      return state.customers.filter(customer => !customer.ativo).length
    },

    // Verifica se tem dados carregados
    hasData: (state) => state.customers.length > 0,

    // Verifica se está vazio
    isEmpty: (state) => !state.loading && state.customers.length === 0
  },

  actions: {
    // Buscar todos os customers
    async fetchCustomers(page = 1, pageSize = 10) {
      this.loading = true
      this.error = null

      try {
        const response = await customerService.getAll({ page, pageSize })
        
        this.customers = response.data
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao buscar customers'
        console.error('Erro ao buscar customers:', error)
      } finally {
        this.loading = false
      }
    },

    // Buscar customer por ID
    async fetchCustomerById(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await customerService.getById(id)
        this.currentCustomer = response.data
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao buscar customer'
        console.error('Erro ao buscar customer:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar novo customer
    async createCustomer(customerData: CreateCustomer) {
      this.loading = true
      this.error = null

      try {
        const response = await customerService.create(customerData)
        this.customers.unshift(response.data)
        this.pagination.total += 1
        
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao criar customer'
        console.error('Erro ao criar customer:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar customer
    async updateCustomer(id: string, customerData: UpdateCustomer) {
      this.loading = true
      this.error = null

      try {
        const response = await customerService.update(id, customerData)
        const index = this.customers.findIndex(c => c.id === id)
        
        if (index !== -1) {
          this.customers[index] = response.data
        }

        if (this.currentCustomer?.id === id) {
          this.currentCustomer = response.data
        }

        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao atualizar customer'
        console.error('Erro ao atualizar customer:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar customer
    async deleteCustomer(id: string) {
      this.loading = true
      this.error = null

      try {
        await customerService.delete(id)
        this.customers = this.customers.filter(c => c.id !== id)
        this.pagination.total -= 1

        if (this.currentCustomer?.id === id) {
          this.currentCustomer = null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao deletar customer'
        console.error('Erro ao deletar customer:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Definir filtros
    setFilters(filters: Partial<CustomerState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    // Limpar filtros
    clearFilters() {
      this.filters = {
        search: '',
        ativo: null
      }
    },

    // Definir página atual
    setPage(page: number) {
      this.pagination.page = page
    },

    // Definir tamanho da página
    setPageSize(pageSize: number) {
      this.pagination.pageSize = pageSize
      this.pagination.page = 1 // Reset para primeira página
    },

    // Definir customer atual
    setCurrentCustomer(customer: Customer | null) {
      this.currentCustomer = customer
    },

    // Limpar erro
    clearError() {
      this.error = null
    },

    // Reset do store
    $reset() {
      this.customers = []
      this.currentCustomer = null
      this.loading = false
      this.error = null
      this.pagination = {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      }
      this.filters = {
        search: '',
        ativo: null
      }
    }
  }
})
