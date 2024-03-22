<template>
  <UCard :ui="{
    base: 'h-full',
    background: 'dark:bg-primary-950',
    divide: 'divide-y divide-gray-200 dark:divide-gray-500',
  }">
    <template #header>
      <h1>Cuartos</h1>
    </template>
    <div>
      <UAccordion
      multiple
      color="secondary"
      variant="solid"
      size="xl"
      :items="items">
        <template #item="{ item }">
          <ul class="px-2.5">
            <li>
              <p><span class="font-bold">Descripción:</span> {{ item.description }}</p>
            </li>
            <li>
              <p><span class="font-bold">Piso:</span> {{ item.floor }}</p>
            </li>
            <li>
              <p><span class="font-bold">Propietario:</span> {{ item.tenant ? item.tenant : 'Habilitado' }}</p>
            </li>
          </ul>
        </template>
      </UAccordion>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { Room } from '~/types';

definePageMeta({
  middleware: 'auth'
})

type RoomResponse = ApiResponse<Room[]>
const { data: rooms } = await useLazyFetch<RoomResponse>('/api/rooms')

const items = computed(() => {
  if (!rooms.value?.data) return []
  const accordiondata = rooms.value.data.map((room) => {
    return {
      label: `${room.id}. Cuarto ${room.code}`,
      floor: room.floor,
      description: room.reference,
      tenant: room.tenantId
    }
  })
  return accordiondata
})

</script>