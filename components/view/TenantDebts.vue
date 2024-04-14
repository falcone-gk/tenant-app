<template>
  <Panel toggleable>
    <template #header>
      <h2>Deudores</h2>
    </template>
    <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="data" expandableRowGroups rowGroupMode="subheader"
      groupRowsBy="tenant.name" sortMode="single" sortField="tenant.name" :sortOrder="1" stripedRows>
      <template #groupheader="slotProps">
        <strong>
          <span>{{ slotProps.data.tenant.name }}</span>
        </strong>
      </template>
      <Column field="service.name" header="Servicio" />
      <Column field="room.code" header="Cuarto" />
      <Column field="dateToPay" header="Fecha a Pagar">
        <template #body="slotProps">
          {{ calendarFormat(new Date(slotProps.data.dateToPay)) }}
        </template>
      </Column>
      <Column field="debt" header="Deuda">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.debt) }}
        </template>
      </Column>
      <!-- Column field to fix an error with colspan not correct -->
      <Column field="no-exists" header="" style="width: 0; padding: 0;" />
      <template #groupfooter="slotProps">
        <div class="totals">
          <strong>
            <span>Deuda total: {{ formatCurrency(getTotalDebtByTenant(slotProps.data.tenant.name))
              }}</span>
          </strong>
        </div>
      </template>
      <template #footer>
        <div class="totals">
          <strong>
            <span>Deuda total: {{ formatCurrency(getTotalDebt()) }}</span>
          </strong>
        </div>
      </template>
    </DataTable>
  </Panel>
</template>

<script lang="ts" setup>
const { data } = await useFetch('/api/tenants/payments', {
  query: {
    isPaid: false
  },
  transform: ({ data }) => {
    return data?.map((payment) => {
      return {
        ...payment,
        debt: payment.amount - payment.amountPaid
      }
    })
  }
})
const expandedRowGroups = ref([])
const getTotalDebtByTenant = (tenantName: string) => {
  if (!data.value) return 0
  return data.value?.filter((payment) => payment.tenant.name === tenantName).reduce((a, b) => a + b.debt, 0)
}

const getTotalDebt = () => {
  if (!data.value) return 0
  return data.value?.reduce((a, b) => a + b.debt, 0)
}

</script>
<style scoped>
.totals {
  display: flex;
  justify-content: flex-end;
}
</style>