// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3030",
      appName: process.env.NUXT_PUBLIC_APP_NAME || "CRM Client Portal",
    },
  },
  css: ["~/assets/css/main.css", "~/assets/css/dark-mode.css"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  app: {
    head: {
      title: "CRM Client Portal",
      meta: [
        { name: "description", content: "Portal client pour accéder à vos données CRM" },
      ],
    },
  },
})
