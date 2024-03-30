<template>
  <div>
    <DynamicDialog :draggable="false" />
    <div>
      <h1>Administración</h1>
    </div>
    <p v-if="status !== 'success'">Cargando...</p>
    <div v-else class="data-crud">
      <DataCrud title="Inquilinos" @open-create-dialog="showTenantDialog('create')"
        @open-update-dialog="showTenantDialog('update')" v-model:selection="tenantSelection" :data="tenantsData"
        :columns="tenantColumns" />

      <DataCrud title="Cuartos" @open-create-dialog="showRoomDialog('create')"
        @open-update-dialog="showRoomDialog('update')" v-model:selection="roomSelection" :data="roomsData"
        :columns="roomColumns" />
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
type TenantApiResponse = ApiResponse<TenantData>

// Values needed for the DataCrud component
const tenants = ref<TenantData[]>([])
const tenantsData = ref<TenantDataTable[]>([])
const tenantColumns = ref()
const rooms = ref<RoomData[]>([])
const roomsData = ref<RoomDataTable[]>([])
const roomColumns = ref()

// Fetch all admin data
const { data: response, status, refresh } = await useLazyFetch<DataAdminResponse>('/api/data', {
  server: false,
  onResponse: ({ request, response, options }) => {
    const data = response._data.data as DataAdmin

    // Set values for the DataCrud component (Tenant table)
    tenantsData.value = data.tenants.map((tenant) => {
      const roomsCodes = tenant.rooms.map((room) => room.code)
      return {
        ...tenant,
        createdAt: new Date(tenant.createdAt).toLocaleDateString('es-ES'),
        rooms: new Intl.ListFormat('es-ES').format(roomsCodes)
      }
    })
    tenants.value = data.tenants
    tenantColumns.value = {
      id: 'ID',
      rooms: 'Cuartos',
      createdAt: 'Ingresó',
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

// Values needed for the dialog components (Room)
const roomBody = ref<Omit<RoomData, 'id'>>({
  code: '',
  reference: '',
  floor: null,
  tenant: null
})
const roomSelection = ref()
const roomSelectedId = computed(() => roomSelection.value?.id! - 1)
const roomsOptions = computed(() => {
  if (!roomsData.value) return
  const opts = roomsData.value.map((room) => ({
    value: room.id,
    label: room.code
  }))
  return opts
})

// Values needed for the dialog components (Tenant)
const tenantBody = ref<Omit<TenantData, 'id'>>({
  name: '',
  createdAt: new Date(),
  rooms: []
})
const tenantSelection = ref<TenantDataTable>()
const tenantSelectedId = computed(() => tenantSelection.value?.id!)
const tenantOptions = computed(() => {
  if (!tenantsData.value) return
  const opts = tenantsData.value.map((tenant) => ({
    value: tenant.id,
    label: tenant.name
  }))
  return opts
})

// CRUD methods
const { execute: createTenant } = await useLazyFetch('/api/tenants', {
  key: 'createTenant',
  body: tenantBody,
  method: 'POST',
  server: false,
  immediate: false,
  watch: false,
  onResponse: async () => {
    await refresh()
  }
})

const { execute: updateTenant } = await useLazyFetch<TenantApiResponse>(
  () => `/api/tenants/${tenantSelectedId.value}`, {
  key: 'updateTenant',
  body: tenantBody,
  method: 'put',
  server: false,
  immediate: false,
  watch: false,
  onResponse: async () => {
    await refresh()
  }
})

// Dialog methods
const DialogTenant = defineAsyncComponent(() => import('~/components/dialog/Tenant.vue'));
const DialogRoom = defineAsyncComponent(() => import('~/components/dialog/Room.vue'));
const dialog = useDialog();
const showTenantDialog = (method: 'update' | 'create') => {
  dialog.open(DialogTenant, {
    props: {
      header: 'Inquilino',
      modal: true,
    },
    data: {
      name: method === 'update' ? tenants.value[tenantSelectedId.value!-1].name : '',
      createdAt: method === 'update' ? tenants.value[tenantSelectedId.value!-1].createdAt : '',
      rooms: method === 'update' ? tenants.value[tenantSelectedId.value!-1].rooms : [],
      roomsOpt: roomsOptions.value,
      method: method
    },
    onClose: async (options: any) => {
      const data: Omit<TenantData, 'id'> | undefined = options.data
      if (!data) return

      tenantBody.value = data
      if (method === 'update') {
        await updateTenant()
      } else {
        await createTenant()
      }
    },
  });
}

const showRoomDialog = (method: 'update' | 'create') => {
  dialog.open(DialogRoom, {
    props: {
      header: 'Cuartos',
      modal: true,
    },
    data: {
      code: method === 'update' ? rooms.value[roomSelectedId.value!].code : '',
      reference: method === 'update' ? rooms.value[roomSelectedId.value!].reference : '',
      floor: method === 'update' ? rooms.value[roomSelectedId.value!].floor : null,
      tenant: method === 'update' ? rooms.value[roomSelectedId.value!].tenant : null,
      tenantsOpt: tenantOptions.value,
      method: method,
    }
  });
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