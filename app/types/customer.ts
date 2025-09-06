import { z } from 'zod'

// Validação para CPF (formato 000.000.000-00)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/

// Schema Zod para validação de Customer
export const customerSchema = z.object({
  id: z.string().optional(),
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  cpf: z.string()
    .regex(cpfRegex, 'CPF deve estar no formato 000.000.000-00')
    .refine(validateCPF, 'CPF inválido'),
  email: z.string()
    .email('Email deve ter um formato válido')
    .max(150, 'Email deve ter no máximo 150 caracteres'),
  telefone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000')
    .min(14, 'Telefone deve ter pelo menos 14 caracteres'),
  idade: z.number()
    .int('Idade deve ser um número inteiro')
    .min(1, 'Idade deve ser pelo menos 1')
    .max(120, 'Idade deve ser no máximo 120'),
  dataNascimento: z.string()
    .refine((date) => {
      const parsedDate = new Date(date)
      return !isNaN(parsedDate.getTime()) && parsedDate <= new Date()
    }, 'Data de nascimento deve ser uma data válida e não pode ser no futuro'),
  salario: z.number()
    .positive('Salário deve ser um valor positivo')
    .max(1000000, 'Salário deve ser no máximo R$ 1.000.000,00'),
  ativo: z.boolean(),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional(),
  criadoEm: z.string().optional(),
  atualizadoEm: z.string().optional()
})

// Tipo TypeScript inferido do schema Zod
export type Customer = z.infer<typeof customerSchema>

// Tipo para criação de customer (sem id, criadoEm, atualizadoEm)
export const createCustomerSchema = customerSchema.omit({ 
  id: true, 
  criadoEm: true, 
  atualizadoEm: true 
})

export type CreateCustomer = z.infer<typeof createCustomerSchema>

// Tipo para atualização de customer (todos os campos opcionais exceto id)
export const updateCustomerSchema = customerSchema.partial().extend({
  id: z.string().min(1, 'ID é obrigatório')
})

export type UpdateCustomer = z.infer<typeof updateCustomerSchema>

// Função para validar CPF
function validateCPF(cpf: string): boolean {
  // Remove pontos e hífen
  const cleanCPF = cpf.replace(/[.-]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  
  let firstDigit = 11 - (sum % 11)
  if (firstDigit >= 10) firstDigit = 0
  
  if (parseInt(cleanCPF.charAt(9)) !== firstDigit) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  
  let secondDigit = 11 - (sum % 11)
  if (secondDigit >= 10) secondDigit = 0
  
  return parseInt(cleanCPF.charAt(10)) === secondDigit
}

// Interface para resposta da API
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
