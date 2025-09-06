import { describe, it, expect } from 'vitest'
import {
  formatCPF,
  unformatCPF,
  formatPhone,
  unformatPhone,
  formatCurrency,
  formatDate,
  formatDateForInput,
  parseInputDate,
  isValidName,
  capitalizeWords,
  truncateText,
  generateId,
  debounce
} from '~/utils/formatters'

describe('formatters', () => {
  describe('formatCPF', () => {
    it('should format a valid CPF', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01')
    })

    it('should return original string if not 11 digits', () => {
      expect(formatCPF('123456789')).toBe('123456789')
      expect(formatCPF('123456789012')).toBe('123456789012')
    })

    it('should handle empty string', () => {
      expect(formatCPF('')).toBe('')
    })
  })

  describe('unformatCPF', () => {
    it('should remove formatting from CPF', () => {
      expect(unformatCPF('123.456.789-01')).toBe('12345678901')
    })

    it('should handle already unformatted CPF', () => {
      expect(unformatCPF('12345678901')).toBe('12345678901')
    })
  })

  describe('formatPhone', () => {
    it('should format 10-digit phone number', () => {
      expect(formatPhone('1199999999')).toBe('(11) 9999-9999')
    })

    it('should format 11-digit phone number', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
    })

    it('should return original for invalid length', () => {
      expect(formatPhone('123456789')).toBe('123456789')
      expect(formatPhone('123456789012')).toBe('123456789012')
    })
  })

  describe('unformatPhone', () => {
    it('should remove formatting from phone', () => {
      expect(unformatPhone('(11) 99999-9999')).toBe('1199999999')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency in Brazilian format', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00')
    })
  })

  describe('formatDate', () => {
    it('should format date string to Brazilian format', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatDate(date)
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })

    it('should format Date object', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })

    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('')
    })
  })

  describe('formatDateForInput', () => {
    it('should format date for HTML input', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      expect(formatDateForInput(date)).toBe('2024-01-15')
    })

    it('should handle string dates', () => {
      expect(formatDateForInput('2024-01-15T10:30:00Z')).toBe('2024-01-15')
    })

    it('should return empty string for invalid date', () => {
      expect(formatDateForInput('invalid-date')).toBe('')
    })
  })

  describe('parseInputDate', () => {
    it('should parse input date string', () => {
      const result = parseInputDate('2024-01-15')
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0) // January is 0
      expect(result.getDate()).toBe(15)
    })
  })

  describe('isValidName', () => {
    it('should validate names with letters and spaces', () => {
      expect(isValidName('João Silva')).toBe(true)
      expect(isValidName('Maria de Oliveira')).toBe(true)
      expect(isValidName('José')).toBe(true)
    })

    it('should accept names with accents', () => {
      expect(isValidName('José María')).toBe(true)
      expect(isValidName('François')).toBe(true)
    })

    it('should reject names with numbers or special characters', () => {
      expect(isValidName('João123')).toBe(false)
      expect(isValidName('Maria@silva')).toBe(false)
      expect(isValidName('João-Silva')).toBe(false)
    })

    it('should handle empty string', () => {
      expect(isValidName('')).toBe(false)
    })
  })

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('joão silva santos')).toBe('João Silva Santos')
      expect(capitalizeWords('MARIA DE OLIVEIRA')).toBe('Maria De Oliveira')
      expect(capitalizeWords('pedro')).toBe('Pedro')
    })

    it('should handle empty string', () => {
      expect(capitalizeWords('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalizeWords('a')).toBe('A')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('should not truncate short text', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('should handle exact length', () => {
      const text = '12345'
      expect(truncateText(text, 5)).toBe('12345')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
    })

    it('should generate IDs with reasonable length', () => {
      const id = generateId()
      expect(id.length).toBeGreaterThan(5)
      expect(id.length).toBeLessThan(20)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0
      const fn = () => callCount++
      const debouncedFn = debounce(fn, 100)

      // Call multiple times quickly
      debouncedFn()
      debouncedFn()
      debouncedFn()

      // Should not have been called yet
      expect(callCount).toBe(0)

      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 150))

      // Should have been called only once
      expect(callCount).toBe(1)
    })

    it('should pass arguments to debounced function', async () => {
      let receivedArgs: any[] = []
      const fn = (...args: any[]) => {
        receivedArgs = args
      }
      const debouncedFn = debounce(fn, 50)

      debouncedFn('test', 123, { key: 'value' })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(receivedArgs).toEqual(['test', 123, { key: 'value' }])
    })
  })
})
