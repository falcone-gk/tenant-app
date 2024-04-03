<template>
  <div>
    <form id="form">
      <div class="form-group">
        <label for="code">Código:</label>
        <InputText id="code" v-model="body.code" />
      </div>
      <div class="form-group">
        <label for="reference">Referencia:</label>
        <Textarea id="reference" v-model="body.reference" auto-resize rows="5" cols="30" />
      </div>
      <div class="form-group">
        <label for="floor">Piso:</label>
        <InputNumber id="floor" v-model="body.floor" />
      </div>
      <div class="form-group">
        <label for="tenants">Inquilinos:</label>
        <Dropdown id="tenants" v-model="body.tenantId" showClear @change="console.log(body.tenant)"
          :options="tenantOptions" option-label="label" option-value="value" placeholder="Seleccione un inquilino" />
      </div>

      <Button @click.prevent="onSubmit" type="submit" label="Enviar" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import type { RoomData } from '~/types/admin';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['send'])
const body = ref<Omit<RoomData, 'id'>>({
  code: '',
  reference: '',
  floor: null,
  tenantId: null
})

const tenantOptions = ref([])

const onSubmit = () => {
  emits('send', body.value)
}

onMounted(() => {
  const { bodyData, extraData } = dialogRef?.value.data
  if (bodyData) {
    body.value = bodyData
  }
  tenantOptions.value = extraData.tenantsOpt
})

</script>