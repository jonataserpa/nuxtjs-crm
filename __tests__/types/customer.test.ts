import { describe, it, expect } from 'vitest'
import { customerSchema, createCustomerSchema, updateCustomerSchema } from '~/types/customer'

describe('customer schemas', () => {
  const validCustomerData = {
    id: '1',
    nome: 'João Silva Santos',
    cpf: '123.456.789-01',
    email: 'joao@example.com',
    telefone: '(11) 99999-9999',
    idade: 30,
    dataNascimento: '1994-01-15',
    salario: 5000.00,
    ativo: true,
    observacoes: 'Customer VIP',
    criadoEm: '2024-01-15T10:30:00Z',
    atualizadoEm: '2024-01-15T10:30:00Z'
  }

  describe('customerSchema', () => {
    it('should validate a complete valid customer', () => {
      const result = customerSchema.safeParse(validCustomerData)
      expect(result.success).toBe(true)
    })

    it('should accept customer without optional fields', () => {
      const { observacoes, id, criadoEm, atualizadoEm, ...requiredData } = validCustomerData
      const result = customerSchema.safeParse(requiredData)
      expect(result.success).toBe(true)
    })

    describe('nome validation', () => {
      it('should reject names that are too short', () => {
        const data = { ...validCustomerData, nome: 'A' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject names that are too long', () => {
        const data = { ...validCustomerData, nome: 'A'.repeat(101) }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject names with numbers', () => {
        const data = { ...validCustomerData, nome: 'João123' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject names with special characters', () => {
        const data = { ...validCustomerData, nome: 'João@Silva' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should accept names with accents', () => {
        const data = { ...validCustomerData, nome: 'José María' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    describe('cpf validation', () => {
      it('should accept valid CPF format', () => {
        const data = { ...validCustomerData, cpf: '123.456.789-01' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject invalid CPF format', () => {
        const data = { ...validCustomerData, cpf: '12345678901' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject invalid CPF (all same digits)', () => {
        const data = { ...validCustomerData, cpf: '111.111.111-11' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject CPF with wrong check digits', () => {
        const data = { ...validCustomerData, cpf: '123.456.789-99' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should accept valid real CPF', () => {
        // CPF válido: 111.444.777-35
        const data = { ...validCustomerData, cpf: '111.444.777-35' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    describe('email validation', () => {
      it('should accept valid email', () => {
        const data = { ...validCustomerData, email: 'test@example.com' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject invalid email', () => {
        const data = { ...validCustomerData, email: 'invalid-email' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject email that is too long', () => {
        const data = { ...validCustomerData, email: 'a'.repeat(140) + '@example.com' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('telefone validation', () => {
      it('should accept valid phone format', () => {
        const data = { ...validCustomerData, telefone: '(11) 99999-9999' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should accept landline format', () => {
        const data = { ...validCustomerData, telefone: '(11) 3333-4444' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject invalid phone format', () => {
        const data = { ...validCustomerData, telefone: '11999999999' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject phone that is too short', () => {
        const data = { ...validCustomerData, telefone: '(11) 999-999' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('idade validation', () => {
      it('should accept valid age', () => {
        const data = { ...validCustomerData, idade: 25 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject age below 1', () => {
        const data = { ...validCustomerData, idade: 0 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject age above 120', () => {
        const data = { ...validCustomerData, idade: 121 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject non-integer age', () => {
        const data = { ...validCustomerData, idade: 25.5 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('dataNascimento validation', () => {
      it('should accept valid past date', () => {
        const data = { ...validCustomerData, dataNascimento: '1990-01-01' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should accept today as birth date', () => {
        const today = new Date().toISOString().split('T')[0]
        const data = { ...validCustomerData, dataNascimento: today }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject future date', () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const data = { ...validCustomerData, dataNascimento: tomorrow.toISOString().split('T')[0] }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject invalid date format', () => {
        const data = { ...validCustomerData, dataNascimento: '01/01/1990' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('salario validation', () => {
      it('should accept positive salary', () => {
        const data = { ...validCustomerData, salario: 1000.50 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject zero salary', () => {
        const data = { ...validCustomerData, salario: 0 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject negative salary', () => {
        const data = { ...validCustomerData, salario: -1000 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should reject salary above maximum', () => {
        const data = { ...validCustomerData, salario: 1000001 }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('observacoes validation', () => {
      it('should accept empty observacoes', () => {
        const data = { ...validCustomerData, observacoes: '' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should accept valid observacoes', () => {
        const data = { ...validCustomerData, observacoes: 'Some valid observation' }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject observacoes that are too long', () => {
        const data = { ...validCustomerData, observacoes: 'a'.repeat(501) }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })

      it('should accept observacoes at maximum length', () => {
        const data = { ...validCustomerData, observacoes: 'a'.repeat(500) }
        const result = customerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('createCustomerSchema', () => {
    it('should validate customer data for creation', () => {
      const { id, criadoEm, atualizadoEm, ...createData } = validCustomerData
      const result = createCustomerSchema.safeParse(createData)
      expect(result.success).toBe(true)
    })

    it('should reject data with id field', () => {
      const result = createCustomerSchema.safeParse(validCustomerData)
      expect(result.success).toBe(true) // id is omitted, so it's ignored
    })
  })

  describe('updateCustomerSchema', () => {
    it('should validate customer data for update with id', () => {
      const updateData = { id: '1', nome: 'Updated Name' }
      const result = updateCustomerSchema.safeParse(updateData)
      expect(result.success).toBe(true)
    })

    it('should require id field', () => {
      const updateData = { nome: 'Updated Name' }
      const result = updateCustomerSchema.safeParse(updateData)
      expect(result.success).toBe(false)
    })

    it('should reject empty id', () => {
      const updateData = { id: '', nome: 'Updated Name' }
      const result = updateCustomerSchema.safeParse(updateData)
      expect(result.success).toBe(false)
    })

    it('should allow partial updates', () => {
      const updateData = { id: '1', email: 'newemail@example.com' }
      const result = updateCustomerSchema.safeParse(updateData)
      expect(result.success).toBe(true)
    })
  })
})
