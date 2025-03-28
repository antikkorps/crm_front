// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  // Définir les modules une seule fois
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "vuetify-nuxt-module",
  ],

  tailwindcss: {
    configPath: "~/tailwind.config.js",
    exposeConfig: true,
    viewer: true,
  },

  vuetify: {
    moduleOptions: {
      includeTransformAssetsUrls: {
        "v-img": ["src", "lazy-src"],
      },
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        variations: {
          colors: ["primary", "secondary"],
          darken: 4,
          lighten: 4,
        },
        themes: {
          light: {
            dark: false,
            colors: {
              primary: "#1867C0",
              secondary: "#5CBBF6",
              accent: "#4CAF50",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
              background: "#FFFFFF",
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: "#2196F3",
              secondary: "#03A9F4",
              accent: "#81C784",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
              background: "#121212",
            },
          },
        },
      },
      icons: {
        defaultSet: "mdi",
      },
    },
  },

  // Assurez-vous que les icônes MDI sont correctement chargées
  plugins: ["~/plugins/mdi-icons.client.ts", "~/plugins/vuetify-theme.client.ts"],

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
