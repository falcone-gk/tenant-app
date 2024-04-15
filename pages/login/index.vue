<script lang="ts" setup>
import { z } from 'zod'
import { loginSchema } from '~/schemas'
import { reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast';

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

const { data: response, error, execute } = await useLazyFetch<DataResponse>('/api/auth/login', {
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
        <form class="form" ref="form">
          <div class="form-group">
            <label for="username">Nombre de usuario</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user"></i>
              </InputGroupAddon>
              <InputText id="username" v-model="body.username" placeholder="Username" />
            </InputGroup>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>
              <InputText id="password" v-model="body.password" type="password" placeholder="**********" />
            </InputGroup>
          </div>

          <Button type="submit" label="Ingresar" @click.prevent="login" :loading="loading" block />
        </form>
      </template>
    </Card>
  </div>
</template>