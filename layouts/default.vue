<script lang="ts" setup>
const route = useRoute()

const links = ref([
  { label: 'Inicio', icon: 'pi pi-home', route: '/' },
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
  <div class="main-container">
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
      <main class="w-[900px] mx-auto my-8">
        <slot />
      </main>
    </section>
  </div>
</template>

<style>
/** Layout styles */
.main-container {
  display: flex;
	width: 100%;
	min-height: 100vh;
}

#sidebar {
  display: flex;
}

#content {
  display: flex;
  flex: 1;
}

/** Sidebar Card styles */
.p-card {
  min-width: 300px;
}

.p-card-body {
  display: flex;
  height: 100%;
  padding: 1.5rem .5rem;
}

.p-card-title, .p-card-footer {
  display: flex;
  justify-content: center;
}

.p-card-footer {
  margin-top: auto;
}

.p-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/** Menu styles */
.p-menu {
  border: none;
}
.p-menuitem-link {
  display: flex;
  align-items: center;
}
.menu-label {
  margin-left: 10px;
}
.active-menu {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

</style>