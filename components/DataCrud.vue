<template>
  <Card>
    <template v-if="props.showTitle === undefined || props.showTitle" #title>{{ props.title }}</template>
    <template #content>
      <DataTable v-model:selection="selection" selectionMode="single" dataKey="id" :value="props.dataTable" stripedRows>
        <template #header>
          <div class="table-header">
            <div class="left-btns">
              <Button class="add-btn" type="button" icon="pi pi-plus"
                :label="viewport.isLessThan('tablet') ? undefined : 'Agregar'" outlined @click="showDialog('create')" />
              <Button type="button" icon="pi pi-pencil" :label="viewport.isLessThan('tablet') ? undefined : 'Editar'"
                outlined severity="info" :disabled="selectedIndex === -1" @click="showDialog('update')" />
            </div>
            <div>
              <Button type="button" icon="pi pi-trash" :label="viewport.isLessThan('tablet') ? undefined : 'Eliminar'"
                severity="danger" outlined :disabled="selectedIndex === -1" @click="confirmDeleteTenant" />
            </div>
          </div>
        </template>
        <template #empty> {{ loading ? 'Cargando...' : 'No hay datos' }} </template>
        <Column v-for="([key, value], index) in Object.entries(props.columns)" :key="index" :field="key"
          :header="value" />
      </DataTable>
    </template>
  </Card>
</template>

<script lang="ts" setup>

const props = defineProps<{
  title: string
  dataTable: any,
  data: any,
  extra?: { [key: string]: any },
  columns: { [key: string]: string },
  apiRoute: string
  form: any,
  showTitle?: boolean,
  loading: boolean
}>()

const emits = defineEmits(['onSuccess', 'onError'])
const viewport = useViewport()

const body = ref()
// TODO: Unselect row when deleted button is clicked
const selection = ref({ id: -1 })
const selectedIndex = computed(() => {
  if (!selection.value) return -1
  return props.data.findIndex((item: any) => item.id === selection.value.id)
})

const { error: createError, execute: createData } = await useLazyFetch(props.apiRoute, {
  method: 'POST',
  body: body,
  server: false,
  immediate: false,
  watch: false
})
const { error: updateError, execute: updateData } = await useLazyFetch(
  () => `${props.apiRoute}/${selection.value.id}`, {
  method: 'PUT',
  body: body,
  server: false,
  immediate: false,
  watch: false
})
const { execute: deleteData } = await useLazyFetch(
  () => `${props.apiRoute}/${selection.value.id}`, {
  method: 'DELETE',
  server: false,
  immediate: false,
  watch: false
})

const { showNotification } = useNotification()
const dialog = useDialog()
const showDialog = (method: 'create' | 'update') => {
  const dialogRef = dialog.open(props.form, {
    props: {
      header: props.title,
      modal: true,
    },
    emits: {
      onSend: async (data: any) => {
        body.value = data
        const sendMethod = method === 'update' ? updateData : createData
        await sendMethod()

        if (updateError.value || createError.value) {
          emits('onError')
          showNotification('error')
        } else {
          emits('onSuccess')
          showNotification('success')
          dialogRef.close()
        }
      },
      onCustomSend: (status: 'success' | 'error' | 'idle') => {
        if (status === 'success') {
          emits('onSuccess')
          showNotification('success')
          dialogRef.close()
        } else {
          emits('onError')
          showNotification('error')
        }
      }
    },
    data: {
      bodyData: method === 'update' ? props.data[selectedIndex.value] : null,
      extraData: props.extra,
      selectedRowId: selection.value ? selection.value.id : null,
      method: method
    }
  })
}

const confirm = useConfirm();
const confirmDeleteTenant = () => {
  confirm.require({
    message: '¿Seguro que desea eliminar este inquilino?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar',
    accept: async () => {
      await deleteData()
      emits('onSuccess')
      showNotification('success')
    }
  })
}
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
}

.add-btn {
  margin-right: 10px;
}
</style>