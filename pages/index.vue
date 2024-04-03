<template>
  <div>
    <div>
      <h1>Administración</h1>
    </div>
    <p v-if="status !== 'success'">Cargando...</p>
    <div v-else class="data-crud">
      <DataCrud title="Inquilinos" :data="tenants" :data-table="tenantsData" :columns="tenantColumns"
        api-route="/api/tenants" :form="markRaw(tenanForm)" :extra="{ roomsOpt: roomsOpt }" @on-error="afterError"
        @on-success="afterSuccess" />
      <DataCrud title="Cuartos" :data="rooms" :data-table="roomsData" :columns="roomColumns" api-route="/api/rooms"
        @on-error="afterError" :form="markRaw(roomForm)" :extra="{ tenantsOpt: tenantsOpt }"
        @on-success="afterSuccess" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  RoomDataTable, RoomData,
  TenantDataTable, TenantData, DataAdmin
} from '~/types/admin';

definePageMeta({
  middleware: 'auth'
})
type DataAdminResponse = ApiResponse<DataAdmin>

const tenanForm = defineAsyncComponent(() => import('~/components/dialog/Tenant.vue'))
const roomForm = defineAsyncComponent(() => import('~/components/dialog/Room.vue'))

// Values needed for the DataCrud component
const tenants = ref<TenantData[]>([])
const tenantsData = ref<TenantDataTable[]>([])
const tenantColumns = ref()

const rooms = ref<RoomData[]>([])
const roomsData = ref<RoomDataTable[]>([])
const roomColumns = ref()

const tenantsOpt = computed(() => {
  if (!tenantsData.value) return
  const opts = tenantsData.value.map((tenant) => ({
    value: tenant.id,
    label: tenant.name
  }))
  return opts
})

const roomsOpt = computed(() => {
  if (!roomsData.value) return
  const opts = roomsData.value.map((room) => ({
    value: room.id,
    label: room.code
  }))
  return opts
})

// Fetch all admin data
const { status, refresh } = await useLazyFetch<DataAdminResponse>('/api/data', {
  server: false,
  onResponse: ({ request, response, options }) => {
    const data = response._data.data as DataAdmin

    // Set values for the DataCrud component (Tenant table)
    tenantsData.value = data.tenants.map((tenant) => {
      const roomsCodes = tenant.rooms.map((room) => room.code)
      return {
        ...tenant,
        joinDate: new Date(tenant.joinDate).toLocaleDateString('es-ES'),
        rooms: new Intl.ListFormat('es-ES').format(roomsCodes)
      }
    })
    tenants.value = data.tenants
    tenantColumns.value = {
      id: 'ID',
      rooms: 'Cuartos',
      joinDate: 'Ingresó',
      dayToPay: 'Días de pago',
      name: 'Nombre'
    }

    // Set values for the DataCrud component (Room table)
    roomsData.value = data.rooms.map((room) => {
      return {
        ...room,
        tenant: room.tenant ? room.tenant.name : 'Sin inquilino'
      }
    })
    rooms.value = data.rooms
    roomColumns.value = {
      id: 'ID',
      code: 'Código',
      floor: 'Piso',
      reference: 'Referencia',
      tenant: 'Inquilino'
    }
  }
})

const toast = useToast()

const afterSuccess = async () => {
  toast.add({ severity: 'success', summary: 'Exito', detail: 'Operación exitosa', life: 3000 })
  await refresh()
}

const afterError = async () => {
  toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar la operación', life: 3000 })
}

</script>

<style scoped>
h1 {
  font-size: x-large;
  font-weight: 600;
}

.data-crud {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>