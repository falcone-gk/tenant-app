<template>
  <div>
    <div>
      <h1>Servicios</h1>
    </div>
    <div class="filters">
      <div class="form-group">
        <label for="tenant">Inquilino:</label>
        <Dropdown id="tenant" v-model="filterTenant" :options="optionsData.tenantOpts ? optionsData.tenantOpts : []"
          option-label="label" option-value="value" show-clear />
      </div>
      <div class="form-group">
        <label for="service">Servicio:</label>
        <Dropdown id="service" v-model="filterService" :options="optionsData.serviceOpts ? optionsData.serviceOpts : []"
          option-label="label" option-value="value" show-clear />
      </div>
      <div class="form-group">
        <label for="startDate">Inicio de Fecha</label>
        <Calendar id="startDate" v-model="startDate" dateFormat="yy-mm-dd" show-icon />
      </div>
      <div class="form-group">
        <label for="endDate">Fin de fecha</label>
        <Calendar id="endDate" v-model="endDate" dateFormat="yy-mm-dd" show-icon />
      </div>
      <div class="form-group">
        <label for="isPaid">Estado</label>
        <Dropdown id="isPaid" v-model="filterIsPaid" :options="isPaidOpts" option-label="label" option-value="value" />
      </div>
    </div>
    <div style="display: flex; gap: 1rem; flex-direction: column;">
      <div>
        <div>
          <h2>Pago de servicios (inquilinos)</h2>
        </div>
        <div>
          <DataCrud title="Servicios (inquilinos)" :data="payments ? payments.data : []"
            :data-table="paymentsDataTable || []" api-route="/api/tenants/payments" @on-success="refreshPayments"
            :columns="servicesColumns" :form="markRaw(Payment)" :extra="optionsData" :loading="loadingPayments" />
        </div>
      </div>
      <div>
        <div>
          <h2>Pago de servicios (casa)</h2>
        </div>
        <div>
          <DataCrud title="Servicios (casa)" :data="totalPayments ? totalPayments.data : []"
            :data-table="totalPaymentsDataTable || []" api-route="/api/services/payments"
            @on-success="refreshTotalPayments" :columns="totalPaymentsColumns" :form="markRaw(TotalPayment)"
            :extra="optionsData.serviceOpts" :loading="loadingTotalPayments" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TotalPaymentData, PaymentData } from '~/types/admin'
const Payment = defineAsyncComponent(() => import('~/components/dialog/Payment.vue'))
const TotalPayment = defineAsyncComponent(() => import('~/components/dialog/TotalPayment.vue'))

definePageMeta({
  middleware: 'auth'
})

const nuxtApp = useNuxtApp()
type PaymentResponse = ApiResponse<PaymentData[]>

const filterTenant = ref(null)
const filterService = ref(null)
const filterIsPaid = ref(false)
const isPaidOpts = [
  { label: 'Pagado', value: true },
  { label: 'No pagado', value: false }
]

const today = ref(new Date())
const startDate = ref(new Date(today.value.getFullYear(), today.value.getMonth() - 1, 1))
const endDate = ref(new Date(today.value.getFullYear(), today.value.getMonth() + 1, 0))
const filterStartDate = computed(() => {
  return startDate.value.toLocaleDateString()
})
const filterEndDate = computed(() => {
  return endDate.value.toLocaleDateString()
})

const servicesColumns = {
  tenant: 'Inquilino',
  room: 'Cuarto',
  amount: 'Monto a pagar',
  service: 'Servicio',
  consume: 'Consumo',
  dateToPay: 'Fecha a pagar',
  amountPaid: 'Monto pagado',
  lastDatePaid: 'Ultimo dia pagado',
  isPaid: 'Pagado completado',
}
const { data: payments, pending: loadingPayments, refresh: refreshPayments } = await useLazyApiFetch<PaymentResponse>(
  '/api/tenants/payments', {
  server: false,
  query: {
    startDate: filterStartDate,
    endDate: filterEndDate,
    tenantId: filterTenant,
    serviceId: filterService,
    isPaid: filterIsPaid,
  },
  watch: [filterTenant, filterService, filterStartDate, filterEndDate, filterIsPaid]
})

const { data: options } = await useLazyAsyncData('options', async () => {
  const [tenants, rooms, services] = await Promise.all([
    $fetch('/api/tenants'),
    $fetch('/api/rooms'),
    $fetch('/api/services')
  ])

  const tenantOpts = tenants.data?.map((tenant) => ({
    value: tenant.id,
    label: tenant.name
  }))

  const roomOpts = rooms.data?.map((room) => ({
    value: room.id,
    label: room.code,
    recordLight: room.recordLight,
    recordWater: room.recordWater
  }))

  const serviceOpts = services.data?.map((service) => ({
    value: service.id,
    label: service.name
  }))

  return { tenants, tenantOpts, roomOpts, serviceOpts }
}, {
  server: false,
  getCachedData: (key) => {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
})

const optionsData = computed(() => {
  return {
    tenants: options.value?.tenants.data,
    tenantOpts: options.value?.tenantOpts,
    roomOpts: options.value?.roomOpts,
    serviceOpts: options.value?.serviceOpts
  }
})

const paymentsDataTable = computed(() => {
  if (!payments.value) return []
  if (!payments.value.data) return []

  return payments.value.data.map((payment) => ({
    ...payment,
    tenant: payment.tenant.name,
    room: payment.room.code,
    service: payment.service.name,
    amount: formatCurrency(payment.amount),
    amountPaid: formatCurrency(payment.amountPaid),
    dateToPay: calendarFormat(new Date(payment.dateToPay)),
    lastDatePaid: payment.lastDatePaid ? calendarFormat(new Date(payment.lastDatePaid)) : '-',
    consume: payment.consume ? payment.consume + ' ' + payment.service.unit : '-',
    isPaid: payment.isPaid ? 'Si' : 'No'
  }))
})

// Obtenemos como fecha el primer dia del mes del startDate y
// el ultimo dia del mes del endDate
const startDateInitalDay = computed(() => {
  return new Date(startDate.value.getFullYear(), today.value.getMonth(), 1).toLocaleDateString()
})
const endDateLastDay = computed(() => {
  return new Date(endDate.value.getFullYear(), today.value.getMonth() + 1, 0).toLocaleDateString()
})

type TotalPaymentResponse = ApiResponse<TotalPaymentData[]>
const { data: totalPayments, pending: loadingTotalPayments, refresh: refreshTotalPayments } = await useLazyApiFetch<TotalPaymentResponse>(
  '/api/services/payments', {
  server: false,
  query: {
    startDate: startDateInitalDay,
    endDate: endDateLastDay,
    tenantId: filterTenant,
    serviceId: filterService,
    isPaid: filterIsPaid,
  },
  watch: [filterTenant, filterService, filterStartDate, filterEndDate, filterIsPaid]
})

const totalPaymentsColumns = {
  service: 'Servicio',
  date: 'Fecha de registro',
  amount: 'Monto',
  consume: 'Consumo',
  outageDate: 'Fecha de corte',
  isPaid: 'Pago completado',
}

const totalPaymentsDataTable = computed(() => {
  if (!totalPayments.value) return []
  if (!totalPayments.value.data) return []

  return totalPayments.value.data.map((payment) => ({
    ...payment,
    service: payment.service.name,
    date: yearMonthFormat(new Date(payment.registerDate)),
    amount: formatCurrency(payment.amount),
    consume: payment.consume ? payment.consume + ' ' + payment.service.unit : '-',
    outageDate: payment.outageDate ? calendarFormat(new Date(payment.outageDate)) : '-',
    isPaid: payment.isPaid ? 'Si' : 'No'
  }))
})

</script>

<style scoped>
.filters {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  margin-bottom: 1rem;
}
</style>
