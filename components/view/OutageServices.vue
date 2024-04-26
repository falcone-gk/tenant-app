<template>
  <Panel toggleable>
    <template #header>
      <h2>Corte de Servicios</h2>
    </template>
    <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="data" group-rows-by="service.name"
      sort-field="service.name" row-group-mode="subheader" expandable-row-groups sort-mode="single" :sort-order="1">
      <template #groupheader="slotProps">
        <strong>
          <span>{{ slotProps.data.service.name }}</span>
        </strong>
      </template>
      <Column field="registerDate" header="Fecha de Lectura">
        <template #body="slotProps">
          {{ yearMonthFormat(new Date(slotProps.data.registerDate)) }}
        </template>
      </Column>
      <Column field="consume" header="Consumo">
        <template #body="slotProps">
          {{ slotProps.data.service.unit ? slotProps.data.consume + ' ' + slotProps.data.service.unit : '-' }}
        </template>
      </Column>
      <Column field="outageDate" header="Fecha de Corte">
        <template #body="slotProps">
          {{ slotProps.data.outageDate ? calendarFormat(new Date(slotProps.data.outageDate)) : '-' }}
        </template>
      </Column>
      <Column field="amount" header="Monto a pagar">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.amount) }}
        </template>
      </Column>
      <!-- Column field to fix an error with colspan not correct -->
      <Column field="no-exists" header="" style="width: 0; padding: 0;" />
      <template #empty>
        <p>{{ pending ? 'Cargando...' : 'No hay cortes de servicio.' }}</p>
      </template>
    </DataTable>
  </Panel>
</template>

<script lang="ts" setup>
const today = ref(new Date())
const startDate = ref(today.value.toLocaleDateString());
const endDate = ref(new Date(today.value.getFullYear(), today.value.getMonth() + 1, 0).toLocaleDateString());
const { data, pending } = useLazyApiFetch('/api/services/payments', {
  query: {
    isPaid: false,
    starDate: startDate,
    endDate: endDate
  },
  server: false,
  transform: ({ data }) => {
    return data
  }
})

const expandedRowGroups = ref([])
// this throws an error when used as props in datatable
// wait till it is fixed
/* const rowStyle = (data: TotalPaymentData) => {
  if (data.outageDate !== null) return {
    backgroundColor: 'var(--red-400)',
    color: 'white',
    fontWeight: 'bold'
  }
}; */
</script>