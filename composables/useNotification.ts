export const useNotification = () => {
  const toast = useToast()

  const showNotification = (status: 'success' | 'error') => {
    if (status === 'success') {
      toast.add({ severity: 'success', summary: 'Exito', detail: 'Operación exitosa', group: 'notification', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar la operación', group: 'notification', life: 3000 })
    }
  }
  return { showNotification }
}