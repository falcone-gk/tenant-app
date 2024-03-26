<template>
  <Panel header="Cuartos">
    <div>
      <div v-if="!rooms">
        <p>No content u.u</p>
      </div>
      <Accordion v-else :multiple="true">
        <AccordionTab v-for="room in rooms.data" :key="room.id" :header="'Cuarto ' + room.code">
          <ul>
            <li><p><span class="subtitle">Descripcion: </span>{{ room.reference }}</p></li>
            <li><p><span class="subtitle">Piso: </span>{{ room.floor }}</p></li>
            <li><p><span class="subtitle">Inquilino: </span>{{ room.tenantId ? room.tenantId : 'Sin inquilino' }}</p></li>
          </ul>
        </AccordionTab>
      </Accordion>
    </div>
  </Panel>
</template>

<script lang="ts" setup>
import type { Room } from '~/types';

definePageMeta({
  middleware: 'auth'
})

type RoomResponse = ApiResponse<Room[]>
const { data: rooms } = await useLazyFetch<RoomResponse>('/api/rooms')

</script>