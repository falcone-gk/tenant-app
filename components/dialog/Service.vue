<template>
  <div>
    <form id="form">
      <div class="form-group">
        <label for="tenant">Inquilino:</label>
        <Dropdown id="tenant" v-model="body.tenantId" showClear :options="options.tenantOpts" option-label="label"
          option-value="value" @change="onChangeTenant" />
      </div>
      <div class="form-group">
        <label for="room">Cuarto:</label>
        <Dropdown id="room" v-model="body.roomId" showClear :options="roomAvailables" option-label="label"
          option-value="value" />
      </div>
      <div class="form-group">
        <label for="service">Servicio:</label>
        <Dropdown id="service" v-model="body.serviceId" showClear :options="options.serviceOpts" option-label="label"
          option-value="value" />
      </div>
      <div class="form-group">
        <label for="amount">Monto:</label>
        <InputNumber id="amount" v-model="body.amount" showButtons :min="1" />
      </div>
      <div class="form-group">
        <label for="consume">Consumo:</label>
        <InputNumber id="consume" v-model="body.consume" showButtons :min="1" />
      </div>
      <div class="form-group">
        <label for="amountPaid">Monto Pagado:</label>
        <InputNumber id="amountPaid" v-model="body.paidMount" showButtons :min="0" :max="body.amount!"
          :disabled="body.amount === null" />
      </div>
      <Button type="submit" @click.prevent="onSubmit" label="Enviar" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import type { TenantData } from '~/types/admin';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['send'])
const body = ref({
  tenantId: null,
  roomId: null,
  serviceId: null,
  amount: null,
  consume: null,
  dateToPay: new Date(),
  paidMount: null,
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

const roomAvailables = computed(() => {
  if (body.value.tenantId) {
    const tenant = options.value.tenants.find((tenant) => tenant.id === body.value.tenantId)
    if (tenant) {
      return tenant.rooms.map((room) => ({ value: room.id, label: room.code }))
    }
  }
  return []
})

const onChangeTenant = () => {
  const currentTenant = options.value.tenants.find((tenant) => tenant.id === body.value.tenantId)
  if (!currentTenant) return ''
  // get current day to pay for tenant as Date
  const date = new Date()
  body.value.dateToPay = (
    new Date(date.getFullYear(), date.getMonth(), currentTenant.dayToPay)
  );
}

const onSubmit = () => {
  emits('send', body.value)
}

onMounted(() => {
  const { bodyData, extraData } = dialogRef?.value.data
  if (bodyData) {
    console.log(bodyData)
    body.value = bodyData
  }
  if (extraData) {
    options.value = extraData
  }
})

</script>