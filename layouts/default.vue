<template>
  <div class="flex min-h-screen">
    <aside class="w-64 overflow-y-auto bg-primary-color">
      <UCard :ui="{
        base: 'flex flex-col h-screen',
        background: 'dark:bg-primary-950',
        rounded: '',
        body: { padding: '' },
        footer: { base: 'mt-auto' }
      }">
        <template #header>
          <h2>App Falcón</h2>
        </template>
        <UVerticalNavigation :links="links" :ui="{
          active: 'dark:before:bg-secondary-color before:bg-secondary-color',
        }" />
        <template #footer>
          <UButton block @click="logout">Cerrar sesión</UButton>
        </template>
      </UCard>
    </aside>
      <main>
        <slot />
      </main>
  </div>
</template>

<script lang="ts" setup>
const links = [
  { label: 'Inicio', icon: 'i-heroicons-home-solid', to: '/' },
  { label: 'Inquilinos', icon: 'i-heroicons-user-group-solid', to: '/tenants' },
  { label: 'Historial', icon: 'i-heroicons-clipboard-document-list-solid', to: '/history' },
  { label: 'Servicios', icon: 'i-heroicons-light-bulb-solid', to: '/services' },
  { label: 'Cuartos', icon: 'i-heroicons-home-solid', to: '/rooms' },
]

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