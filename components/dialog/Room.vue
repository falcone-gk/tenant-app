<template>
  <div>
    <form id="form">
      <div class="form-group">
        <label for="code">Código:</label>
        <InputText id="code" v-model="body.code" />
      </div>
      <div class="form-group">
        <label for="reference">Referencia:</label>
        <Textarea id="reference" v-model="body.reference" auto-resize rows="5" cols="30"/>
      </div>
      <div class="form-group">
        <label for="floor">Piso:</label>
        <InputNumber id="floor" v-model="body.floor" />
      </div>
      <div class="form-group">
        <label for="tenants">Inquilinos:</label>
        <Dropdown
        id="tenants"
        v-model="selectedTenant"
        :options="tenantOptions"
        option-label="label"
        option-value="value"
        placeholder="Seleccione un inquilino"/>
      </div>

      <Button
      type="submit"
      :label="dialogMethod === 'update' ? 'Actualizar' : 'Crear'"/>
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import type { RoomData } from '~/types/admin';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const selectedTenant = ref()
const body = ref<Omit<RoomData, 'id'>>({
  code: '',
  reference: '',
  floor: null,
  tenant: null
})

const tenantOptions = ref([])
const dialogMethod = ref<'create' | 'update'>()

onMounted(() => {
  const { tenantsOpt, method, ...bodyData } = dialogRef?.value.data
  body.value = bodyData
  tenantOptions.value = tenantsOpt
  console.log(tenantOptions.value)
  dialogMethod.value = method
  selectedTenant.value = body.value.tenant?.id
})

</script>