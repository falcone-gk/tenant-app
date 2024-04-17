<template>
  <div>
    <form class="form">
      <div class="form-group">
        <label for="service">Servicio:</label>
        <Dropdown id="service" v-model="body.serviceId" showClear :options="serviceOpts" option-label="label"
          option-value="value" />
        <span class="p-error">{{ getError("serviceId") }}</span>
      </div>
      <div class="form-group">
        <label for="dateToPay">Fecha de registro:</label>
        <Calendar view="month" date-format="yy-mm" v-model="body.registerDate" showIcon iconDisplay="input" />
        <span class="p-error">{{ getError("registerDate") }}</span>
      </div>
      <div class="form-group">
        <label for="amount">Monto:</label>
        <InputNumber id="amount" v-model="body.amount" mode="currency" currency="PEN" showButtons :min="1" />
        <span class="p-error">{{ getError("amount") }}</span>
      </div>
      <div v-if="selectedServiceName === 'Luz' || selectedServiceName === 'Agua'" class="form-group">
        <label for="consume">Consumo ({{ selectedServiceName === 'Luz' ? 'kW' : 'm3' }}) :</label>
        <InputNumber id="consume" v-model="body.consume" mode="decimal" :min-fraction-digits="2"
          :max-fraction-digits="2" showButtons :min="1" />
        <span class="p-error">{{ getError("consume") }}</span>
      </div>
      <div class="form-group">
        <label for="outageDate">Fecha de corte:</label>
        <Calendar date-format="yy-mm-dd" v-model="body.outageDate" showIcon iconDisplay="input" />
        <span class="p-error">{{ getError("outageDate") }}</span>
      </div>
      <div class="row">
        <label for="isPaid">Pago Completado:</label>
        <div class="row">
          <span :class="!body.isPaid ? classes.selected : ''">No</span>
          <InputSwitch id="isPaid" v-model="body.isPaid" />
          <span :class="body.isPaid ? classes.selected : ''">Si</span>
        </div>
      </div>
      <Button type="submit" @click.prevent="onSubmit" label="Enviar" />
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

const { validate, errors, isValid, clearErrors, getError } = useValidation(
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
  const { bodyData, extraData, method } = dialogRef?.value.data
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