<template>
  <div>
    <form id="form">
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
          v-model="body.rooms" :options="roomsOptions" :maxSelectedLabels="2"
          :selectedItemsLabel="`${body.rooms.length} cuartos seleccionados`" optionLabel="label" optionValue="value" />
        <span class="p-error">{{ getError("rooms") }}</span>
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
const body = ref({
  name: '',
  dayToPay: null,
  joinDate: new Date(),
  rooms: []
})
const roomsOptions = ref([])

onMounted(() => {
  const { bodyData, extraData } = dialogRef?.value.data
  if (bodyData) {
    body.value = {
      ...bodyData,
      rooms: bodyData.rooms.map((room: { id: number, code: string }) => room.id),
      joinDate: new Date(bodyData.joinDate)
    }
  }
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