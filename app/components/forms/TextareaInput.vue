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
    
    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :maxlength="maxlength"
      :rows="rows"
      :class="[
        'form-input resize-none',
        {
          'border-red-500 focus:border-red-500 focus:ring-red-500': hasError,
          'opacity-50 cursor-not-allowed': disabled
        }
      ]"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    
    <div class="flex justify-between items-center mt-1">
      <div v-if="hasError" class="form-error">
        {{ errorMessage }}
      </div>
      <div v-else-if="hint" class="text-gray-500 text-sm">
        {{ hint }}
      </div>
      
      <div v-if="maxlength" class="text-gray-400 text-xs">
        {{ characterCount }}/{{ maxlength }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxlength?: number
  rows?: number
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
  disabled: false,
  rows: 3,
  modelValue: ''
})

const emit = defineEmits<Emits>()

const inputId = `textarea-input-${Math.random().toString(36).substr(2, 9)}`

const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error)

const characterCount = computed(() => (props.modelValue || '').length)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script>
