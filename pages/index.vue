<template>
  <div>
    <div><h1>Administración</h1></div>
    <p v-if="status !== 'success'">Cargando...</p>
    <div v-else class="data-crud">
      <DataCrud
      title="Inquilinos"
      :data="response?.data.tenants.data"
      :columns="response?.data.tenants.columns!" />

      <DataCrud
      title="Cuartos"
      :data="response?.data.rooms.data"
      :columns="response?.data.rooms.columns!" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})

const { data: response, status } = await useLazyFetch('/api/data', {
  server: false,
  transform: (response) => {
    const tenants = response.data?.tenants
    const tenantColumns = {
      id: 'ID',
      rooms: 'Cuartos',
      createdAt: 'Ingresó',
      name: 'Nombre'
    }

    const rooms = response.data?.rooms
    const roomColumns = {
      id: 'ID',
      code: 'Código',
      floor: 'Piso',
      reference: 'Referencia',
      tenantId: 'Inquilino'
    }

    return {
      ...response,
      data: {
        tenants: {
          data: tenants,
          columns: tenantColumns
        },
        rooms: {
          data: rooms,
          columns: roomColumns
        }
      }
    }
  }
})

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