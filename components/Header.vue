<template>
  <div class="header">
    <div>
      <h1>App Falcón</h1>
    </div>
    <div class="my-auto">
      <Button icon="pi pi-bars" outlined @click="emits('toggleSidebar')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['toggleSidebar'])
</script>