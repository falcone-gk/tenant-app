<template>
  <div>
    <div>
      <h1>Inquilinos</h1>
    </div>
    <div>
      <DataCrud title="Inquilinos" :data="tenants ? tenants.data : []" :data-table="tenantsDataTable"
        :columns="tenantColumns" api-route="/api/tenants" :form="markRaw(tenantForm)" :extra="{ roomsOpt: roomsOpt }"
        @on-success="refresh" :loading="pending" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TenantData, TenantDataTable, RoomData } from '~/types/admin';

const nuxtApp = useNuxtApp()
const tenantForm = defineAsyncComponent(() => import('~/components/dialog/Tenant.vue'))

definePageMeta({
  middleware: 'auth'
})

const tenantColumns = {
  name: 'Nombre',
  joinDate: 'Ingresó',
  rooms: 'Cuartos',
  dayToPay: 'Días de pago',
  debt: 'Deuda'
}

type TenantResponse = ApiResponse<TenantData[]>
type RoomResponse = ApiResponse<RoomData[]>

const { data: roomsOpt, pending } = await useLazyFetch('/api/rooms', {
  key: 'roomsOpt',
  server: false,
  getCachedData: (key) => {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  },
  transform: (data: RoomResponse) => {
    return data.data?.map((room) => ({
      label: room.code,
      value: room.id,
      isAvailable: room.isAvailable
    }))
  }
})

const { data: tenants, status, refresh } = await useLazyFetch<TenantResponse>('/api/tenants')

const tenantsDataTable = computed<TenantDataTable[]>(() => {
  if (!tenants.value) return []
  if (!tenants.value.data) return []

  return tenants.value.data.map((tenants) => {
    const roomsCodes = tenants.rooms.map((room) => room.code)
    return {
      ...tenants,
      joinDate: calendarFormat(new Date(tenants.joinDate)),
      rooms: new Intl.ListFormat('es-ES').format(roomsCodes),
      debt: formatCurrency(tenants.debt)
    }
  })
})

</script>