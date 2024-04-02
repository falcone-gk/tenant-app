<template>
  <div>
    <DynamicDialog />
    <ConfirmDialog />
    <Card>
      <template #title>{{ props.title }}</template>
      <template #content>
        <DataTable v-model:selection="selection" selectionMode="single" dataKey="id" :value="props.data" stripedRows>
          <template #header>
            <div class="table-header">
              <div class="left-btns">
                <Button class="add-btn" type="button" icon="pi pi-plus" label="Agregar" outlined
                  @click="showDialog('create')" />
                <Button type="button" icon="pi pi-pencil" label="Editar" outlined severity="info" :disabled="!selection"
                  @click="showDialog('update')" />
              </div>
              <div>
                <Button type="button" icon="pi pi-trash" label="Eliminar" severity="danger" outlined
                  :disabled="!selection" @click="confirmDeleteTenant" />
              </div>
            </div>
          </template>
          <template #empty> No customers found. </template>
          <Column selectionMode="single" headerStyle="width: 3rem" />
          <Column v-for="([key, value], index) in Object.entries(props.columns)" :key="index" :field="key"
            :header="value" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'

const props = defineProps<{
  title: string
  data: any,
  extra?: { [key: string]: any },
  columns: { [key: string]: string },
  apiRoute: string
  form: any
}>()

const emits = defineEmits(['onSuccess', 'onError'])

const body = ref()
// TODO: Unselect row when deleted button is clicked
const selection = ref({ id: 0 })

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

const dialog = useDialog()
const showDialog = (method: 'create' | 'update') => {
  dialog.open(props.form, {
    props: {
      header: props.title,
      modal: true,
    },
    emits: {
      onSend: async (data: any, dialogModal: DynamicDialogInstance) => {
        body.value = data
        const sendMethod = method === 'update' ? updateData : createData
        await sendMethod()

        if (updateError.value || createError.value) {
          emits('onError')
        } else {
          emits('onSuccess')
          dialogModal.close()
        }
      }
    },
    data: {
      bodyData: props.data[selection.value.id],
      extraData: props.extra
    }
  })
}

const confirm = useConfirm();
const confirmDeleteTenant = () => {
  confirm.require({
    message: '¿Seguro que desea eliminar este inquilino?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteData()
      emits('onSuccess')
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