<template>
  <div v-if="props.status === 'pending' || props.status === 'idle'">
    <p>Cargando...</p>
  </div>
  <div v-if="props.status === 'error'">
    <p>Error</p>
  </div>
</template>

<script lang="ts" setup>
type Status = 'pending' | 'idle' | 'error'

const props = defineProps<{
  status: Status
}>()
</script>

<style scoped></style>