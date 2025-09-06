<template>
  <div class="form-group">
    <div class="flex items-center">
      <input
        :id="inputId"
        :checked="modelValue"
        type="checkbox"
        :required="required"
        :disabled="disabled"
        :class="[
          'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
          {
            'border-red-500': hasError,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
        @change="handleChange"
      />
      <label 
        :for="inputId" 
        :class="[
          'ml-2 block text-sm',
          {
            'text-red-600': hasError,
            'text-gray-700': !hasError,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
    </div>
    
    <div v-if="hasError" class="form-error mt-1">
      {{ errorMessage }}
    </div>
    
    <div v-if="hint && !hasError" class="text-gray-500 text-sm mt-1">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  modelValue: false
})

const emit = defineEmits<Emits>()

const inputId = `checkbox-input-${Math.random().toString(36).substr(2, 9)}`

const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
