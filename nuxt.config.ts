import Aura from "@primeuix/themes/aura"

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
    "@primevue/nuxt-module",
  ],

  tailwindcss: {
    configPath: "~/tailwind.config.js",
    exposeConfig: true,
    viewer: true,
  },

  primevue: {
    options: {
      ripple: true,
      inputStyle: "filled",
      // Configuration du thème de PrimeVue
      theme: {
        dark: true,
        preset: Aura,
        options: {
          darkModeSelector: "html.dark",
        },
      },
    },
    components: {
      include: [
        "Button",
        "InputText",
        "Password",
        "Toast",
        "Drawer",
        "Menu",
        "Menubar",
        "Avatar",
        "Badge",
        "Sidebar",
        "Dialog",
      ],
    },
    directives: {
      include: ["ripple", "styleclass", "tooltip"],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3030",
      appName: process.env.NUXT_PUBLIC_APP_NAME || "CRM",
    },
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/css/dark-mode.css",
    "~/assets/css/theme-loader.css",
  ],
  app: {
    head: {
      title: "CRM",
      meta: [{ name: "description", content: "Portal pour accéder à vos données CRM" }],
      script: [
        {
          innerHTML: `
          (function() {
            const storedTheme = localStorage.getItem("theme");
            
            if (storedTheme === "dark" || 
                (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
              document.documentElement.classList.add("dark");
            }
          })();
        `,
          type: "text/javascript",
        },
      ],
    },
  },
})
