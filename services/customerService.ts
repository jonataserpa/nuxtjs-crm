import type { 
  Customer, 
  CreateCustomer, 
  UpdateCustomer, 
  ApiResponse, 
  PaginatedResponse 
} from '~/types/customer'
import { customerSchema, createCustomerSchema, updateCustomerSchema } from '~/types/customer'
import { generateId } from '~/utils/formatters'

// Dados mockados para desenvolvimento
const mockCustomers: Customer[] = [
  {
    id: '1',
    nome: 'João Silva Santos',
    cpf: '123.456.789-01',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-1234',
    idade: 35,
    dataNascimento: '1989-03-15',
    salario: 5500.00,
    ativo: true,
    observacoes: 'Cliente VIP, preferência por atendimento manhã',
    criadoEm: '2024-01-15T10:30:00Z',
    atualizadoEm: '2024-01-20T14:22:00Z'
  },
  {
    id: '2',
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-02',
    email: 'maria.costa@email.com',
    telefone: '(11) 88888-5678',
    idade: 28,
    dataNascimento: '1996-07-22',
    salario: 3200.00,
    ativo: true,
    observacoes: '',
    criadoEm: '2024-01-10T09:15:00Z',
    atualizadoEm: '2024-01-18T16:45:00Z'
  },
  {
    id: '3',
    nome: 'Pedro Henrique Lima',
    cpf: '456.789.123-03',
    email: 'pedro.lima@email.com',
    telefone: '(11) 77777-9012',
    idade: 42,
    dataNascimento: '1982-11-08',
    salario: 7800.00,
    ativo: false,
    observacoes: 'Ex-cliente, possível reativação',
    criadoEm: '2023-11-20T13:25:00Z',
    atualizadoEm: '2024-01-05T11:10:00Z'
  },
  {
    id: '4',
    nome: 'Ana Carolina Ferreira',
    cpf: '789.123.456-04',
    email: 'ana.ferreira@email.com',
    telefone: '(11) 66666-3456',
    idade: 31,
    dataNascimento: '1993-05-12',
    salario: 4500.00,
    ativo: true,
    observacoes: 'Interesse em produtos premium',
    criadoEm: '2024-01-08T15:40:00Z',
    atualizadoEm: '2024-01-22T10:20:00Z'
  },
  {
    id: '5',
    nome: 'Carlos Eduardo Souza',
    cpf: '321.654.987-05',
    email: 'carlos.souza@email.com',
    telefone: '(11) 55555-7890',
    idade: 26,
    dataNascimento: '1998-09-30',
    salario: 2800.00,
    ativo: true,
    observacoes: 'Cliente novo, primeiro contato',
    criadoEm: '2024-01-25T08:20:00Z',
    atualizadoEm: '2024-01-25T08:20:00Z'
  }
]

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface GetAllParams {
  page?: number
  pageSize?: number
  search?: string
  ativo?: boolean | null
}

class CustomerService {
  private customers: Customer[] = [...mockCustomers]

  // Buscar todos os customers com paginação
  async getAll(params: GetAllParams = {}): Promise<PaginatedResponse<Customer>> {
    await delay(500) // Simula latência de rede

    const { 
      page = 1, 
      pageSize = 10, 
      search = '', 
      ativo = null 
    } = params

    let filtered = [...this.customers]

    // Filtro por busca
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(customer =>
        customer.nome.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.cpf.includes(search) ||
        customer.telefone.includes(search)
      )
    }

    // Filtro por status ativo
    if (ativo !== null) {
      filtered = filtered.filter(customer => customer.ativo === ativo)
    }

    // Ordenação por nome
    filtered.sort((a, b) => a.nome.localeCompare(b.nome))

    // Paginação
    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filtered.slice(start, end)

    return {
      data,
      total,
      page,
      pageSize,
      totalPages
    }
  }

  // Buscar customer por ID
  async getById(id: string): Promise<ApiResponse<Customer>> {
    await delay(300)

    const customer = this.customers.find(c => c.id === id)
    
    if (!customer) {
      throw new Error('Customer não encontrado')
    }

    return {
      data: customer,
      message: 'Customer encontrado com sucesso'
    }
  }

  // Criar novo customer
  async create(customerData: CreateCustomer): Promise<ApiResponse<Customer>> {
    await delay(600)

    // Validação com Zod
    const validatedData = createCustomerSchema.parse(customerData)

    // Verificar se CPF já existe
    const cpfExists = this.customers.some(c => c.cpf === validatedData.cpf)
    if (cpfExists) {
      throw new Error('CPF já cadastrado')
    }

    // Verificar se email já existe
    const emailExists = this.customers.some(c => c.email === validatedData.email)
    if (emailExists) {
      throw new Error('Email já cadastrado')
    }

    // Criar novo customer
    const now = new Date().toISOString()
    const newCustomer: Customer = {
      ...validatedData,
      id: generateId(),
      criadoEm: now,
      atualizadoEm: now
    }

    // Validar customer completo
    const validatedCustomer = customerSchema.parse(newCustomer)

    this.customers.unshift(validatedCustomer)

    return {
      data: validatedCustomer,
      message: 'Customer criado com sucesso'
    }
  }

  // Atualizar customer
  async update(id: string, customerData: UpdateCustomer): Promise<ApiResponse<Customer>> {
    await delay(600)

    // Validação com Zod
    const validatedData = updateCustomerSchema.parse({ ...customerData, id })

    const customerIndex = this.customers.findIndex(c => c.id === id)
    
    if (customerIndex === -1) {
      throw new Error('Customer não encontrado')
    }

    const existingCustomer = this.customers[customerIndex]

    // Verificar se CPF já existe em outro customer
    if (validatedData.cpf && validatedData.cpf !== existingCustomer.cpf) {
      const cpfExists = this.customers.some(c => c.id !== id && c.cpf === validatedData.cpf)
      if (cpfExists) {
        throw new Error('CPF já cadastrado em outro customer')
      }
    }

    // Verificar se email já existe em outro customer
    if (validatedData.email && validatedData.email !== existingCustomer.email) {
      const emailExists = this.customers.some(c => c.id !== id && c.email === validatedData.email)
      if (emailExists) {
        throw new Error('Email já cadastrado em outro customer')
      }
    }

    // Atualizar customer
    const updatedCustomer: Customer = {
      ...existingCustomer,
      ...validatedData,
      atualizadoEm: new Date().toISOString()
    }

    // Validar customer completo
    const validatedCustomer = customerSchema.parse(updatedCustomer)

    this.customers[customerIndex] = validatedCustomer

    return {
      data: validatedCustomer,
      message: 'Customer atualizado com sucesso'
    }
  }

  // Deletar customer
  async delete(id: string): Promise<ApiResponse<null>> {
    await delay(400)

    const customerIndex = this.customers.findIndex(c => c.id === id)
    
    if (customerIndex === -1) {
      throw new Error('Customer não encontrado')
    }

    this.customers.splice(customerIndex, 1)

    return {
      data: null,
      message: 'Customer deletado com sucesso'
    }
  }

  // Buscar customers por filtros avançados
  async search(filters: {
    nome?: string
    email?: string
    cpf?: string
    ativo?: boolean
    idadeMin?: number
    idadeMax?: number
    salarioMin?: number
    salarioMax?: number
  }): Promise<ApiResponse<Customer[]>> {
    await delay(400)

    let filtered = [...this.customers]

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        switch (key) {
          case 'nome':
            filtered = filtered.filter(c => 
              c.nome.toLowerCase().includes((value as string).toLowerCase())
            )
            break
          case 'email':
            filtered = filtered.filter(c => 
              c.email.toLowerCase().includes((value as string).toLowerCase())
            )
            break
          case 'cpf':
            filtered = filtered.filter(c => c.cpf.includes(value as string))
            break
          case 'ativo':
            filtered = filtered.filter(c => c.ativo === value)
            break
          case 'idadeMin':
            filtered = filtered.filter(c => c.idade >= (value as number))
            break
          case 'idadeMax':
            filtered = filtered.filter(c => c.idade <= (value as number))
            break
          case 'salarioMin':
            filtered = filtered.filter(c => c.salario >= (value as number))
            break
          case 'salarioMax':
            filtered = filtered.filter(c => c.salario <= (value as number))
            break
        }
      }
    })

    return {
      data: filtered,
      message: `${filtered.length} customers encontrados`
    }
  }

  // Estatísticas dos customers
  async getStats(): Promise<ApiResponse<{
    total: number
    ativos: number
    inativos: number
    idadeMedia: number
    salarioMedio: number
  }>> {
    await delay(200)

    const total = this.customers.length
    const ativos = this.customers.filter(c => c.ativo).length
    const inativos = total - ativos
    const idadeMedia = this.customers.reduce((sum, c) => sum + c.idade, 0) / total
    const salarioMedio = this.customers.reduce((sum, c) => sum + c.salario, 0) / total

    return {
      data: {
        total,
        ativos,
        inativos,
        idadeMedia: Math.round(idadeMedia * 100) / 100,
        salarioMedio: Math.round(salarioMedio * 100) / 100
      },
      message: 'Estatísticas calculadas com sucesso'
    }
  }
}

// Exportar instância singleton
export const customerService = new CustomerService()
