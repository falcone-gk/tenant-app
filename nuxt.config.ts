// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-primevue', 'nuxt-viewport', "@nuxt/eslint"],
  css: [
    'primevue/resources/themes/aura-light-teal/theme.css',
    'primeicons/primeicons.css',
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      jwtSecretKey: process.env.JWT_SECRET_TOKEN,
      tokenMaxAge: process.env.TOKEN_MAX_AGE
    }
  }
})