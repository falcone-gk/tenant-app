<template>
  <div>
    <Header v-if="viewport.isLessThan('desktopMedium')" @toggle-sidebar="togleSidebar" />
    <div class="container">
      <CustomSidebar ref="sidebar" />
      <main id="main-content">
        <section class="main-section">
          <slot />
        </section>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
const viewport = useViewport()
const containerHeight = computed(() => {
  return viewport.isGreaterOrEquals('desktopMedium') ? '100vh' : 'calc(100vh - var(--header-height))'
})
const sidebar = ref()
const togleSidebar = () => {
  sidebar.value.isVisible = !sidebar.value.isVisible
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: v-bind(containerHeight);
}

#main-content {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 100%;
  margin: .5rem auto 5rem auto;
}

.main-section {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>