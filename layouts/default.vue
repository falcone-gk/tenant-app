<script lang="ts" setup>
const route = useRoute()

const links = ref([
  { label: 'Administración', icon: 'pi pi-file-edit', route: '/' },
  { label: 'Inquilinos', icon: 'pi pi-users', route: '/tenants' },
  { label: 'Historial', icon: 'pi pi-history', route: '/history' },
  { label: 'Servicios', icon: 'pi pi-bolt', route: '/services' },
  { label: 'Cuartos', icon: 'pi pi-home', route: '/rooms' },
])

const { execute } = await useLazyFetch('/api/auth/logout', {
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

<template>
  <div id="container">
    <aside id="sidebar">
      <Card>
        <template #title>App Falcón</template>
        <template #content>
          <Menu :model="links">
            <template #item="{ item, props }">
              <router-link v-slot="{ href, navigate }" :to="item.route" custom>
                <a :class="{ 'active-menu': route.path === item.route }" v-ripple :href="href" v-bind="props.action" @click="navigate">
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
    <section id="content">
      <main id="main-content">
        <slot />
      </main>
    </section>
  </div>
</template>

<style>
/** Layout styles */
#content {
  margin-left: calc(300px + 2rem);
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: .5rem 1.5rem;
  transition: margin-left .2s;
  min-height: calc(100vh - 4rem);
}

#sidebar {
  position: fixed;
  width: 300px;
  height: calc(100vh - 4rem);
  z-index: 999;
  top: 2rem;
  left: 2rem;
  transition: transform .2s,left .2s;
  border-radius: 12px;
  padding: .5rem 1.5rem;
}

#main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 5px;
}

.p-panel-header {
  border-bottom: 1px solid var(--surface-border);
}

.p-panel-title {
  font-size: x-large;
}

/** Sidebar Card styles */

#sidebar > .p-card {
  height: 100%;
}

#sidebar .p-card-body {
  display: flex;
  height: 100%;
  padding: 1.5rem .5rem;
}

#sidebar .p-card-title, #sidebar .p-card-footer {
  display: flex;
  justify-content: center;
}

#sidebar .p-card-footer {
  margin-top: auto;
}

#sidebar .p-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/** Menu styles */
#sidebar .p-menu {
  border: none;
}
#sidebar .p-menuitem-link {
  display: flex;
  align-items: center;
}
#sidebar .menu-label {
  margin-left: 10px;
}
#sidebar .active-menu {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

</style>