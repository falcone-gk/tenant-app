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