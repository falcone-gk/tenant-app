<template>
  <div>
    <form id="form">
      <div class="form-group">
        <label for="tenant">Inquilino:</label>
        <Dropdown id="tenant" v-model="body.tenantId" showClear :options="options.tenantOpts" option-label="label"
          option-value="value" @change="onChangeTenant" :disabled="apiMethod === 'update'" />
        <span class="p-error">{{ getError("tenantId") }}</span>
      </div>
      <div class="form-group">
        <label for="room">Cuarto:</label>
        <Dropdown id="room" v-model="body.roomId" showClear :options="roomAvailables" option-label="label"
          option-value="value" />
        <span class="p-error">{{ getError("roomId") }}</span>
      </div>
      <div class="form-group">
        <label for="service">Servicio:</label>
        <Dropdown id="service" v-model="body.serviceId" showClear :options="options.serviceOpts" option-label="label"
          option-value="value" :disabled="apiMethod === 'update'" />
        <span class="p-error">{{ getError("serviceId") }}</span>
      </div>
      <div class="form-group">
        <label for="dateToPay">Fecha a pagar:</label>
        <Calendar date-format="yy-mm-dd" v-model="body.dateToPay" showIcon iconDisplay="input"
          :disabled="body.tenantId === null" />
      </div>
      <div class="form-group">
        <label for="amount">Monto:</label>
        <InputNumber id="amount" v-model="body.amount" showButtons :min="1" />
        <span class="p-error">{{ getError("amount") }}</span>
      </div>
      <div v-if="selectedServiceName === 'Luz' || selectedServiceName === 'Agua'" class="form-group">
        <label for="consume">Consumo ({{ selectedServiceName === 'Luz' ? 'kW' : 'm3' }}) :</label>
        <InputNumber id="consume" v-model="body.consume" showButtons :min="1" />
        <span class="p-error">{{ getError("consume") }}</span>
      </div>
      <div class="form-group">
        <label for="amountPaid">Monto Pagado:</label>
        <InputNumber id="amountPaid" v-model="body.paidMount" showButtons :min="0" :max="body.amount!"
          :disabled="body.amount === null" @update:model-value="onChangeMountPaid" />
        <span class="p-error">{{ getError("paidMount") }}</span>
      </div>
      <div class="form-group">
        <label for="lastDatePaid">Fecha de último pago:</label>
        <Calendar date-format="yy-mm-dd" v-model="body.lastDatePaid" showIcon iconDisplay="input" />
      </div>
      <Button type="submit" @click.prevent="onSubmit" label="Enviar" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { paymentSchema } from '~/schemas';
import type { TenantData } from '~/types/admin';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['send'])
const body = ref<{
  tenantId: number | null,
  roomId: number | null,
  serviceId: number | null,
  amount: number | null,
  consume: number | null,
  dateToPay: Date | null,
  paidMount: number,
  lastDatePaid: Date | null,
  isPaid: boolean
}>({
  tenantId: null,
  roomId: null,
  serviceId: null,
  amount: null,
  consume: null,
  dateToPay: null,
  paidMount: 0,
  lastDatePaid: null,
  isPaid: false
})
const options = ref<{
  tenants: TenantData[],
  tenantOpts: { value: number, label: string }[],
  roomOpts: { value: number, label: string }[],
  serviceOpts: { value: number, label: string }[]
}>({
  tenants: [],
  tenantOpts: [],
  roomOpts: [],
  serviceOpts: []
})

const lastPaidAmount = ref(0)

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
    const service = _find(options.value.serviceOpts, { value: body.value.serviceId })
    if (service) return service.label
    return ''
  }
  return ''
})

const onChangeTenant = () => {
  if (!body.value.tenantId) return null
  const currentTenant = _find(options.value.tenants, { id: body.value.tenantId })
  if (!currentTenant) return null

  const date = new Date()
  body.value.dateToPay = (
    new Date(date.getFullYear(), date.getMonth(), currentTenant.dayToPay)
  );
  body.value.roomId = null
  body.value.consume = null
}

const { validate, errors, isValid, clearErrors, getError } = useValidation(
  paymentSchema, body, {
  mode: 'lazy',
});

const onSubmit = async () => {
  await validate()
  if (isValid.value) {
    emits('send', body.value)
  }
}

const onChangeMountPaid = () => {
  if (body.value.paidMount === 0) {
    body.value.lastDatePaid = null
  }

  if (body.value.paidMount > lastPaidAmount.value) {
    body.value.lastDatePaid = new Date()
  }
}

onMounted(() => {
  const { bodyData, extraData, method } = dialogRef?.value.data
  if (bodyData) {
    body.value = {
      ...bodyData,
      dateToPay: new Date(bodyData.dateToPay),
      lastDatePaid: bodyData.lastDatePaid ? new Date(bodyData.lastDatePaid) : null
    }
  }
  lastPaidAmount.value = body.value.paidMount

  if (extraData) {
    options.value = extraData
  }
  apiMethod.value = method
})

</script>