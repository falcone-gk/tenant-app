<template>
  <div>
    <div>
      <h1>Pago de servicios</h1>
    </div>
    <div>
      <LoadingScreen v-if="status !== 'success'" :status="status" />
      <div v-else>
        <DataCrud title="Servicios" :data="payments ? payments.data : []" :data-table="paymentsDataTable"
          api-route="/api/services/payments" @on-success="refresh" :columns="servicesColumns" :form="markRaw(Service)"
          :extra="optionsData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PaymentData } from '~/types/admin'
const Service = defineAsyncComponent(() => import('~/components/dialog/Service.vue'))

definePageMeta({
  middleware: 'auth'
})

type PaymentResponse = ApiResponse<PaymentData[]>

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
const { data: payments, status, refresh } = await useLazyFetch<PaymentResponse>('/api/services/payments', {
  server: false,
  query: {
    page: 1,
    limit: 10
  }
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