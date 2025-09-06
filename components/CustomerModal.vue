<template>
  <BaseModal
    v-model="isOpen"
    :title="isEditing ? 'Editar Customer' : 'Novo Customer'"
    size="lg"
    :persistent="formChanged && !saving"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Nome -->
      <BaseInput
        v-model="form.nome"
        label="Nome completo"
        type="text"
        placeholder="Digite o nome completo"
        required
        :error="errors.nome"
        hint="Entre 2 e 100 caracteres, apenas letras e espaços"
      />

      <!-- CPF -->
      <CPFInput
        v-model="form.cpf"
        label="CPF"
        required
        :error="errors.cpf"
        hint="Formato: 000.000.000-00"
      />

      <!-- Email -->
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="exemplo@email.com"
        required
        :error="errors.email"
        hint="Email válido com no máximo 150 caracteres"
      />

      <!-- Telefone -->
      <PhoneInput
        v-model="form.telefone"
        label="Telefone"
        required
        :error="errors.telefone"
        hint="Formato: (00) 00000-0000"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Idade -->
        <BaseInput
          v-model="form.idade"
          label="Idade"
          type="number"
          min="1"
          max="120"
          required
          :error="errors.idade"
          hint="Entre 1 e 120 anos"
        />

        <!-- Data de Nascimento -->
        <BaseInput
          v-model="form.dataNascimento"
          label="Data de nascimento"
          type="date"
          :max="maxDate"
          required
          :error="errors.dataNascimento"
          hint="Data não pode ser no futuro"
        />
      </div>

      <!-- Salário -->
      <CurrencyInput
        v-model="form.salario"
        label="Salário"
        required
        :error="errors.salario"
        hint="Valor em reais, máximo R$ 1.000.000,00"
      />

      <!-- Status Ativo -->
      <CheckboxInput
        v-model="form.ativo"
        label="Customer ativo"
        :error="errors.ativo"
        hint="Customers ativos aparecerão nas listagens principais"
      />

      <!-- Observações -->
      <TextareaInput
        v-model="form.observacoes"
        label="Observações"
        placeholder="Informações adicionais sobre o customer..."
        :maxlength="500"
        rows="4"
        :error="errors.observacoes"
        hint="Máximo 500 caracteres (opcional)"
      />
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton
          variant="outline"
          @click="handleCancel"
          :disabled="saving"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="saving"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Atualizar' : 'Criar' }} Customer
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer'
import { customerSchema, createCustomerSchema, updateCustomerSchema } from '~/types/customer'
import type { Customer, CreateCustomer, UpdateCustomer } from '~/types/customer'
import { formatDateForInput, parseInputDate, capitalizeWords } from '~/utils/formatters'

interface Props {
  modelValue: boolean
  customer?: Customer | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Store
const customerStore = useCustomerStore()

// Estado reativo
const saving = ref(false)
const errors = ref<Record<string, string>>({})

// Form data
const initialForm = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  idade: 18,
  dataNascimento: '',
  salario: 0,
  ativo: true,
  observacoes: ''
}

const form = ref<typeof initialForm>({ ...initialForm })
const originalForm = ref<typeof initialForm>({ ...initialForm })

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!props.customer)

const formChanged = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
})

const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Watchers
watch(() => props.customer, (customer) => {
  if (customer) {
    // Modo edição
    form.value = {
      nome: customer.nome,
      cpf: customer.cpf,
      email: customer.email,
      telefone: customer.telefone,
      idade: customer.idade,
      dataNascimento: formatDateForInput(customer.dataNascimento),
      salario: customer.salario,
      ativo: customer.ativo,
      observacoes: customer.observacoes || ''
    }
  } else {
    // Modo criação
    form.value = { ...initialForm }
  }
  
  originalForm.value = { ...form.value }
  clearErrors()
}, { immediate: true })

// Limpar erros quando modal abre
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    clearErrors()
  }
})

// Auto-capitalizar nome
watch(() => form.value.nome, (newName) => {
  if (newName) {
    const capitalized = capitalizeWords(newName)
    if (capitalized !== newName) {
      form.value.nome = capitalized
    }
  }
})

// Métodos
const clearErrors = () => {
  errors.value = {}
}

const validateForm = (): boolean => {
  clearErrors()

  try {
    const formData = {
      ...form.value,
      dataNascimento: form.value.dataNascimento
    }

    if (isEditing.value) {
      updateCustomerSchema.parse({
        ...formData,
        id: props.customer!.id
      })
    } else {
      createCustomerSchema.parse(formData)
    }

    return true
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        errors.value[err.path[0]] = err.message
      })
    }
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    const formData = {
      ...form.value,
      dataNascimento: form.value.dataNascimento
    }

    if (isEditing.value) {
      // Atualizar customer existente
      await customerStore.updateCustomer(props.customer!.id!, formData as UpdateCustomer)
      
      // Mostrar notificação de sucesso
      showNotification('Customer atualizado com sucesso!', 'success')
    } else {
      // Criar novo customer
      await customerStore.createCustomer(formData as CreateCustomer)
      
      // Mostrar notificação de sucesso
      showNotification('Customer criado com sucesso!', 'success')
    }

    // Fechar modal e notificar componente pai
    emit('saved')
    
  } catch (error: any) {
    console.error('Erro ao salvar customer:', error)
    
    // Tratamento de erros específicos
    if (error.message.includes('CPF já cadastrado')) {
      errors.value.cpf = 'Este CPF já está cadastrado'
    } else if (error.message.includes('Email já cadastrado')) {
      errors.value.email = 'Este email já está cadastrado'
    } else {
      showNotification(
        error.message || 'Erro ao salvar customer. Tente novamente.',
        'error'
      )
    }
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  if (formChanged.value && !saving.value) {
    const confirmed = confirm(
      'Você tem alterações não salvas. Tem certeza que deseja cancelar?'
    )
    
    if (!confirmed) {
      return
    }
  }

  isOpen.value = false
}

// Notificação simples (pode ser substituída por uma lib de notificação)
const showNotification = (message: string, type: 'success' | 'error') => {
  // Por enquanto, usar alert simples
  // Em produção, usar uma biblioteca como vue-toastification
  if (type === 'success') {
    console.log('✅', message)
  } else {
    console.error('❌', message)
  }
}

// Resetar form quando modal fecha
watch(isOpen, (open) => {
  if (!open) {
    // Pequeno delay para evitar flicker na UI
    setTimeout(() => {
      form.value = { ...initialForm }
      originalForm.value = { ...initialForm }
      clearErrors()
    }, 300)
  }
})
</script>
