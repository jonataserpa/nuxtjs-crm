// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],

  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
    },
  ],

  tailwindcss: {
    cssPath: false,
    configPath: 'tailwind.config'
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  ssr: true,

  nitro: {
    esbuild: {
      options: {
        target: 'ES2022'
      }
    }
  }
})
