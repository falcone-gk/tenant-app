import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.vue'],
  rules: {
    "vue/first-attribute-linebreak": 'off'
  }
})