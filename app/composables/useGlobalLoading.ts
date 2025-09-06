export const useGlobalLoading = () => {
  const isVisible = ref(false)
  const title = ref('Processando...')
  const message = ref('Aguarde enquanto processamos sua solicitação')

  const show = (customTitle?: string, customMessage?: string) => {
    title.value = customTitle || 'Processando...'
    message.value = customMessage || 'Aguarde enquanto processamos sua solicitação'
    isVisible.value = true
  }

  const hide = () => {
    isVisible.value = false
  }

  const showCreating = () => {
    show('Criando Customer', 'Salvando os dados do novo customer...')
  }

  const showUpdating = () => {
    show('Atualizando Customer', 'Atualizando os dados do customer...')
  }

  const showDeleting = () => {
    show('Excluindo Customer', 'Removendo o customer do sistema...')
  }

  return {
    isVisible: readonly(isVisible),
    title: readonly(title),
    message: readonly(message),
    show,
    hide,
    showCreating,
    showUpdating,
    showDeleting
  }
}
