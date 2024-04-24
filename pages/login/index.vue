<script lang="ts" setup>
import type { z } from 'zod'
import type { loginSchema } from '~/schemas'
import { reactive, ref } from 'vue'

type LoginUser = z.infer<typeof loginSchema>
type DataResponse = ApiResponse<UserData>

const { showNotification } = useNotification()
const body = reactive<LoginUser>({
  username: '',
  password: ''
})

const loading = ref(false)
const token = useCookie('token', {
  sameSite: 'strict'
})

const { data: response, error, execute } = await useLazyApiFetch<DataResponse>('/api/auth/login', {
  method: 'POST',
  body: body,
  server: false,
  immediate: false,
  watch: false
})
const login = async () => {
  loading.value = true
  await execute()
  loading.value = false

  if (error.value) {
    showNotification('error')
  } else {
    token.value = response.value?.data?.token
    navigateTo('/')
  }

}
</script>

<template>
  <div class="mx-auto">
    <Card>
      <template #title>Iniciar sesión</template>
      <template #content>
        <form ref="form" class="form">
          <div class="form-group">
            <label for="username">Nombre de usuario</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user" />
              </InputGroupAddon>
              <InputText v-model="body.username" input-id="username" placeholder="Username" />
            </InputGroup>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-lock" />
              </InputGroupAddon>
              <InputText v-model="body.password" input-id="password" type="password" placeholder="**********" />
            </InputGroup>
          </div>

          <Button type="submit" label="Ingresar" :loading="loading" block @click.prevent="login" />
        </form>
      </template>
    </Card>
  </div>
</template>