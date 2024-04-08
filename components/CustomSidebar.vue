<template>
  <Sidebar v-model:visible="isVisible">
    <aside id="sidebar">
      <Card>
        <template #title>Navegación</template>
        <template #content>
          <Menu :model="links">
            <template #item="{ item, props }">
              <router-link v-slot="{ href, navigate }" :to="item.route" custom>
                <a :class="{ 'active-menu': route.path === item.route }" v-ripple :href="href" v-bind="props.action"
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
const isVisible = ref(false)
defineExpose({ isVisible })

const route = useRoute()

const links = ref([
  //{ label: 'Administración', icon: 'pi pi-file-edit', route: '/' },
  { label: 'Inquilinos', icon: 'pi pi-users', route: '/tenants' },
  { label: 'Cuartos', icon: 'pi pi-home', route: '/rooms' },
  { label: 'Servicios', icon: 'pi pi-bolt', route: '/services' },
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