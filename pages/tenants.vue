<template>
  <Panel header="Inquilinos">
    <div>
      <div v-if="!response?.data || response.data.length === 0">
        <p>No content u.u</p>
      </div>
      <Accordion v-else :multiple="true">
        <AccordionTab v-for="tenant in response.data" :key="tenant.id" :header="'Inquilino ' + tenant.name">
          <ul>
            <li><p><span class="subtitle">Inquilino: </span>{{ tenant.name }}</p></li>
            <li><p><span class="subtitle">Ingresó: </span>{{ tenant.createdAt }}</p></li>
            <li><p><span class="subtitle">Cuartos: </span>{{ tenant.rooms }}</p></li>
          </ul>
        </AccordionTab>
      </Accordion>
    </div>
  </Panel>
</template>

<script lang="ts" setup>
import type { Tenant } from '~/types';

definePageMeta({
  middleware: 'auth'
})

type TenantResponse = ApiResponse<Tenant[]>
const { data: response } = await useLazyFetch<TenantResponse>('/api/tenants')
</script>