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
    
    <input
      :id="inputId"
      :value="formattedValue"
      type="tel"
      :placeholder="placeholder || '(00) 00000-0000'"
      :required="required"
      :disabled="disabled"
      maxlength="15"
      :class="[
        'form-input',
        {
          'border-red-500 focus:border-red-500 focus:ring-red-500': hasError,
          'opacity-50 cursor-not-allowed': disabled
        }
      ]"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    
    <div v-if="hasError" class="form-error">
      {{ errorMessage }}
    </div>
    
    <div v-if="hint && !hasError" class="text-gray-500 text-sm mt-1">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhone, unformatPhone } from '~/utils/formatters'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
})

const emit = defineEmits<Emits>()

const inputId = `phone-input-${Math.random().toString(36).substr(2, 9)}`

const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error)

const formattedValue = computed(() => {
  if (!props.modelValue) return ''
  return formatPhone(props.modelValue)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove tudo que não é número
  const numbersOnly = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos
  const limitedNumbers = numbersOnly.substring(0, 11)
  
  // Formata o telefone
  const formatted = formatPhone(limitedNumbers)
  
  // Atualiza o valor do input
  target.value = formatted
  
  // Emite o valor formatado para validação
  emit('update:modelValue', formatted)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script>
