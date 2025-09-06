// Formatadores para diferentes tipos de dados

/**
 * Formata CPF: 00000000000 -> 000.000.000-00
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return cpf
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Remove formatação do CPF: 000.000.000-00 -> 00000000000
 */
export function unformatCPF(cpf: string): string {
  return cpf.replace(/[.-]/g, '')
}

/**
 * Formata telefone: 11999999999 -> (11) 99999-9999
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

/**
 * Remove formatação do telefone
 */
export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

/**
 * Formata moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Formata data para o formato brasileiro DD/MM/AAAA
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return ''
  
  return new Intl.DateTimeFormat('pt-BR').format(dateObj)
}

/**
 * Formata data para input HTML (YYYY-MM-DD)
 */
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return ''
  
  return dateObj.toISOString().split('T')[0]
}

/**
 * Converte data do input HTML para Date
 */
export function parseInputDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00')
}

/**
 * Valida se uma string contém apenas letras e espaços (para nomes)
 */
export function isValidName(name: string): boolean {
  return /^[a-zA-ZÀ-ÿ\s]+$/.test(name)
}

/**
 * Capitaliza primeira letra de cada palavra
 */
export function capitalizeWords(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}

/**
 * Trunca texto com ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Gera ID único simples
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
