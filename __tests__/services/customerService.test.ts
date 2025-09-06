import { describe, it, expect, beforeEach } from 'vitest'
import { customerService } from '~/services/customerService'
import type { CreateCustomer, UpdateCustomer } from '~/types/customer'

describe('customerService', () => {
  // Mock data para testes
  const mockCreateCustomer: CreateCustomer = {
    nome: 'Test Customer',
    cpf: '111.444.777-35', // CPF válido
    email: 'test@example.com',
    telefone: '(11) 99999-9999',
    idade: 30,
    dataNascimento: '1994-01-15',
    salario: 5000.00,
    ativo: true,
    observacoes: 'Test customer for unit tests'
  }

  describe('getAll', () => {
    it('should return paginated customers', async () => {
      const result = await customerService.getAll()
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('pageSize')
      expect(result).toHaveProperty('totalPages')
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(10)
    })

    it('should return customers with correct pagination', async () => {
      const result = await customerService.getAll({ page: 1, pageSize: 2 })
      
      expect(result.data.length).toBeLessThanOrEqual(2)
      expect(result.pageSize).toBe(2)
    })

    it('should filter by search term', async () => {
      const result = await customerService.getAll({ search: 'João' })
      
      result.data.forEach(customer => {
        const searchFields = [
          customer.nome.toLowerCase(),
          customer.email.toLowerCase(),
          customer.cpf,
          customer.telefone
        ]
        
        const hasSearchTerm = searchFields.some(field => 
          field.includes('joão') || field.includes('joao')
        )
        
        expect(hasSearchTerm).toBe(true)
      })
    })

    it('should filter by active status', async () => {
      const activeResult = await customerService.getAll({ ativo: true })
      const inactiveResult = await customerService.getAll({ ativo: false })
      
      activeResult.data.forEach(customer => {
        expect(customer.ativo).toBe(true)
      })
      
      inactiveResult.data.forEach(customer => {
        expect(customer.ativo).toBe(false)
      })
    })
  })

  describe('getById', () => {
    it('should return customer by ID', async () => {
      // Primeiro, pegar a lista para ter um ID válido
      const allCustomers = await customerService.getAll()
      const existingCustomer = allCustomers.data[0]
      
      const result = await customerService.getById(existingCustomer.id!)
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('message')
      expect(result.data.id).toBe(existingCustomer.id)
    })

    it('should throw error for non-existent customer', async () => {
      await expect(customerService.getById('non-existent-id')).rejects.toThrow('Customer não encontrado')
    })
  })

  describe('create', () => {
    it('should create a new customer', async () => {
      const result = await customerService.create(mockCreateCustomer)
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('message')
      expect(result.data).toHaveProperty('id')
      expect(result.data.nome).toBe(mockCreateCustomer.nome)
      expect(result.data.cpf).toBe(mockCreateCustomer.cpf)
      expect(result.data).toHaveProperty('criadoEm')
      expect(result.data).toHaveProperty('atualizadoEm')
    })

    it('should throw error for duplicate CPF', async () => {
      // Criar um customer
      await customerService.create(mockCreateCustomer)
      
      // Tentar criar outro com mesmo CPF
      await expect(customerService.create(mockCreateCustomer))
        .rejects.toThrow('CPF já cadastrado')
    })

    it('should throw error for duplicate email', async () => {
      // Criar um customer
      const firstCustomer = { ...mockCreateCustomer, cpf: '123.456.789-01' }
      await customerService.create(firstCustomer)
      
      // Tentar criar outro com mesmo email mas CPF diferente
      const secondCustomer = { ...mockCreateCustomer, cpf: '987.654.321-02' }
      await expect(customerService.create(secondCustomer))
        .rejects.toThrow('Email já cadastrado')
    })

    it('should validate customer data with Zod', async () => {
      const invalidCustomer = { ...mockCreateCustomer, email: 'invalid-email' }
      
      await expect(customerService.create(invalidCustomer as CreateCustomer))
        .rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update existing customer', async () => {
      // Criar um customer primeiro
      const created = await customerService.create({
        ...mockCreateCustomer,
        cpf: '999.888.777-66',
        email: 'update-test@example.com'
      })
      
      const updateData: UpdateCustomer = {
        id: created.data.id!,
        nome: 'Updated Name',
        email: 'updated@example.com'
      }
      
      const result = await customerService.update(created.data.id!, updateData)
      
      expect(result.data.nome).toBe('Updated Name')
      expect(result.data.email).toBe('updated@example.com')
      expect(result.data.atualizadoEm).not.toBe(created.data.atualizadoEm)
    })

    it('should throw error for non-existent customer', async () => {
      const updateData: UpdateCustomer = {
        id: 'non-existent',
        nome: 'Updated Name'
      }
      
      await expect(customerService.update('non-existent', updateData))
        .rejects.toThrow('Customer não encontrado')
    })

    it('should prevent CPF conflicts on update', async () => {
      // Criar dois customers
      const customer1 = await customerService.create({
        ...mockCreateCustomer,
        cpf: '111.222.333-44',
        email: 'customer1@example.com'
      })
      
      const customer2 = await customerService.create({
        ...mockCreateCustomer,
        cpf: '555.666.777-88',
        email: 'customer2@example.com'
      })
      
      // Tentar atualizar customer2 com CPF do customer1
      const updateData: UpdateCustomer = {
        id: customer2.data.id!,
        cpf: customer1.data.cpf
      }
      
      await expect(customerService.update(customer2.data.id!, updateData))
        .rejects.toThrow('CPF já cadastrado em outro customer')
    })
  })

  describe('delete', () => {
    it('should delete existing customer', async () => {
      // Criar um customer primeiro
      const created = await customerService.create({
        ...mockCreateCustomer,
        cpf: '777.888.999-00',
        email: 'delete-test@example.com'
      })
      
      const result = await customerService.delete(created.data.id!)
      
      expect(result).toHaveProperty('message')
      expect(result.data).toBe(null)
      
      // Verificar se foi realmente deletado
      await expect(customerService.getById(created.data.id!))
        .rejects.toThrow('Customer não encontrado')
    })

    it('should throw error for non-existent customer', async () => {
      await expect(customerService.delete('non-existent-id'))
        .rejects.toThrow('Customer não encontrado')
    })
  })

  describe('search', () => {
    it('should search customers by name', async () => {
      const result = await customerService.search({ nome: 'Silva' })
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('message')
      
      result.data.forEach(customer => {
        expect(customer.nome.toLowerCase()).toContain('silva')
      })
    })

    it('should search customers by email', async () => {
      const result = await customerService.search({ email: 'email.com' })
      
      result.data.forEach(customer => {
        expect(customer.email.toLowerCase()).toContain('email.com')
      })
    })

    it('should search customers by age range', async () => {
      const result = await customerService.search({ idadeMin: 25, idadeMax: 35 })
      
      result.data.forEach(customer => {
        expect(customer.idade).toBeGreaterThanOrEqual(25)
        expect(customer.idade).toBeLessThanOrEqual(35)
      })
    })
  })

  describe('getStats', () => {
    it('should return customer statistics', async () => {
      const result = await customerService.getStats()
      
      expect(result).toHaveProperty('data')
      expect(result.data).toHaveProperty('total')
      expect(result.data).toHaveProperty('ativos')
      expect(result.data).toHaveProperty('inativos')
      expect(result.data).toHaveProperty('idadeMedia')
      expect(result.data).toHaveProperty('salarioMedio')
      
      expect(typeof result.data.total).toBe('number')
      expect(typeof result.data.ativos).toBe('number')
      expect(typeof result.data.inativos).toBe('number')
      expect(typeof result.data.idadeMedia).toBe('number')
      expect(typeof result.data.salarioMedio).toBe('number')
      
      expect(result.data.total).toBe(result.data.ativos + result.data.inativos)
    })
  })
})
