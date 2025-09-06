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
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :step="step"
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
interface Props {
  modelValue?: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxlength?: number
  min?: number | string
  max?: number | string
  step?: number | string
  error?: string
  hint?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

const emit = defineEmits<Emits>()

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script>
