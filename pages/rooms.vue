<template>
  <div>
    <div>
      <h1>Cuartos</h1>
    </div>
    <div>
      <DataCrud title="Cuartos" :data="rooms ? rooms.data : []" :data-table="roomsDataTable" :columns="roomColumns"
        api-route="/api/rooms" :form="markRaw(roomForm)" :extra="{ tenantsOpt: tenantOpts }" :loading="pending"
        @on-success="refresh" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RoomDataTable, TenantData } from '~/types/admin';

//const nuxtApp = useNuxtApp()
const roomForm = defineAsyncComponent(() => import('~/components/dialog/Room.vue'))

definePageMeta({
  middleware: 'auth'
})

const roomColumns = {
  code: 'Código',
  reference: 'Referencia',
  floor: 'Piso',
  tenant: 'Inquilino',
  recordLight: 'Registro de luz',
  recordWater: 'Registro de agua'
}

type TenantResponse = ApiResponse<TenantData[]>

const { data: tenantOpts, pending } = useLazyApiFetch('/api/tenants', {
  key: 'tenantsOpts',
  server: false,
  /* getCachedData: (key: string) => {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }, */
  transform: (data: TenantResponse) => {
    return data.data?.map((tenant) => ({ label: tenant.name, value: tenant.id }))
  }
})

const { data: rooms, refresh } = useLazyApiFetch('/api/rooms', {
  server: false
})

const roomsDataTable = computed<RoomDataTable[]>(() => {
  if (!rooms.value) return []
  if (!rooms.value.data) return []

  return rooms.value.data.map((room) => ({
    ...room,
    tenant: room.tenant ? room.tenant.name : 'Sin inquilino',
    recordLight: room.recordLight + ' kW',
    recordWater: room.recordWater + ' m3'
  }))
})

</script>