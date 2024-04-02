<template>
  <div>
    <form id="form">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <InputText id="name" v-model="body.name" />
      </div>
      <div class="form-group">
        <label for="joinDate">Fecha de ingreso:</label>
        <Calendar v-model="body.joinDate" showIcon iconDisplay="input" />
      </div>
      <div class="form-group">
        <label for="dayToPay">Días de pago:</label>
        <InputNumber v-model="body.dayToPay" showButtons :min="1" :max="30" />
      </div>
      <div class="form-group">
        <label for="rooms">Cuartos:</label>
        <MultiSelect id="rooms" style="width: 20rem;" display="comma" :selectAll="false" :showToggleAll="false"
          v-model="body.rooms" :options="roomsOptions" :maxSelectedLabels="2"
          :selectedItemsLabel="`${body.rooms.length} cuartos seleccionados`" optionLabel="label" optionValue="value" />
      </div>

      <Button type="submit" @click.prevent="onSubmit" :label="dialogMethod === 'update' ? 'Actualizar' : 'Crear'" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import type { TenantData } from '~/types/admin';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['send'])
const body = ref<Omit<TenantData, 'id'>>({
  name: '',
  dayToPay: null,
  joinDate: new Date(),
  rooms: []
})
const roomsOptions = ref([])
const dialogMethod = ref<'create' | 'update'>()

const onSubmit = () => {
  emits('send', body.value, dialogRef?.value)
}

onMounted(() => {
  const { roomsOpt, method, ...bodyData } = dialogRef?.value.data
  body.value = {
    ...bodyData,
    rooms: bodyData.rooms.map((room: { id: number, code: string }) => room.id)
  }
  roomsOptions.value = roomsOpt
  dialogMethod.value = method
})

</script>