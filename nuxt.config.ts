// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui',],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      jwtSecretKey: process.env.JWT_SECRET_TOKEN,
      tokenMaxAge: process.env.TOKEN_MAX_AGE
    }
  }
})
