<template>
  <div>
    <form class="form">
      <div class="form-group">
        <label for="service">Servicio:</label>
        <Dropdown v-model="body.serviceId" input-id="service" show-clear :options="serviceOpts" option-label="label"
          option-value="value" />
        <span class="p-error">{{ getError("serviceId") }}</span>
      </div>
      <div class="form-group">
        <label for="dateToPay">Fecha de registro:</label>
        <Calendar v-model="body.registerDate" view="month" date-format="yy-mm" show-icon icon-display="input" />
        <span class="p-error">{{ getError("registerDate") }}</span>
      </div>
      <div class="form-group">
        <label for="amount">Monto:</label>
        <InputNumber v-model="body.amount" input-id="amount" mode="currency" currency="PEN" show-buttons :min="1" />
        <span class="p-error">{{ getError("amount") }}</span>
      </div>
      <div v-if="selectedServiceName === 'Luz' || selectedServiceName === 'Agua'" class="form-group">
        <label for="consume">Consumo ({{ selectedServiceName === 'Luz' ? 'kW' : 'm3' }}) :</label>
        <InputNumber v-model="body.consume" input-id="consume" mode="decimal" :min-fraction-digits="2"
          :max-fraction-digits="2" show-buttons :min="1" />
        <span class="p-error">{{ getError("consume") }}</span>
      </div>
      <div class="form-group">
        <label for="outageDate">Fecha de corte:</label>
        <Calendar v-model="body.outageDate" date-format="yy-mm-dd" show-icon icon-display="input" />
        <span class="p-error">{{ getError("outageDate") }}</span>
      </div>
      <div class="row">
        <label for="isPaid">Pago Completado:</label>
        <div class="row">
          <span :class="!body.isPaid ? classes.selected : ''">No</span>
          <InputSwitch v-model="body.isPaid" input-id="isPaid" />
          <span :class="body.isPaid ? classes.selected : ''">Si</span>
        </div>
      </div>
      <Button type="submit" label="Enviar" @click.prevent="onSubmit" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { totalPaymentSchema } from '~/schemas';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const emits = defineEmits(['send'])
const body = ref<{
  serviceId: number | null,
  registerDate: Date | null,
  amount: number | null,
  consume: number | null,
  outageDate: Date | null,
  isPaid: boolean
}>({
  serviceId: null,
  registerDate: null,
  amount: null,
  consume: null,
  outageDate: null,
  isPaid: false
})

const serviceOpts = ref<{ label: string, value: number }[]>([])
const selectedServiceName = computed(() => {
  if (body.value.serviceId) {
    const service = find(serviceOpts.value, service => service.value === body.value.serviceId)
    if (service) return service.label
    return ''
  }
  return ''
})

const { validate, isValid, getError } = useValidation(
  totalPaymentSchema, body, {
  mode: 'lazy',
});

const onSubmit = async () => {
  await validate()
  if (isValid.value) {
    emits('send', body.value)
  }
}

onMounted(() => {
  const { bodyData, extraData } = dialogRef!.value.data
  if (bodyData) {
    body.value = {
      ...bodyData,
      registerDate: new Date(bodyData.registerDate),
      outageDate: bodyData.outageDate ? new Date(bodyData.outageDate) : null
    }
  }

  if (extraData) {
    serviceOpts.value = extraData
  }
})
</script>

<style module="classes">
.selected {
  color: var(--primary-color);
  font-weight: bold;
}
</style>