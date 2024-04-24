<template>
  <div>
    <form class="form">
      <div class="form-group">
        <label for="tenant">Inquilino:</label>
        <Dropdown id="tenant" v-model="body.tenantId" show-clear :options="options.tenantOpts" option-label="label"
          option-value="value" :disabled="apiMethod === 'update'" @change="onChangeTenant" />
        <span class="p-error">{{ getError("tenantId") }}</span>
      </div>
      <div class="form-group">
        <label for="room">Cuarto:</label>
        <Dropdown id="room" v-model="body.roomId" show-clear :options="roomAvailables" option-label="label"
          option-value="value" />
        <span class="p-error">{{ getError("roomId") }}</span>
      </div>
      <div class="form-group">
        <label for="service">Servicio:</label>
        <Dropdown id="service" v-model="body.serviceId" show-clear :options="options.serviceOpts" option-label="label"
          option-value="value" :disabled="apiMethod === 'update'" />
        <span class="p-error">{{ getError("serviceId") }}</span>
      </div>
      <div class="form-group">
        <label for="dateToPay">Fecha a pagar:</label>
        <Calendar v-model="body.dateToPay" date-format="yy-mm-dd" show-icon icon-display="input"
          :disabled="body.tenantId === null" />
      </div>
      <div class="form-group">
        <label for="amount">Monto:</label>
        <InputNumber id="amount" v-model="body.amount" mode="currency" currency="PEN" show-buttons
          :min="body.amountPaid || 1" />
        <span class="p-error">{{ getError("amount") }}</span>
      </div>
      <div v-if="selectedServiceName === 'Luz' || selectedServiceName === 'Agua'" class="form-group">
        <label for="consume">Consumo ({{ selectedServiceName === 'Luz' ? 'kw' : 'm3' }}) :</label>
        <InputNumber id="consume" v-model="body.consume" show-buttons :min="1" />
        <span class="p-error">{{ getError("consume") }}</span>
      </div>
      <div v-if="selectedServiceName === 'Luz'" class="form-group">
        <label for="recordLight">Última lectura de luz (kw)</label>
        <InputNumber v-model="finalLightRecord" input-id="recordLight" show-buttons disabled />
      </div>
      <div v-if="selectedServiceName === 'Agua'" class="form-group">
        <label for="recordWater">Última lectura de agua (m3)</label>
        <InputNumber v-model="finalWaterRecord" input-id="recordWater" show-buttons disabled />
      </div>
      <div class="form-group">
        <label for="amountPaid">Monto Pagado:</label>
        <InputNumber id="amountPaid" v-model="body.amountPaid" mode="currency" currency="PEN" show-buttons :min="0"
          :max="body.amount!" disabled @update:model-value="onChangeMountPaid" />
        <span class="p-error">{{ getError("amountPaid") }}</span>
      </div>
      <div class="form-group">
        <label for="lastDatePaid">Fecha de último pago:</label>
        <Calendar v-model="body.lastDatePaid" date-format="yy-mm-dd" show-icon icon-display="input" disabled />
      </div>
      <Button type="submit" label="Enviar" @click.prevent="onSubmit" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { paymentSchema } from '~/schemas';
import type { TenantData } from '~/types/admin';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['submit'])
const body = ref<{
  tenantId: number | null,
  roomId: number | null,
  serviceId: number | null,
  amount: number | null,
  consume: number | null,
  dateToPay: Date | null,
  amountPaid: number,
  lastDatePaid: Date | null,
  isPaid: boolean
}>({
  tenantId: null,
  roomId: null,
  serviceId: null,
  amount: null,
  consume: null,
  dateToPay: null,
  amountPaid: 0,
  lastDatePaid: null,
  isPaid: false
})
const options = ref<{
  tenants: TenantData[],
  tenantOpts: { value: number, label: string }[],
  roomOpts: { value: number, label: string, recordLight: number, recordWater: number }[],
  serviceOpts: { value: number, label: string }[]
}>({
  tenants: [],
  tenantOpts: [],
  roomOpts: [],
  serviceOpts: []
})

const lastPaidAmount = ref(0)
const initialConsume = ref(0)

const apiMethod = ref<'create' | 'update'>()

const roomAvailables = computed(() => {
  if (body.value.tenantId) {
    const tenant = options.value.tenants.find((tenant) => tenant.id === body.value.tenantId)
    if (tenant) {
      return tenant.rooms.map((room) => ({ value: room.id, label: room.code }))
    }
  }
  return []
})

const selectedServiceName = computed(() => {
  if (body.value.serviceId) {
    const service = find(options.value.serviceOpts, service => service.value === body.value.serviceId)
    if (service) return service.label
    return ''
  }
  return ''
})

const finalLightRecord = computed(() => {
  const recordLight = find(
    options.value.roomOpts, room => room.value === body.value.roomId
  )?.recordLight || 0
  return recordLight - initialConsume.value + (body.value.consume || 0)
})

const finalWaterRecord = computed(() => {
  const recordWater = find(
    options.value.roomOpts, room => room.value === body.value.roomId
  )?.recordWater || 0
  return recordWater - initialConsume.value + (body.value.consume || 0)
})

const onChangeTenant = () => {
  if (!body.value.tenantId) return null
  const currentTenant = find(options.value.tenants, tenant => tenant.id === body.value.tenantId)
  if (!currentTenant) return null

  const date = new Date()
  body.value.dateToPay = (
    new Date(date.getFullYear(), date.getMonth(), currentTenant.dayToPay)
  );
  body.value.roomId = null
  body.value.consume = null
}

const { validate, isValid, getError } = useValidation(
  paymentSchema, body, {
  mode: 'lazy',
});

const onSubmit = async () => {
  await validate()
  if (isValid.value) {
    console.log(body.value)
    emits('submit', body.value)
  }
}

const onChangeMountPaid = () => {
  if (body.value.amountPaid === 0) {
    body.value.lastDatePaid = null
  }

  if (body.value.amountPaid > lastPaidAmount.value) {
    body.value.lastDatePaid = new Date()
  }
}

onMounted(() => {
  const { bodyData, extraData, method } = dialogRef!.value.data
  if (bodyData) {
    body.value = {
      ...bodyData,
      dateToPay: new Date(bodyData.dateToPay),
      lastDatePaid: bodyData.lastDatePaid ? new Date(bodyData.lastDatePaid) : null
    }
  }
  lastPaidAmount.value = body.value.amountPaid
  initialConsume.value = body.value.consume || 0

  if (extraData) {
    options.value = extraData
  }
  apiMethod.value = method
})
</script>