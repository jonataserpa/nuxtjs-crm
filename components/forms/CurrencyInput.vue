<template>
  <div class="form-group">
    <label 
      v-if="label" 
      :for="inputId" 
      class="form-label"
      :class="{ 'text-red-600': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        R$
      </span>
      <input
        :id="inputId"
        :value="formattedValue"
        type="text"
        :placeholder="placeholder || '0,00'"
        :required="required"
        :disabled="disabled"
        :class="[
          'form-input pl-10',
          {
            'border-red-500 focus:border-red-500 focus:ring-red-500': hasError,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>
    
    <div v-if="hasError" class="form-error">
      {{ errorMessage }}
    </div>
    
    <div v-if="hint && !hasError" class="text-gray-500 text-sm mt-1">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  modelValue: 0
})

const emit = defineEmits<Emits>()

const inputId = `currency-input-${Math.random().toString(36).substr(2, 9)}`

const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error)

const formattedValue = computed(() => {
  const value = props.modelValue || 0
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  // Remove tudo exceto números e vírgula
  value = value.replace(/[^\d,]/g, '')
  
  // Remove vírgulas múltiplas
  const commaCount = (value.match(/,/g) || []).length
  if (commaCount > 1) {
    const parts = value.split(',')
    value = parts[0] + ',' + parts.slice(1).join('')
  }
  
  // Converte para número
  const numericValue = parseFloat(value.replace(',', '.')) || 0
  
  // Limita a valores positivos e razoáveis
  const limitedValue = Math.min(Math.max(numericValue, 0), 999999999.99)
  
  // Atualiza o valor do input
  target.value = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(limitedValue)
  
  emit('update:modelValue', limitedValue)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = (event: Event) => {
  const target = event.target as HTMLInputElement
  // Seleciona todo o texto para facilitar edição
  setTimeout(() => target.select(), 0)
  emit('focus')
}
</script>
