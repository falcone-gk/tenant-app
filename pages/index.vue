<template>
  <div>
    <p>Home view</p>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})
</script>