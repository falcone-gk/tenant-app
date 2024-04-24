<template>
  <div class="dialog">
    <TabMenu :model="items" />
    <DialogFormPayment v-if="active === 0" @submit="onSubmit" />
    <DialogFormAmountPaid v-else @submit="onCustomSubmit" />
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['send', 'customSend'])
const active = ref(0)
const apiMethod = ref<'create' | 'update'>()
const items = ref([
  {
    label: () => apiMethod.value === 'create' ? 'Crear' : 'Editar',
    command: () => { active.value = 0 }
  },
  {
    label: 'Pagar',
    command: () => { active.value = 1 },
    disabled: () => apiMethod.value === 'create'
  },
])

const onSubmit = (body: any) => {
  emits('send', body)
}

const onCustomSubmit = (status: 'success' | 'error' | 'idle') => {
  emits('customSend', status)
}

onMounted(() => {
  const { method } = dialogRef!.value.data
  apiMethod.value = method
})

</script>
<style scoped>
.dialog {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
</style>