<template>
  <div>
    <form class="form">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <InputText id="name" v-model="body.name" />
        <span class="p-error">{{ getError("name") }}</span>
      </div>
      <div class="form-group">
        <label for="joinDate">Fecha de ingreso:</label>
        <Calendar date-format="yy-mm-dd" v-model="body.joinDate" showIcon iconDisplay="input" />
        <span class="p-error">{{ getError("joinDate") }}</span>
      </div>
      <div class="form-group">
        <label for="dayToPay">Días de pago:</label>
        <InputNumber v-model="body.dayToPay" showButtons :min="1" :max="30" />
        <span class="p-error">{{ getError("dayToPay") }}</span>
      </div>
      <div class="form-group">
        <label for="rooms">Cuartos:</label>
        <MultiSelect id="rooms" style="width: 20rem;" display="comma" :selectAll="false" :showToggleAll="false"
          v-model="body.rooms" :options="selectRooms" :maxSelectedLabels="2"
          :selectedItemsLabel="`${body.rooms.length} cuartos seleccionados`" optionLabel="label" optionValue="value" />
        <span class="p-error">{{ getError("rooms") }}</span>
      </div>
      <div class="form-group">
        <label for="debt">Deuda:</label>
        <InputNumber input-id="debt" showButtons v-model="body.debt" mode="decimal" :min-fraction-digits="2"
          :max-fraction-digits="2" />
      </div>

      <Button type="submit" @click.prevent="onSubmit" label="Enviar" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { tenantFormSchema } from '~/schemas';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['send'])
const body = ref<{
  name: string,
  dayToPay: number | null,
  joinDate: Date,
  rooms: number[],
  debt: number | null
}>({
  name: '',
  dayToPay: null,
  joinDate: new Date(),
  rooms: [],
  debt: null
})
const roomsOptions = ref<{ label: string, value: number, isAvailable: boolean }[]>([])

// Room options to select only available
// in case of update we get the rooms from the body (tenant selected)
const selectRooms = computed((() => {
  return roomsOptions.value.filter((room) => {
    return room.isAvailable || body.value.rooms.includes(room.value)
  })
}))

onMounted(() => {
  const { bodyData, extraData } = dialogRef?.value.data
  if (bodyData) {
    body.value = {
      ...bodyData,
      rooms: bodyData.rooms.map((room: { id: number, code: string }) => room.id),
      joinDate: new Date(bodyData.joinDate)
    }
  }
  console.log(body.value)
  roomsOptions.value = extraData.roomsOpt
})

const { validate, errors, isValid, clearErrors, getError } = useValidation(
  tenantFormSchema, body, {
  mode: 'lazy',
});

const onSubmit = async () => {
  await validate()

  if (isValid.value) {
    emits('send', body.value)
  }
}


</script>