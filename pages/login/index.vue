<template>
  <div class="mx-auto">
    <UCard>
      <template #header>
        <h2 class="text-center">Iniciar sesión</h2>
      </template>
      <UForm ref="form" class="space-y-4" :state="body" :schema="loginSchema">
        <UFormGroup label="Nombre de usuario" name="username">
          <UInput v-model="body.username" placeholder="admin" icon="i-heroicons-user-solid" />
        </UFormGroup>
        <UFormGroup label="Contraseña" name="password">
          <UInput type="password" v-model="body.password" placeholder="************" icon="i-heroicons-lock-closed-solid" />
        </UFormGroup>
        <UButton type="submit" label="Ingresar" @click="login" :loading="loading" block />
      </UForm>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import { loginSchema } from '~/schemas'
import { reactive, ref } from 'vue'
import type { Form, FormSubmitEvent } from '#ui/types'

type LoginUser = z.infer<typeof loginSchema>
type DataResponse = ApiResponse<UserData>

const form = ref<Form<LoginUser> | undefined>()
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
const login = async (event: FormSubmitEvent<LoginUser>) => {

  if (!form.value) {
    return
  }

  try {
    await form.value?.validate()
  } catch (e) {
    return
  }

  loading.value = true
  await execute()
  loading.value = false

  if (error.value) {
    form.value?.setErrors([{ message: 'Credenciales incorrectas', path: 'password' }])
  } else {
    token.value = response.value?.data?.token
    navigateTo('/')
  }

}
</script>