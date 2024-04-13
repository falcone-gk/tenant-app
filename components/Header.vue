<template>
  <div class="header">
    <div class="my-auto">
      <Button icon="pi pi-bars" @click="emits('toggleSidebar')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['toggleSidebar'])
</script>