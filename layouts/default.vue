<template>
  <div id="container">
    <CustomSidebar ref="sidebar" />
    <Header @toggle-sidebar="togleSidebar" />
    <section id="content">
      <main id="main-content" class="mx-auto">
        <slot />
      </main>
    </section>
  </div>
</template>

<script lang="ts" setup>
const sidebar = ref()
const togleSidebar = () => {
  sidebar.value.isVisible = !sidebar.value.isVisible
}
</script>