<template>
  <div>
    <div>
      <h3>Información de pago de servicio:</h3>
      <p>
        <strong>Inquilino:</strong> {{ body.tenant.name }} <br>
        <strong>Servicio:</strong> {{ body.service.name }}
      </p>
    </div>
    <form class="form">
      <div class="form-group">
        <label for="amount">Monto:</label>
        <InputNumber id="amount" mode="currency" currency="PEN" v-model="body.amount" showButtons :min="0" disabled />
      </div>
      <div class="form-group">
        <label for="amountPaid">Monto Pagado:</label>
        <InputNumber id="amountPaid" mode="currency" currency="PEN" v-model="body.amountPaid" showButtons :min="0"
          :max="body.amount!" disabled />
      </div>
      <div class="form-group">
        <label for="newPayment">Pago agregado:</label>
        <InputNumber id="newPayment" mode="currency" currency="PEN" v-model="body.newPayment" showButtons
          :min="-body.amountPaid!" :max="body.amount! - body.amountPaid!" />
        <span class="p-error">{{ getError("newPayment") }}</span>
      </div>
      <Button type="submit" @click.prevent="onSubmit" label="Enviar" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { addPaySchema } from '~/schemas';

const emits = defineEmits(['submit'])
const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const toast = useToast()

const body = ref<{
  tenant: { id: number, name: string },
  service: { id: number, name: string, unit: string },
  amount: number | null,
  amountPaid: number | null,
  newPayment: number,
}>({
  tenant: { id: 0, name: '' },
  service: { id: 0, name: '', unit: '' },
  amount: null,
  amountPaid: null,
  newPayment: 0
})

const paymentId = ref(0)

const { status, error: payError, execute } = await useFetch(
  () => `/api/tenants/payments/pay/${paymentId.value}`, {
  method: 'POST',
  body: body,
  server: false,
  immediate: false,
  watch: false
})

const { validate, errors, isValid, clearErrors, getError } = useValidation(
  addPaySchema, body, {
  mode: 'lazy',
});

const onSubmit = async () => {
  await validate()
  if (isValid.value) {
    await execute()
    if (status.value === 'success') {
      emits('submit', status.value)
    } else {
      console.log(payError.value)
    }
  }
}

onMounted(() => {
  const { bodyData, selectedRowId } = dialogRef?.value.data
  if (bodyData) {
    body.value = {
      ...body.value,
      tenant: bodyData.tenant,
      service: bodyData.service,
      amount: bodyData.amount,
      amountPaid: bodyData.amountPaid
    }
  }
  paymentId.value = selectedRowId
})
</script>