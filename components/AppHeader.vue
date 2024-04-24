<template>
  <div class="header">
    <div class="my-auto">
      <Button icon="pi pi-bars" outlined @click="emits('toggleSidebar')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['toggleSidebar'])
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  z-index: 10;
  height: var(--header-height);
  width: 100%;
  background: var(--surface-section);
  padding: 0 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}
</style>