<template>
  <div>
    <form id="form">
      <div class="form-group">
        <label for="code">Código:</label>
        <InputText id="code" v-model="body.code" />
        <span class="p-error">{{ getError("code") }}</span>
      </div>
      <div class="form-group">
        <label for="reference">Referencia:</label>
        <Textarea id="reference" v-model="body.reference" auto-resize rows="5" cols="30" />
      </div>
      <div class="form-group">
        <label for="floor">Piso:</label>
        <InputNumber id="floor" v-model="body.floor" showButtons :min="1" />
        <span class="p-error">{{ getError("floor") }}</span>
      </div>
      <div class="form-group">
        <label for="tenants">Inquilinos:</label>
        <Dropdown id="tenants" v-model="body.tenantId" showClear :options="tenantOptions" option-label="label"
          option-value="value" placeholder="Seleccione un inquilino" />
      </div>

      <Button @click.prevent="onSubmit" type="submit" label="Enviar" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { roomSchema } from '~/schemas';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const emits = defineEmits(['send'])
const body = ref<{
  code: string,
  reference: string,
  floor: number | null,
  tenantId: number | null
}>({
  code: '',
  reference: '',
  floor: null,
  tenantId: null,
})

const tenantOptions = ref([])

const { validate, errors, isValid, clearErrors, getError } = useValidation(
  roomSchema, body, {
  mode: 'lazy',
});

const onSubmit = async () => {
  await validate()
  if (isValid.value) {
    emits('send', body.value)
  }
}

onMounted(() => {
  const { bodyData, extraData } = dialogRef?.value.data
  if (bodyData) {
    body.value = bodyData
  }
  tenantOptions.value = extraData.tenantsOpt
})

</script>