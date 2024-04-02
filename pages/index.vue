<template>
  <div>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <DynamicDialog ref="dynamicDialog" :draggable="false" />
    <div>
      <h1>Administración</h1>
    </div>
    <p v-if="status !== 'success'">Cargando...</p>
    <div v-else class="data-crud">
      <DataCrud title="Inquilinos" @open-create-dialog="showTenantDialog('create')"
        @open-update-dialog="showTenantDialog('update')" @open-delete-dialog="confirmDeleteTenant"
        v-model:selection="tenantSelection" :data="tenantsData" :columns="tenantColumns" />

      <DataCrud title="Cuartos" @open-create-dialog="showRoomDialog('create')"
        @open-update-dialog="showRoomDialog('update')" @open-delete-dialog="confirmDeleteRoom"
        v-model:selection="roomSelection" :data="roomsData" :columns="roomColumns" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  RoomDataTable, RoomData,
  TenantDataTable, TenantData, DataAdmin
} from '~/types/admin';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'

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

// Values needed for the dialog components (Room)
const roomBody = ref<Omit<RoomData, 'id'>>({
  code: '',
  reference: '',
  floor: null,
  tenantId: null
})
const roomSelection = ref()
const roomSelectedId = computed(() => roomSelection.value?.id!)
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
  dayToPay: null,
  joinDate: new Date(),
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

// CRUD methods (Tenant)
const { error: createTenantError, execute: createTenant } = await useLazyFetch(
  '/api/tenants', {
  key: 'createTenant',
  body: tenantBody,
  method: 'POST',
  server: false,
  immediate: false,
  watch: false,
})

const { error: updateTenantError, execute: updateTenant } = await useLazyFetch<TenantApiResponse>(
  () => `/api/tenants/${tenantSelectedId.value}`, {
  key: 'updateTenant',
  body: tenantBody,
  method: 'PUT',
  server: false,
  immediate: false,
  watch: false,
})

const { execute: deleteTenant } = await useLazyFetch(
  () => `/api/tenants/${tenantSelectedId.value}`, {
  key: 'deleteTenant',
  method: 'DELETE',
  server: false,
  immediate: false,
  watch: false,
})

// CRUD methods (Room)
const { error: createRoomError, execute: createRoom } = await useLazyFetch(
  '/api/rooms', {
  key: 'createRoom',
  body: roomBody,
  method: 'POST',
  server: false,
  immediate: false,
  watch: false,
})

const { error: updateRoomError, execute: updateRoom } = await useLazyFetch(
  () => `/api/rooms/${roomSelectedId.value}`, {
  key: 'updateRoom',
  body: roomBody,
  method: 'PUT',
  server: false,
  immediate: false,
  watch: false,
})

const { execute: deleteRoom } = await useLazyFetch(
  () => `/api/rooms/${roomSelectedId.value}`, {
  key: 'deleteRoom',
  method: 'DELETE',
  server: false,
  immediate: false,
  watch: false,
})

// Toast
const toast = useToast()

// Confirm dialog for delete
const confirm = useConfirm();
const confirmDeleteTenant = (id: number) => {
  confirm.require({
    message: '¿Seguro que desea eliminar este inquilino?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteTenant()
      await refresh()
      toast.add({ severity: 'success', summary: 'Exito', detail: 'Inquilino eliminado', life: 3000 })
    }
  })
}
const confirmDeleteRoom = (id: number) => {
  confirm.require({
    message: '¿Seguro que desea eliminar este cuarto?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteRoom()
      await refresh()
      toast.add({ severity: 'success', summary: 'Exito', detail: 'Cuarto eliminado', life: 3000 })
    }
  })
}

// Dialog methods
const DialogTenant = defineAsyncComponent(() => import('~/components/dialog/Tenant.vue'));
const DialogRoom = defineAsyncComponent(() => import('~/components/dialog/Room.vue'));
const dynamicDialog = ref()
const dialog = useDialog();
const showTenantDialog = (method: 'update' | 'create') => {
  dialog.open(DialogTenant, {
    props: {
      header: 'Inquilino',
      modal: true,
    },
    emits: {
      onSend: async (data: Omit<TenantData, 'id'>, dialogModal: DynamicDialogInstance) => {
        tenantBody.value = data
        const sendMethod = method === 'update' ? updateTenant : createTenant
        const message = method === 'update' ? 'actualizar' : 'crear'
        await sendMethod()

        if (updateTenantError.value || createTenantError.value) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo ' + message + ' el inquilino', life: 3000 })
        } else {
          await refresh()
          dialogModal.close()
          toast.add({ severity: 'success', summary: 'Exito', detail: 'Inquilino actualizado', life: 3000 })
        }
      }
    },
    data: {
      name: method === 'update' ? tenants.value[tenantSelectedId.value! - 1].name : '',
      dayToPay: method === 'update' ? tenants.value[tenantSelectedId.value! - 1].dayToPay : null,
      joinDate: method === 'update' ? tenants.value[tenantSelectedId.value! - 1].joinDate : '',
      rooms: method === 'update' ? tenants.value[tenantSelectedId.value! - 1].rooms : [],
      roomsOpt: roomsOptions.value,
      method: method,
      error: method === 'update' ? updateTenantError.value : createTenantError.value
    }
  });
}

const showRoomDialog = (method: 'update' | 'create') => {
  dialog.open(DialogRoom, {
    props: {
      header: 'Cuartos',
      modal: true,
    },
    emits: {
      // TODO: Add new paramater dialog ref in all dialogs
      onSend: async (data: Omit<RoomData, 'id'>, dialogModal: DynamicDialogInstance) => {
        roomBody.value = data
        const sendMethod = method === 'update' ? updateRoom : createRoom
        const message = method === 'update' ? 'actualizar' : 'crear'
        await sendMethod()

        if (updateRoomError.value || createRoomError.value) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo ' + message + ' el cuarto', life: 3000 })
          return
        }
        await refresh()
        dialogModal.close()
        toast.add({ severity: 'success', summary: 'Exito', detail: 'Cuarto actualizado', life: 3000 })
      }
    },
    data: {
      code: method === 'update' ? rooms.value[roomSelectedId.value! - 1].code : '',
      reference: method === 'update' ? rooms.value[roomSelectedId.value! - 1].reference : '',
      floor: method === 'update' ? rooms.value[roomSelectedId.value! - 1].floor : null,
      tenantId: method === 'update' ? rooms.value[roomSelectedId.value! - 1].tenantId : null,
      tenantsOpt: tenantOptions.value,
      method: method,
      error: method === 'update' ? updateRoomError.value : createRoomError.value
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