<template>
  <div>
    <form class="form">
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
      <div class="form-group">
        <label for="recordLight">Registro de consumo de luz</label>
        <InputNumber id="recordLight" showButtons v-model="body.recordLight" mode="decimal" :min-fraction-digits="2"
          :max-fraction-digits="2" />
        <span class="p-error">{{ getError("recordLight") }}</span>
      </div>
      <div class="form-group">
        <label for="recordWater">Registro de consumo de agua</label>
        <InputNumber id="recordWater" showButtons v-model="body.recordWater" mode="decimal" :min-fraction-digits="2"
          :max-fraction-digits="2" />
        <span class="p-error">{{ getError("recordWater") }}</span>
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
  tenantId: number | null,
  recordLight: number | null,
  recordWater: number | null
}>({
  code: '',
  reference: '',
  floor: null,
  tenantId: null,
  recordLight: 0,
  recordWater: 0
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