<template>
  <Card>
    <template #title>{{ props.title }}</template>
    <template #content>
      <DataTable v-model:selection="selection" dataKey="id" :value="props.data" stripedRows>
        <template #header>
          <div class="table-header">
            <div class="left-btns">
              <Button class="add-btn" type="button" icon="pi pi-plus" label="Agregar" outlined @click="emits('openCreateDialog')" />
              <Button type="button" icon="pi pi-pencil" label="Editar" outlined severity="info" :disabled="!selection" @click="emits('openUpdateDialog')" />
            </div>
            <div>
              <Button type="button" icon="pi pi-trash" label="Eliminar" severity="danger" outlined :disabled="!selection" />
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
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
  data: any,
  columns: { [key: string]: string }
}>()

const emits = defineEmits(['openCreateDialog', 'openUpdateDialog'])
const selection = defineModel('selection')
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