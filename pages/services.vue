<template>
  <div>
    <div>
      <h1>Pago de servicios</h1>
    </div>
    <div>
      <div class="row">
        <div class="form-group">
          <label for="tenant">Inquilino:</label>
          <Dropdown id="tenant" v-model="filterTenant" :options="optionsData.tenantOpts ? optionsData.tenantOpts : []"
            option-label="label" option-value="value" show-clear />
        </div>
        <div class="form-group">
          <label for="service">Servicio:</label>
          <Dropdown id="service" v-model="filterService"
            :options="optionsData.serviceOpts ? optionsData.serviceOpts : []" option-label="label" option-value="value"
            show-clear />
        </div>
        <div class="form-group">
          <label for="startDate">Inicio de Fecha</label>
          <Calendar id="startDate" v-model="startDate" dateFormat="yy-mm-dd" show-icon />
        </div>
        <div class="form-group">
          <label for="endDate">Fin de fecha</label>
          <Calendar id="endDate" v-model="endDate" dateFormat="yy-mm-dd" show-icon />
        </div>
      </div>
      <div>
        <DataCrud title="Servicios" :data="payments ? payments.data : []" :data-table="paymentsDataTable || []"
          api-route="/api/services/payments" @on-success="refresh" :columns="servicesColumns" :form="markRaw(Payment)"
          :extra="optionsData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PaymentData } from '~/types/admin'
const Payment = defineAsyncComponent(() => import('~/components/dialog/Payment.vue'))

definePageMeta({
  middleware: 'auth'
})

type PaymentResponse = ApiResponse<PaymentData[]>

const filterTenant = ref(null)
const filterService = ref(null)

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
  amount: 'Monto',
  service: 'Servicio',
  consume: 'Consumo',
  dateToPay: 'Fecha a pagar',
  paidMount: 'Monto pagado',
  lastDatePaid: 'Ultimo dia pagado',
  isPaid: 'Pagado completado',
}
const { data: payments, status, refresh } = await useFetch<PaymentResponse>('/api/services/payments', {
  query: {
    startDate: filterStartDate,
    endDate: filterEndDate,
    tenantId: filterTenant,
    serviceId: filterService,
  },
  watch: [filterTenant, filterService, filterStartDate, filterEndDate]
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
    label: room.code
  }))

  const serviceOpts = services.data?.map((service) => ({
    value: service.id,
    label: service.name
  }))

  return { tenants, tenantOpts, roomOpts, serviceOpts }
}, {
  server: false
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
    amount: 'S/.' + payment.amount,
    paidMount: 'S/.' + payment.paidMount,
    dateToPay: calendarFormat(new Date(payment.dateToPay)),
    lastDatePaid: payment.lastDatePaid ? calendarFormat(new Date(payment.lastDatePaid)) : '-',
    consume: payment.consume ? payment.consume + ' ' + payment.service.unit : '-',
    isPaid: payment.isPaid ? 'Si' : 'No'
  }))
})
</script>