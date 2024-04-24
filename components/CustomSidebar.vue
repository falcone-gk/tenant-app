<template>
  <aside v-if="viewport.isGreaterOrEquals('desktopMedium')" id="sidebar">
    <Card>
      <template #title>Navegación</template>
      <template #content>
        <Menu :model="links">
          <template #item="{ item, props }">
            <router-link v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple :class="{ 'active-menu': route.path === item.route }" :href="href" v-bind="props.action"
                @click="navigate">
                <span :class="item.icon" />
                <span class="menu-label">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </Menu>
      </template>
      <template #footer>
        <Button @click="logout">Cerrar sesión</Button>
      </template>
    </Card>
  </aside>

  <Sidebar v-if="viewport.isLessThan('desktopMedium')" v-model:visible="isVisible">
    <aside id="float-sidebar">
      <Card>
        <template #title>Navegación</template>
        <template #content>
          <Menu :model="links">
            <template #item="{ item, props }">
              <router-link v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :class="{ 'active-menu': route.path === item.route }" :href="href" v-bind="props.action"
                  @click="navigate">
                  <span :class="item.icon" />
                  <span class="menu-label">{{ item.label }}</span>
                </a>
              </router-link>
            </template>
          </Menu>
        </template>
        <template #footer>
          <Button @click="logout">Cerrar sesión</Button>
        </template>
      </Card>
    </aside>
  </Sidebar>
</template>

<script lang="ts" setup>
const viewport = useViewport()

const isVisible = ref(false)
defineExpose({ isVisible })

const route = useRoute()

const links = ref([
  { label: 'Inicio', icon: 'pi pi-home', route: '/' },
  { label: 'Inquilinos', icon: 'pi pi-users', route: '/tenants' },
  { label: 'Cuartos', icon: 'pi pi-home', route: '/rooms' },
  { label: 'Servicios', icon: 'pi pi-bolt', route: '/services' },
])

const { execute } = await useLazyApiFetch('/api/auth/logout', {
  server: false,
  immediate: false
})

const logout = async () => {
  const token = useCookie('token', {
    sameSite: 'strict'
  })
  await execute()
  token.value = null
  navigateTo('/login')
}
</script>

<style scoped>
#sidebar {
  display: flex;
  position: sticky;
  top: 0;
  max-height: 100vh;
  width: var(--sidebar-width);
}

#float-sidebar {
  display: flex;
  height: 100%;
}

#float-sidebar :deep(.p-card) {
  box-shadow: none;
}

:deep(.p-card) {
  width: 100%;
  display: flex;
  height: 100%;
  border-radius: 0;
}

:deep(.p-card-body) {
  display: flex;
  height: 100%;
  padding: 1.5rem .5rem;
}

:deep(.p-card-title),
:deep(.p-card-footer) {
  display: flex;
  justify-content: center;
}

:deep(.p-card-footer) {
  margin-top: auto;
}

:deep(.p-button) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

:deep(.p-menu) {
  border: none;
}

:deep(.p-menuitem-link) {
  display: flex;
  align-items: center;
}

:deep(.menu-label) {
  margin-left: 10px;
}

:deep(.active-menu) {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}
</style>